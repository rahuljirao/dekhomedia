const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetUsersVIPPlanListController {

    static async getUsersVIPPlanList(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetUsersVIPPlanListController.getUsersVIPPlanListValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform update operation
            const updateUserResponse = await GetUsersVIPPlanListController.getUsersVIPPlanListOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateUserResponse?.responseCode === "OK") {
                return context.send(updateUserResponse);
            } else {
                return context.status(400).send(updateUserResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getUsersVIPPlanListOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            const { search, start, length, dir, sortColumn, id } = req;

            const limit = length || 10;
            const offset = start || 0;
            const searchValue = search || '';
            const orderBy = dir?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

            const [result] = await db.query(
                `SELECT up.*, 
                        p.name AS plan_name, p.is_unlimited, p.is_weekly, p.is_monthly, p.is_yearly, 
                        p.coin AS plan_coin, p.extra_coin, p.amount, p.discount_percentage, 
                        p.is_limited_time, p.description AS plan_description, 
                        pg.name AS payment_getway_name, pg.api_key, pg.api_id,
                        CASE up.status
                            WHEN 0 THEN 'Pending'
                            WHEN 1 THEN 'In Process'
                            WHEN 2 THEN 'Completed'
                            WHEN 3 THEN 'Cancelled'
                            ELSE 'Unknown'
                        END AS status_label
                FROM users_payments up
                LEFT JOIN plans p ON up.plan_id = p.id
                LEFT JOIN payment_getways pg ON up.payment_getway_id = pg.id
                WHERE up.user_id = ? AND p.is_unlimited = 1
                    AND (up.transaction_id LIKE ? OR up.transaction_key LIKE ? OR p.name LIKE ? OR pg.name LIKE ?) 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?`,
                [id, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, parseInt(limit), parseInt(offset)]
            );

            const [count] = await db.query(`SELECT COUNT(*) as total FROM users_payments up LEFT JOIN plans p ON up.plan_id = p.id WHERE up.user_id = ?  AND p.is_unlimited = 1`, [id]);

            const [filteredCount] = await db.query(
                `SELECT COUNT(*) as total
                FROM users_payments up
                LEFT JOIN plans p ON up.plan_id = p.id
                LEFT JOIN payment_getways pg ON up.payment_getway_id = pg.id
                WHERE up.user_id = ?  AND p.is_unlimited = 1
                    AND (
                        up.transaction_id LIKE ? OR 
                        up.transaction_key LIKE ? OR 
                        p.name LIKE ? OR 
                        pg.name LIKE ?
                    )`,
                [id, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`]
            );

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    data: result,
                    totalRecords: count[0].total,
                    recordsFiltered: filteredCount[0].total
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getUsersVIPPlanListValidator(req) {
        let errObj = {};

        if (!req?.id) {
            return {
                responseCode: responsecodes().REQUEST_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().REQUEST_ID_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = GetUsersVIPPlanListController;
