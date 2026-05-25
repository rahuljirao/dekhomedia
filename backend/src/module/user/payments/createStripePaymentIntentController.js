const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
const Stripe = require('stripe');
const GeoLocationService = require("../../../services/geoLocationService");
const CurrencyService = require("../../../services/currencyService");

class CreateStripePaymentIntentController {
    static async createStripePaymentIntent(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await CreateStripePaymentIntentController.createStripePaymentIntentValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const createStripePaymentIntentResponse = await CreateStripePaymentIntentController.createStripePaymentIntentOperation(
                request,
                corelationId,
                context,
                authorizer,
                event
            );

            if (createStripePaymentIntentResponse?.responseCode === "OK") {
                return context.send(createStripePaymentIntentResponse);
            } else {
                return context.status(400).send(createStripePaymentIntentResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async createStripePaymentIntentOperation(data, corelationId, context, authorizer, event) {
        console.log(authorizer, 'authorizer');
        try {
            const [rows1] = await db.query('SELECT * FROM payment_getways WHERE id = ?', [data?.payment_getway_id]);
            if (rows1.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_PAYMENT_METHOD,
                    responseMessage: getStatusText(responsecodes().INVALID_PAYMENT_METHOD),
                    responseData: {}
                });
            }
            
            const [getTransaction] = await db.query('SELECT * FROM users_payments WHERE transaction_id = ? AND user_id = ? AND plan_id = ? AND status = ?', [data?.transaction_id, authorizer?.id, data?.plan_id, 0]);
            if (getTransaction.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_TRANSACTION_ID,
                    responseMessage: getStatusText(responsecodes().INVALID_TRANSACTION_ID),
                    responseData: {}
                });
            }

            let paymentMethod = rows1[0];
            let transaction = getTransaction[0];

            // Get user's location and currency
            const locationInfo = await GeoLocationService.getLocationAndCurrency(event);

            // Get the best currency for Stripe (use user's currency if supported)
            let currency = transaction?.currency?.toLowerCase() || locationInfo.currency.toLowerCase();

            // Validate currency is supported by Stripe
            if (!GeoLocationService.isStripeSupportedCurrency(currency)) {
                currency = 'usd';
            }

            // Convert amount if needed (amount comes in user's currency)
            let amountInCurrency = transaction?.amount;

            // Calculate amount in smallest unit (cents/paise)
            const amountInSmallestUnit = CurrencyService.getAmountInSmallestUnit(amountInCurrency, currency);

            const stripe = new Stripe(paymentMethod?.api_key);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInSmallestUnit,
                currency: currency,
                metadata: {
                    transaction_id: data?.transaction_id,
                    user_id: authorizer?.id,
                    original_currency: currency.toUpperCase(),
                    original_amount: amountInCurrency.toString()
                },
                automatic_payment_methods: {
                    enabled: true
                },
            });

            console.log({
                amount: amountInSmallestUnit,
                currency: currency,
                metadata: {
                    transaction_id: data?.transaction_id,
                    user_id: authorizer?.id,
                    original_currency: currency.toUpperCase(),
                    original_amount: amountInCurrency.toString()
                },
                automatic_payment_methods: {
                    enabled: true
                }
            })

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    clientSecret: paymentIntent?.client_secret,
                    paymentIntentId: paymentIntent?.id,
                    currency: currency.toUpperCase(),
                    currencySymbol: GeoLocationService.getCurrencySymbol(currency),
                    amount: amountInCurrency,
                    formattedAmount: CurrencyService.formatAmount(amountInCurrency, currency),
                    userLocation: {
                        countryCode: locationInfo.countryCode,
                        country: locationInfo.country
                    }
                }
            });
        } catch (err) {
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async createStripePaymentIntentValidator(req) {
        let errObj = {};

        if (!req?.payment_getway_id) {
            errObj = {
                responseCode: responsecodes().PAYMENT_METHOD_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PAYMENT_METHOD_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.plan_id) {
            errObj = {
                responseCode: responsecodes().PLAN_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PLAN_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.transaction_id) {
            errObj = {
                responseCode: responsecodes().TRANSACTION_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().TRANSACTION_ID_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = CreateStripePaymentIntentController;
