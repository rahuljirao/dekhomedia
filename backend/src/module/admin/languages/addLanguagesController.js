const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class AddLanguagesController {

    static async addLanguages(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AddLanguagesController.addLanguagesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addLanguagesResponse = await AddLanguagesController.addLanguagesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (addLanguagesResponse?.responseCode === "OK") {
                return context.send(addLanguagesResponse);
            } else {
                return context.status(400).send(addLanguagesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addLanguagesOperation(req, corelationId, context, authorizer) {
        try {
            const query = `INSERT INTO languages (name) VALUES (?)`;
            const values = [
                req?.name
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: result?.insertId,
                    name: req?.name,
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addLanguagesValidator(req) {
        let errObj = {};
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

module.exports = AddLanguagesController;
