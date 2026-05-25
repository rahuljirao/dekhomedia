const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
class CreateTicketController {
    static async createTicket(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await CreateTicketController.createTicketValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const createTicketResponse = await CreateTicketController.createTicketOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (createTicketResponse?.responseCode === "OK") {
                return context.send(createTicketResponse);
            } else {
                return context.status(400).send(createTicketResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async createTicketOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM report_reasons WHERE id = ?', [data?.reason_id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_REPORT_REASON,
                    responseMessage: getStatusText(responsecodes().INVALID_REPORT_REASON),
                    responseData: {}
                });
            }
            const [checkEmail] = await db.query('SELECT * FROM user_reported WHERE email = ? AND (status = ? || status = ?)', [data.email, 'Pending', 'In Progress']);
            if(checkEmail.length > 0){
                return await utils.generateResponseObj({
                    responseCode: responsecodes().YOUR_QUERY_IS_IN_PROGRESS,
                    responseMessage: getStatusText(responsecodes().YOUR_QUERY_IS_IN_PROGRESS),
                    responseData: {}
                });
            }
            let Ticket_id = await utils.generate16DigitUUID();
            const query = 'INSERT into user_reported (ticket_id, name, email, reason, description) values (?, ?, ?, ?, ?)';
            const values = [
                Ticket_id,
                data?.name,
                data?.email,
                rows[0].reason_title,
                data?.description
            ];
            const [result] = await db.query(query, values);
            const [newRows] = await db.query('SELECT * FROM user_reported WHERE id = ?', [result?.insertId]);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: newRows[0]
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async createTicketValidator(req) {
        let errObj = {};
        if (!req?.name) {
            errObj = {
                responseCode: responsecodes().NAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().NAME_REQUIRED),
                responseData: {}
            };
        }
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
        if (!req?.reason_id) {
            errObj = {
                responseCode: responsecodes().REASON_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().REASON_ID_REQUIRED),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = CreateTicketController;
