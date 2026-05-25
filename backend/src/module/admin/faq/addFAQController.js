const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class AddFAQController {

    static async addFAQ(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AddFAQController.addFAQValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addFAQResponse = await AddFAQController.addFAQOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (addFAQResponse?.responseCode === "OK") {
                return context.send(addFAQResponse);
            } else {
                return context.status(400).send(addFAQResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addFAQOperation(req, corelationId, context, authorizer) {
        try {
            const query = `INSERT INTO faqs (question, answer) VALUES (?, ?)`;
            const values = [
                req?.question,
                req?.answer
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: result?.insertId,
                    question: req?.question,
                    answer: req?.answer,
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addFAQValidator(req) {
        let errObj = {};
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

module.exports = AddFAQController;
