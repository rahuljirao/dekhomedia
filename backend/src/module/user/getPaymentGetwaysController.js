const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const GeoLocationService = require("../../services/geoLocationService");

class GetPaymentGetwaysController {

    static async getPaymentGetways(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {       
            // Get user's location and currency
            const locationInfo = await GeoLocationService.getLocationAndCurrency(event);
            console.log(locationInfo, 'locationInfo');     
            // Perform get operation
            const getPaymentGetwaysResponse = await GetPaymentGetwaysController.getPaymentGetwaysOperation(
                corelationId,
                context,
                authorizer,
                locationInfo
            );

            if (getPaymentGetwaysResponse?.responseCode === "OK") {
                return context.send(getPaymentGetwaysResponse);
            } else {
                return context.status(400).send(getPaymentGetwaysResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getPaymentGetwaysOperation(corelationId, context, authorizer, locationInfo) {
        try {
            // Indian users get both Stripe and Razorpay payment method, others get only Stripe payment method
            const isIndianUser = locationInfo.countryCode === 'IN';

            let query;
            if (isIndianUser) {
                // Get both Stripe and Razorpay payment method for Indian users
                query = `SELECT * FROM payment_getways WHERE is_deleted = 0 AND is_active = 1`;
            } else {
                // Get only Stripe payment method for non-Indian users
                query = `SELECT * FROM payment_getways WHERE is_deleted = 0 AND is_active = 1 AND name NOT LIKE '%razorpay%'`;
            }
            // const query = `SELECT * FROM payment_getways WHERE is_deleted = 0 AND is_active = 1`;
            const [results] = await db.query(query);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: results
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetPaymentGetwaysController;
