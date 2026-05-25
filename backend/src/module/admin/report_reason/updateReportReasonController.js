const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateReportReasonController {

    static async updateReportReason(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateReportReasonController.updateReportReasonValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateReportReasonResponse = await UpdateReportReasonController.updateReportReasonOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateReportReasonResponse?.responseCode === "OK") {
                return context.send(updateReportReasonResponse);
            } else {
                return context.status(400).send(updateReportReasonResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateReportReasonOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM report_reasons WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_REPORT_REASON,
                    responseMessage: getStatusText(responsecodes().INVALID_REPORT_REASON),
                    responseData: {}
                });
            }
            const query = `UPDATE report_reasons SET reason_title = ? WHERE id = ?`;
            const values = [
                req?.reason_title,
                req?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: req?.id,
                    reason_title: req?.reason_title,
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateReportReasonValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().REASON_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().REASON_ID_REQUIRED),
                responseData: {}
            };
        }
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

module.exports = UpdateReportReasonController;
