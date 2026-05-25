const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
class GetMyTicketsController {
    static async getMyTickets(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetMyTicketsController.getMyTicketsValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const getMyTicketsResponse = await GetMyTicketsController.getMyTicketsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getMyTicketsResponse?.responseCode === "OK") {
                return context.send(getMyTicketsResponse);
            } else {
                return context.status(400).send(getMyTicketsResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getMyTicketsOperation(data, corelationId, context, authorizer) {
        try {
            const [newRows] = await db.query('SELECT * FROM user_reported WHERE email = ?', [data.email]);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: newRows
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async getMyTicketsValidator(req) {
        let errObj = {};
        if (!req?.email) {
            errObj = {
                responseCode: responsecodes().EMAIL_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().EMAIL_ID_REQUIRED),
                responseData: {}
            };
        }
        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const isEmailValid = validateEmail(req?.email);
        if (!isEmailValid) {
            return {
                responseCode: responsecodes().EMAIL_REQUIRED,
                responseMessage: getStatusText(responsecodes().EMAIL_REQUIRED),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = GetMyTicketsController;
