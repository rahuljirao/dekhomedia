const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetTransactionController {
    static async getTransactions(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform update operation
            const getTransactionsResponse = await GetTransactionController.getTransactionsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getTransactionsResponse?.responseCode === "OK") {
                return context.send(getTransactionsResponse);
            } else {
                return context.status(400).send(getTransactionsResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getTransactionsOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT a.*, b.name, b.is_unlimited, b.is_weekly, b.is_monthly, b.is_yearly, b.coin, b.extra_coin, b.discount_percentage, b.is_limited_time, b.description, b.is_active, b.is_deleted FROM users_payments a LEFT JOIN plans b ON a.plan_id = b.id WHERE a.user_id = ? ORDER BY a.created_at DESC', [authorizer?.id]);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: rows
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetTransactionController;
