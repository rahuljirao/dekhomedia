const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetDetailsTypesController {

    static async getDetailsTypes(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetDetailsTypesController.getDetailsTypesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const deleteTypes = await GetDetailsTypesController.getDetailsTypesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deleteTypes?.responseCode === "OK") {
                return context.send(deleteTypes);
            } else {
                return context.status(400).send(deleteTypes);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getDetailsTypesOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM types WHERE id = ?', [data?.type_id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_TYPE,
                    responseMessage: getStatusText(responsecodes().INVALID_TYPE),
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

    static async getDetailsTypesValidator(req) {
        let errObj = {};

        if (!req?.type_id) {
            return {
                responseCode: responsecodes().REQUEST_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().REQUEST_ID_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = GetDetailsTypesController;
