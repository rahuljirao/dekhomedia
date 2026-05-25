const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateFAQController {

    static async updateFAQ(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateFAQController.updateFAQValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateFAQResponse = await UpdateFAQController.updateFAQOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateFAQResponse?.responseCode === "OK") {
                return context.send(updateFAQResponse);
            } else {
                return context.status(400).send(updateFAQResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateFAQOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM faqs WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_FAQ,
                    responseMessage: getStatusText(responsecodes().INVALID_FAQ),
                    responseData: {}
                });
            }
            const query = `UPDATE faqs SET question = ?, answer = ? WHERE id = ?`;
            const values = [
                req?.question,
                req?.answer,
                req?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: req?.id,
                    question: req?.question,
                    answer: req?.answer,
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateFAQValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().FAQ_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().FAQ_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.question) {
            return {
                responseCode: responsecodes().QUESTION_REQUIRED,
                responseMessage: getStatusText(responsecodes().QUESTION_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.answer) {
            return {
                responseCode: responsecodes().ANSWER_REQUIRED,
                responseMessage: getStatusText(responsecodes().ANSWER_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateFAQController;
