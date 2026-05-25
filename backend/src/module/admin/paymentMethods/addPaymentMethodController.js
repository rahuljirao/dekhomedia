const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class AddPaymentMethodController {

    static async addPaymentMethod(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AddPaymentMethodController.addPaymentMethodValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addPaymentMethodResponse = await AddPaymentMethodController.addPaymentMethodOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (addPaymentMethodResponse?.responseCode === "OK") {
                return context.send(addPaymentMethodResponse);
            } else {
                return context.status(400).send(addPaymentMethodResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addPaymentMethodOperation(req, corelationId, context, authorizer) {
        try {
            const query = `INSERT INTO payment_getways (name, api_id, api_key) VALUES (?, ?, ?)`;
            const values = [
                req?.name,
                req?.api_id,
                req?.api_key
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: result?.insertId,
                    name: req?.name,
                    api_id: req?.api_id,
                    api_key: req?.api_key
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addPaymentMethodValidator(req) {
        let errObj = {};
        if (!req?.name) {
            return {
                responseCode: responsecodes().PAYMENT_METHOD_NAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_METHOD_NAME_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.api_id) {
            return {
                responseCode: responsecodes().PAYMENT_METHOD_API_KEY_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_METHOD_API_KEY_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.api_key) {
            return {
                responseCode: responsecodes().PAYMENT_METHOD_API_KEY_TEST_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_METHOD_API_KEY_TEST_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = AddPaymentMethodController;
