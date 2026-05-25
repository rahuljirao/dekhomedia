const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetTicketReasonListController {

    static async getTicketReasonList(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform update operation
            const updateUserResponse = await GetTicketReasonListController.getTicketReasonListOperation(
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

    static async getTicketReasonListOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }

            const [result] = await db.query(`SELECT * FROM report_reasons WHERE is_active = 1 AND is_deleted = 0`);

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

module.exports = GetTicketReasonListController;
