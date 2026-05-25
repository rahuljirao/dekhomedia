const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class DeleteFAQController {

    static async deleteFAQ(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await DeleteFAQController.deleteFAQValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const deleteFAQResponse = await DeleteFAQController.deleteFAQOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deleteFAQResponse?.responseCode === "OK") {
                return context.send(deleteFAQResponse);
            } else {
                return context.status(400).send(deleteFAQResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deleteFAQOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM faqs WHERE id = ?', [data?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_FAQ,
                    responseMessage: getStatusText(responsecodes().INVALID_FAQ),
                    responseData: {}
                });
            }

            const query = `DELETE FROM faqs WHERE id = ?`;
            const values = [
                data?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {}
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deleteFAQValidator(req) {
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

module.exports = DeleteFAQController;
