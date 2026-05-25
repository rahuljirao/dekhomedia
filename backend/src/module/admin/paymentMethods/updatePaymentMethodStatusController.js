const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdatePaymentMethodStatusController {

    static async updatePaymentMethodStatus(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdatePaymentMethodStatusController.updatePaymentMethodStatusValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updatePaymentMethodStatusResponse = await UpdatePaymentMethodStatusController.updatePaymentMethodStatusOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updatePaymentMethodStatusResponse?.responseCode === "OK") {
                return context.send(updatePaymentMethodStatusResponse);
            } else {
                return context.status(400).send(updatePaymentMethodStatusResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updatePaymentMethodStatusOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM payment_getways WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_PAYMENT_METHOD,
                    responseMessage: getStatusText(responsecodes().INVALID_PAYMENT_METHOD),
                    responseData: {}
                });
            }
            let rowsData = rows[0];
            const query = `UPDATE payment_getways SET is_active = ? WHERE id = ?`;
            const values = [
                req?.is_active,
                req?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: rowsData?.id,
                    name: rowsData?.name,
                    api_id: rowsData?.api_id,
                    api_key: rowsData?.api_key,
                    is_active: req?.is_active
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updatePaymentMethodStatusValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().PAYMENT_METHOD_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_METHOD_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.is_active) {
            return {
                responseCode: responsecodes().PAYMENT_METHOD_ACTIVE_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_METHOD_ACTIVE_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdatePaymentMethodStatusController;
