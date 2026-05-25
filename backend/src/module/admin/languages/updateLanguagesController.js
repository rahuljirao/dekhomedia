const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateLanguagesController {

    static async updateLanguages(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateLanguagesController.updateLanguagesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateLanguagesResponse = await UpdateLanguagesController.updateLanguagesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateLanguagesResponse?.responseCode === "OK") {
                return context.send(updateLanguagesResponse);
            } else {
                return context.status(400).send(updateLanguagesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateLanguagesOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM languages WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_LANGUAGE,
                    responseMessage: getStatusText(responsecodes().INVALID_LANGUAGE),
                    responseData: {}
                });
            }
            const query = `UPDATE languages SET name = ? WHERE id = ?`;
            const values = [
                req?.name,
                req?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: req?.id,
                    name: req?.name,
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateLanguagesValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().LANGUAGE_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().LANGUAGE_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.name) {
            return {
                responseCode: responsecodes().LANGUAGE_NAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().LANGUAGE_NAME_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateLanguagesController;
