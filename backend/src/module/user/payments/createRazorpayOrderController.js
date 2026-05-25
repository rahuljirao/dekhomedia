const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
const Razorpay = require('razorpay');
const CurrencyService = require("../../../services/currencyService");
const GeoLocationService = require("../../../services/geoLocationService");

class CreateRazorpayOrderController {
    static async createRazorpayOrder(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await CreateRazorpayOrderController.createRazorpayOrderValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Get user's location and currency
            const locationInfo = await GeoLocationService.getLocationAndCurrency(event);
            console.log(locationInfo, 'locationInfo');

            // Perform update operation
            const createRazorpayOrderResponse = await CreateRazorpayOrderController.createRazorpayOrderOperation(
                request,
                corelationId,
                context,
                authorizer,
                locationInfo
            );

            if (createRazorpayOrderResponse?.responseCode === "OK") {
                return context.send(createRazorpayOrderResponse);
            } else {
                return context.status(400).send(createRazorpayOrderResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async createRazorpayOrderOperation(data, corelationId, context, authorizer, locationInfo) {
        try {

            const [rows1] = await db.query('SELECT * FROM payment_getways WHERE id = ?', [data?.payment_getway_id]);
            if (rows1.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_PAYMENT_METHOD,
                    responseMessage: getStatusText(responsecodes().INVALID_PAYMENT_METHOD),
                    responseData: {}
                });
            }
            const [rows] = await db.query('SELECT * FROM plans WHERE id = ?', [data?.plan_id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_PLAN,
                    responseMessage: getStatusText(responsecodes().INVALID_PLAN),
                    responseData: {}
                });
            }
            const [app_data] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);

            let paymentMethod = rows1[0];
            console.log(paymentMethod, locationInfo);

            let planDetails = rows[0];
            // Get converted price details
            const priceDetails = await CurrencyService.getPlanPriceInCurrency(
                planDetails.amount,
                app_data[0].currency_symbol,
                locationInfo.currency
            );
            
            // Add currency info to plan
            const planWithCurrency = {
                ...priceDetails,
                // Original price (in USD or base currency)
                original_amount: priceDetails.amount,
                original_currency: 'USD',
                // Converted price in user's currency
                amount_in_user_currency: priceDetails.convertedAmount,
                user_currency: locationInfo.currency,
                user_currency_symbol: locationInfo.currencySymbol,
                formatted_price: priceDetails.formattedAmount,
                // Display amount (use converted amount)
                display_amount: priceDetails.convertedAmount,
                display_currency: locationInfo.currency,
                display_currency_symbol: locationInfo.currencySymbol
            };

            const razorpay = new Razorpay({
                key_id: paymentMethod?.api_id,
                key_secret: paymentMethod?.api_key
            });

            // Calculate amount in smallest unit (cents/paise)
            const amountInSmallestUnit = CurrencyService.getAmountInSmallestUnit(planWithCurrency?.display_amount, planWithCurrency?.display_currency);
            
            const options = {
                amount: amountInSmallestUnit,
                currency: 'INR',
                // currency: 'USD',
                receipt: `rcpt_${Date.now()}`
            };

            console.log(options);

            const order = await razorpay.orders.create(options);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: order
            });
        } catch (err) {
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async createRazorpayOrderValidator(req) {
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

        return errObj;
    }
}

module.exports = CreateRazorpayOrderController;
