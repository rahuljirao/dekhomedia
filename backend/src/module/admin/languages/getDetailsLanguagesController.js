const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetDetailsLanguagesController {

    static async getDetailsLanguages(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetDetailsLanguagesController.getDetailsLanguagesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const deleteLanguages = await GetDetailsLanguagesController.getDetailsLanguagesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deleteLanguages?.responseCode === "OK") {
                return context.send(deleteLanguages);
            } else {
                return context.status(400).send(deleteLanguages);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getDetailsLanguagesOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM languages WHERE id = ?', [data?.language_id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_LANGUAGE,
                    responseMessage: getStatusText(responsecodes().INVALID_LANGUAGE),
                    responseData: {}
                });
            }

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: rows[0]
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getDetailsLanguagesValidator(req) {
        let errObj = {};

        if (!req?.language_id) {
            return {
                responseCode: responsecodes().REQUEST_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().REQUEST_ID_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = GetDetailsLanguagesController;
