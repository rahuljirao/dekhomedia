const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const GeoLocationService = require("../../services/geoLocationService");
const CurrencyService = require("../../services/currencyService");

class GetPlansController {

    static async getPlans(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Get user's location and currency
            const locationInfo = await GeoLocationService.getLocationAndCurrency(event);
            console.log(locationInfo, 'locationInfo');

            // Perform get operation
            const getPlansResponse = await GetPlansController.getPlansOperation(
                corelationId,
                context,
                authorizer,
                locationInfo
            );

            if (getPlansResponse?.responseCode === "OK") {
                return context.send(getPlansResponse);
            } else {
                return context.status(400).send(getPlansResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getPlansOperation(corelationId, context, authorizer, locationInfo) {
        try {
            const query = `SELECT * FROM plans WHERE is_deleted = 0 AND is_active = 1`;
            const [results] = await db.query(query);
            const [app_data] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
            let unlimited = [];
            let limited = [];

            // Convert prices to user's currency
            for (const result of results) {
                // Get converted price details
                const priceDetails = await CurrencyService.getPlanPriceInCurrency(
                    result.amount,
                    app_data[0].currency_symbol,
                    locationInfo.currency
                );

                // Add currency info to plan
                const planWithCurrency = {
                    ...result,
                    // Original price (in USD or base currency)
                    original_amount: result.amount,
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

                if (result?.is_unlimited == 1) {
                    unlimited.push(planWithCurrency);
                } else {
                    limited.push(planWithCurrency);
                }
            }

            // Razorpay for Indian users, Stripe for all other countries
            const paymentGateway = locationInfo.countryCode !== 'IN' ? 'razorpay' : 'stripe';

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    limited: limited,
                    unlimited: unlimited,
                    userLocation: {
                        countryCode: locationInfo.countryCode,
                        country: locationInfo.country,
                        currency: locationInfo.currency,
                        currencySymbol: locationInfo.currencySymbol,
                        currencyName: locationInfo.currencyName
                    },
                    paymentGateway: paymentGateway
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetPlansController;
