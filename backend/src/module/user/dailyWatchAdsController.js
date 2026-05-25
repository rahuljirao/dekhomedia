const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const constants = require("../../common/constants");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { generateToken } = require('../../middleware/tokenLib');
class DailyWatchAdsController {

    static async dailyWatchAds(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform add operation
            const updateCoinResponse = await DailyWatchAdsController.dailyWatchAdsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateCoinResponse?.responseCode === "OK") {
                return context.send(updateCoinResponse);
            } else {
                return context.status(400).send(updateCoinResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async dailyWatchAdsOperation(req, corelationId, context, authorizer) {
        try {
			const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            let userDetails = rows[0];
            const [app_data] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
            let daily_watch_maximum_ads = Number(app_data[0].daily_watch_maximum_ads);
            let updatedCount = Number(userDetails?.daily_watched_ads);
            if(daily_watch_maximum_ads > updatedCount){
                let minimum = app_data[0]['daily_watch_ads_for_minimum_coin'];
                let maximum = app_data[0]['daily_watch_ads_for_maximum_coin'];
                let coin = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                let updatedCoin = Number(coin) + Number(userDetails?.wallet_balance);
                updatedCount = updatedCount + 1;
                const query = `UPDATE users SET wallet_balance = ?, daily_watched_ads = ?  WHERE id = ?`;
                const values = [
                    updatedCoin,
                    updatedCount,
                    authorizer?.id
                ];
                const [result] = await db.query(query, values);
                const expired = new Date();
                expired.setDate(expired.getDate() + 10);
                const query1 = 'INSERT into reward_history (user_id, title, coin, expired) values (?, ?, ?, ?)';
                const values1 = [
                    authorizer?.id,
                    "Watch ads",
                    coin,
                    expired
                ];
                const [result1] = await db.query(query1, values1);
                userDetails.wallet_balance = updatedCoin;
                userDetails.daily_watched_ads = updatedCount;
                userDetails.coin = coin;
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: userDetails
                });
            } else {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().YOU_WATCHED_MAXIMUM_ADS,
                    responseMessage: getStatusText(responsecodes().YOU_WATCHED_MAXIMUM_ADS),
                    responseData: {}
                });
            }
            
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = DailyWatchAdsController;