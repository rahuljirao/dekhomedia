const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
const crypto = require("crypto");

class VerifyRazorpayPaymentController {
    static async verifyRazorpayPayment(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await VerifyRazorpayPaymentController.verifyRazorpayPaymentValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const verifyRazorpayPaymentResponse = await VerifyRazorpayPaymentController.verifyRazorpayPaymentOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (verifyRazorpayPaymentResponse?.responseCode === "OK") {
                return context.send(verifyRazorpayPaymentResponse);
            } else {
                return context.status(400).send(verifyRazorpayPaymentResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async verifyRazorpayPaymentOperation(data, corelationId, context, authorizer) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_getway_id } = data;

            const [rows1] = await db.query('SELECT * FROM payment_getways WHERE id = ?', [payment_getway_id]);
            if (rows1.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_PAYMENT_METHOD,
                    responseMessage: getStatusText(responsecodes().INVALID_PAYMENT_METHOD),
                    responseData: {}
                });
            }

            let paymentMethod = rows1[0];
            
            const generated_signature = crypto
                .createHmac('sha256', paymentMethod.api_key)
                .update(razorpay_order_id + '|' + razorpay_payment_id)
                .digest('hex');

            if (generated_signature === razorpay_signature) {

                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {}
                });
            } else {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_SIGNATURE,
                    responseMessage: getStatusText(responsecodes().INVALID_SIGNATURE),
                    responseData: {}
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async verifyRazorpayPaymentValidator(req) {
        let errObj = {};

        if (!req?.payment_getway_id) {
            errObj = {
                responseCode: responsecodes().PAYMENT_METHOD_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_METHOD_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.razorpay_order_id) {
            errObj = {
                responseCode: responsecodes().ORDER_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().ORDER_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.razorpay_payment_id) {
            errObj = {
                responseCode: responsecodes().PAYMENT_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.razorpay_signature) {
            errObj = {
                responseCode: responsecodes().SIGNATURE_REQUIRED,
                responseMessage: getStatusText(responsecodes().SIGNATURE_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = VerifyRazorpayPaymentController;
