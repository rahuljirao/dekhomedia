const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetUsersCoinPlanListController {

    static async getUsersCoinPlanList(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform update operation
            const updateUserResponse = await GetUsersCoinPlanListController.getUsersCoinPlanListOperation(
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

    static async getUsersCoinPlanListOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }

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
                WHERE up.user_id = ? AND p.is_unlimited = 0
                ORDER BY up.id DESC`,
                [authorizer?.id]
            );

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: result
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetUsersCoinPlanListController;
