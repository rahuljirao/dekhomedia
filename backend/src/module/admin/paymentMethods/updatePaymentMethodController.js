const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdatePaymentMethodController {

    static async updatePaymentMethod(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdatePaymentMethodController.updatePaymentMethodValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updatePaymentMethodResponse = await UpdatePaymentMethodController.updatePaymentMethodOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updatePaymentMethodResponse?.responseCode === "OK") {
                return context.send(updatePaymentMethodResponse);
            } else {
                return context.status(400).send(updatePaymentMethodResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updatePaymentMethodOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM payment_getways WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_PAYMENT_METHOD,
                    responseMessage: getStatusText(responsecodes().INVALID_PAYMENT_METHOD),
                    responseData: {}
                });
            }
            const query = `UPDATE payment_getways SET name = ?, api_id = ?, api_key = ? WHERE id = ?`;
            const values = [
                req?.name,
                req?.api_id,
                req?.api_key,
                req?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: req?.id,
                    name: req?.name,
                    api_id: req?.api_id,
                    api_key: req?.api_key
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updatePaymentMethodValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().PAYMENT_METHOD_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_METHOD_ID_REQUIRED),
                responseData: {}
            };
        }
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

module.exports = UpdatePaymentMethodController;
