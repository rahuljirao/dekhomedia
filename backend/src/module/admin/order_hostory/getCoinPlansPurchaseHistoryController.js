const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetCoinPlansPurchaseHistoryController {

    static async getCoinPlansPurchaseHistoryList(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform update operation
            const updateUserResponse = await GetCoinPlansPurchaseHistoryController.getCoinPlansPurchaseHistoryListOperation(
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

    static async getCoinPlansPurchaseHistoryListOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            const { search, start, length, dir, sortColumn } = req;

            const limit = length || 10;
            const offset = start || 0;
            const searchValue = search || '';
            const column = sortColumn || 'last_payment_date';
            const orderBy = dir?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

            const [result] = await db.query(
                `SELECT 
                    u.id AS user_id,
                    u.name AS user_name,
                    COUNT(up.id) AS total_purchases,
                    SUM(up.amount) AS total_amount_spent,
                    MAX(up.created_at) AS last_payment_date
                FROM users_payments up
                JOIN users u ON up.user_id = u.id
                JOIN plans p ON up.plan_id = p.id
                WHERE up.status = 2 AND p.is_unlimited = 0 AND u.name LIKE ?
                GROUP BY u.id, u.name
                ORDER BY ${column} ${orderBy}
                LIMIT ? OFFSET ?`,
                [`%${searchValue}%`, parseInt(limit), parseInt(offset)]
            );

            const [count] = await db.query(`SELECT 
                     COUNT(DISTINCT u.id) AS total
                FROM users_payments up
                JOIN users u ON up.user_id = u.id
                JOIN plans p ON up.plan_id = p.id
                WHERE up.status = 2 AND p.is_unlimited = 0`);

            const [countResult] = await db.query(
                `SELECT 
                    COUNT(DISTINCT u.id) AS total
                FROM users_payments up
                JOIN users u ON up.user_id = u.id
                JOIN plans p ON up.plan_id = p.id
                WHERE up.status = 2 AND p.is_unlimited = 0 AND u.name LIKE ?`,
                [`%${searchValue}%`]
            );
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    data: result,
                    totalRecords: count[0]?.total || 0,
                    recordsFiltered: countResult[0]?.total || 0
                }
            });
        } catch (err) {
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetCoinPlansPurchaseHistoryController;