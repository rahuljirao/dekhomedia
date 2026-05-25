const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const constants = require("../../common/constants");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { generateToken } = require('../../middleware/tokenLib');
class DailyExtraAdsController {

    static async dailyExtraAds(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform add operation
            const updateCoinResponse = await DailyExtraAdsController.dailyExtraAdsOperation(
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

    static async dailyExtraAdsOperation(req, corelationId, context, authorizer) {
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
            let extra_daily = Number(userDetails?.extra_daily);
            if(extra_daily == 0){
                let extra_daily_coin = app_data[0]['extra_daily'];
                let updatedCoin = Number(extra_daily_coin) + Number(userDetails?.wallet_balance);
                const query = `UPDATE users SET wallet_balance = ?, extra_daily = ?  WHERE id = ?`;
                const values = [
                    updatedCoin,
                    1,
                    authorizer?.id
                ];
                const [result] = await db.query(query, values);
                const expired = new Date();
                expired.setDate(expired.getDate() + 10);
                const query1 = 'INSERT into reward_history (user_id, title, coin, expired) values (?, ?, ?, ?)';
                const values1 = [
                    authorizer?.id,
                    "Watch ads",
                    extra_daily_coin,
                    expired
                ];
                const [result1] = await db.query(query1, values1);
                userDetails.wallet_balance = updatedCoin;
                userDetails.extra_daily = 1;
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: userDetails
                });
            } else {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().YOU_ALREADY_WATCHED,
                    responseMessage: getStatusText(responsecodes().YOU_ALREADY_WATCHED),
                    responseData: {}
                });
            }
            
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = DailyExtraAdsController;