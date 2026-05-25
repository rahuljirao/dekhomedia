const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetDetailsAdsPlatformController {

    static async getDetailsAdsPlatform(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetDetailsAdsPlatformController.getDetailsAdsPlatformValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const getAdsPlatform = await GetDetailsAdsPlatformController.getDetailsAdsPlatformOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getAdsPlatform?.responseCode === "OK") {
                return context.send(getAdsPlatform);
            } else {
                return context.status(400).send(getAdsPlatform);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getDetailsAdsPlatformOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM advertisement WHERE id = ?', [data?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_ADVERTISEMENT_ID,
                    responseMessage: getStatusText(responsecodes().INVALID_ADVERTISEMENT_ID),
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

    static async getDetailsAdsPlatformValidator(req) {
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

module.exports = GetDetailsAdsPlatformController;
