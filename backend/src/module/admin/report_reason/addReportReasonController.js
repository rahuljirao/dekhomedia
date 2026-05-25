const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class AddReportReasonController {

    static async addReportReason(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AddReportReasonController.addReportReasonValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addReportReasonResponse = await AddReportReasonController.addReportReasonOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (addReportReasonResponse?.responseCode === "OK") {
                return context.send(addReportReasonResponse);
            } else {
                return context.status(400).send(addReportReasonResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addReportReasonOperation(req, corelationId, context, authorizer) {
        try {
            const query = `INSERT INTO report_reasons (reason_title) VALUES (?)`;
            const values = [
                req?.reason_title
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: result?.insertId,
                    reason_title: req?.reason_title,
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addReportReasonValidator(req) {
        let errObj = {};
        if (!req?.reason_title) {
            return {
                responseCode: responsecodes().REASON_TITLE_REQUIRED,
                responseMessage: getStatusText(responsecodes().REASON_TITLE_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = AddReportReasonController;
