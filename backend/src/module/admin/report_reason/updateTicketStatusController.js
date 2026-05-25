const { responsecodes } = require("../../../response-codes/lib");
const constants = require("../../../common/constants");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateTicketStatusController {

    static async updateTicketStatus(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateTicketStatusController.updateTicketStatusValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateTicketStatusResponse = await UpdateTicketStatusController.updateTicketStatusOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateTicketStatusResponse?.responseCode === "OK") {
                return context.send(updateTicketStatusResponse);
            } else {
                return context.status(400).send(updateTicketStatusResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateTicketStatusOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM user_reported WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_TICKET_ID,
                    responseMessage: getStatusText(responsecodes().INVALID_TICKET_ID),
                    responseData: {}
                });
            }
            const query = `UPDATE user_reported SET status = ? WHERE id = ?`;
            const values = [
                req?.status,
                req?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: req?.id,
                    status: req?.status,
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateTicketStatusValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().TICKET_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().TICKET_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.status) {
            return {
                responseCode: responsecodes().TICKET_STATUS_REQUIRED,
                responseMessage: getStatusText(responsecodes().TICKET_STATUS_REQUIRED),
                responseData: {}
            };
        } else if (!constants.TICKET_STATUS.includes(req?.status)){
			return {
                responseCode: responsecodes().INVALID_TICKET_STATUS,
                responseMessage: getStatusText(responsecodes().INVALID_TICKET_STATUS),
                responseData: {}
            };
		}
        

        return errObj;
    }
}

module.exports = UpdateTicketStatusController;
