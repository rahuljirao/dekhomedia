const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class DeletePaymentMethodController {

    static async deletePaymentMethod(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await DeletePaymentMethodController.deletePaymentMethodValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const deletePaymentMethodResponse = await DeletePaymentMethodController.deletePaymentMethodOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deletePaymentMethodResponse?.responseCode === "OK") {
                return context.send(deletePaymentMethodResponse);
            } else {
                return context.status(400).send(deletePaymentMethodResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deletePaymentMethodOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM payment_getways WHERE id = ?', [data?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_TAG,
                    responseMessage: getStatusText(responsecodes().INVALID_TAG),
                    responseData: {}
                });
            }

            const query = `UPDATE payment_getways SET is_deleted = 1 WHERE id = ?`;
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

    static async deletePaymentMethodValidator(req) {
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

module.exports = DeletePaymentMethodController;
