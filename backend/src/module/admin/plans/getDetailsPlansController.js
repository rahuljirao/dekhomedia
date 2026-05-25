const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetDetailsPlansController {

    static async getDetailsPlans(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetDetailsPlansController.getDetailsPlansValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const deletePlans = await GetDetailsPlansController.getDetailsPlansOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deletePlans?.responseCode === "OK") {
                return context.send(deletePlans);
            } else {
                return context.status(400).send(deletePlans);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getDetailsPlansOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM plans WHERE id = ?', [data?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_PAYMENT_METHOD,
                    responseMessage: getStatusText(responsecodes().INVALID_PAYMENT_METHOD),
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

    static async getDetailsPlansValidator(req) {
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

module.exports = GetDetailsPlansController;
