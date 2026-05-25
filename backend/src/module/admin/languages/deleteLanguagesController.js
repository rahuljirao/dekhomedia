const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class DeleteLanguagesController {

    static async deleteLanguages(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await DeleteLanguagesController.deleteLanguagesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const deleteLanguagesResponse = await DeleteLanguagesController.deleteLanguagesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deleteLanguagesResponse?.responseCode === "OK") {
                return context.send(deleteLanguagesResponse);
            } else {
                return context.status(400).send(deleteLanguagesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deleteLanguagesOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM languages WHERE id = ?', [data?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_LANGUAGE,
                    responseMessage: getStatusText(responsecodes().INVALID_LANGUAGE),
                    responseData: {}
                });
            }

            const query = `UPDATE languages SET is_deleted = 1 WHERE id = ?`;
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

    static async deleteLanguagesValidator(req) {
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

module.exports = DeleteLanguagesController;
