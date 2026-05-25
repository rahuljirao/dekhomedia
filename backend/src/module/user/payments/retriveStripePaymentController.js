const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
const crypto = require("crypto");
const Stripe = require('stripe');

class RetriveStripePaymentController {
    static async retriveStripePayment(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await RetriveStripePaymentController.retriveStripePaymentValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const retriveStripePaymentResponse = await RetriveStripePaymentController.retriveStripePaymentOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (retriveStripePaymentResponse?.responseCode === "OK") {
                return context.send(retriveStripePaymentResponse);
            } else {
                return context.status(400).send(retriveStripePaymentResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async retriveStripePaymentOperation(data, corelationId, context, authorizer) {
        try {
            const { payment_intent_id, payment_getway_id } = data;

            const [rows1] = await db.query('SELECT * FROM payment_getways WHERE name LIKE ?', [`%${payment_getway_id}%`]);
            if (rows1.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_PAYMENT_METHOD,
                    responseMessage: getStatusText(responsecodes().INVALID_PAYMENT_METHOD),
                    responseData: {}
                });
            }

            let paymentMethod = rows1[0];
            
            const stripe = new Stripe(paymentMethod?.api_key);

            const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
            const transactionId = paymentIntent?.metadata?.transaction_id;

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    transaction_id: transactionId
                }
            })
        } catch (err) {
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async retriveStripePaymentValidator(req) {
        let errObj = {};

        if (!req?.payment_intent_id) {
            errObj = {
                responseCode: responsecodes().PAYMENT_INTENT_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_INTENT_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.payment_getway_id) {
            errObj = {
                responseCode: responsecodes().PAYMENT_METHOD_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_METHOD_ID_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = RetriveStripePaymentController;
