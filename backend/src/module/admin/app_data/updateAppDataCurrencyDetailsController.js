const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateAppDataCurrencyDetailsController {

    static async updateAppDataCurrencyDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateAppDataCurrencyDetailsController.appDataCurrencyDetailsValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const updateAppDataCurrencyResponse = await UpdateAppDataCurrencyDetailsController.appDataCurrencyDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateAppDataCurrencyResponse?.responseCode === "OK") {
                return context.send(updateAppDataCurrencyResponse);
            } else {
                return context.status(400).send(updateAppDataCurrencyResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async appDataCurrencyDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const query = 'UPDATE app_data SET country = ?, currency = ?, currency_symbol = ? WHERE id = ?';
            const values = [
                data?.country,
                data?.currency,
                data?.currency_symbol,
                1
            ];
            const [result] = await db.query(query, values);
            const [newRows] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
            let newDetails = newRows[0];

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: newDetails
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async appDataCurrencyDetailsValidator(req) {

        if (!req?.country) {
            return {
                responseCode: responsecodes().DAILY_WATCH_MAXIMUM_ADS_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAILY_WATCH_MAXIMUM_ADS_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.currency) {
            return {
                responseCode: responsecodes().EXTRA_DAILY_REQUIRED,
                responseMessage: getStatusText(responsecodes().EXTRA_DAILY_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.currency_symbol) {
            return {
                responseCode: responsecodes().DAILY_WATCH_ADS_FOR_MINIMUM_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAILY_WATCH_ADS_FOR_MINIMUM_COIN_REQUIRED),
                responseData: {}
            };
        }

        return {};
    }
}

module.exports = UpdateAppDataCurrencyDetailsController;
