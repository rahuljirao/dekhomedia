const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const constants = require("../../../common/constants");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
const { generateToken } = require('../../../middleware/tokenLib');
class DailyCheckController {

    static async dailyCheck(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform add operation
            const dailyCheckResponse = await DailyCheckController.dailyCheckOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (dailyCheckResponse?.responseCode === "OK") {
                return context.send(dailyCheckResponse);
            } else {
                return context.status(400).send(dailyCheckResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async dailyCheckOperation(req, corelationId, context, authorizer) {
        try {
			const [rows] = await db.query('SELECT * FROM users');
            for (let userDetails of rows) {
                let lastCheckDay = 0;
                for (let index = 1; index <= 7; index++) {
                    let keyData = `checked_in_day_${index}`;
                    if(userDetails[keyData] == null){
                        lastCheckDay = index - 1;
                        break;
                    }
                }
                let lastDate = userDetails[`checked_in_day_${lastCheckDay}`];
                if(lastDate){
                    let today = new Date();
                    let diffTime = Math.abs(today - lastDate);
                    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays >= 3){
                        let query = `UPDATE users SET checked_in_day_1 = ?, checked_in_day_2 = ?, checked_in_day_3 = ?, checked_in_day_4 = ?, checked_in_day_5 = ?, checked_in_day_6 = ?, checked_in_day_7 = ?  WHERE id = ?`;
                        let values = [
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            userDetails?.id
                        ];
                        let [result] = await db.query(query, values);
                    }
                }
                
                const today = new Date().toISOString().split('T')[0];
                const weeklyVipEndDate = new Date(userDetails?.weekly_vip_ended).toISOString().split('T')[0];
                const monthlyVipEndDate = new Date(userDetails?.monthly_vip_ended).toISOString().split('T')[0];
                const yearlyVipEndDate = new Date(userDetails?.yearly_vip_ended).toISOString().split('T')[0];
                if(userDetails?.is_weekly_vip && weeklyVipEndDate < today){
                    const users = `UPDATE users SET is_weekly_vip = ?, weekly_vip_ended = ? WHERE id = ?`;
                    const usersvalues = [
                        0,
                        null,
                        userDetails?.id
                    ];
                    const [result] = await db.query(users, usersvalues);
                } 
                if(userDetails?.is_monthly_vip && monthlyVipEndDate < today){
                    const users = `UPDATE users SET is_monthly_vip = ?, monthly_vip_ended = ? WHERE id = ?`;
                    const usersvalues = [
                        0,
                        null,
                        userDetails?.id
                    ];
                    const [result] = await db.query(users, usersvalues);
                } 
                if(userDetails?.is_yearly_vip && yearlyVipEndDate < today){
                    const users = `UPDATE users SET is_yearly_vip = ?, yearly_vip_ended = ? WHERE id = ?`;
                    const usersvalues = [
                        0,
                        null,
                        userDetails?.id
                    ];
                    const [result] = await db.query(users, usersvalues);
                } 
            }
            let result1 = await db.query(`UPDATE users SET extra_daily = ?, daily_watched_ads = ?`, [0, 0]);
            let update = await db.query(`UPDATE users_watched_series SET watched_ads_for_episode = ?`, [0]);
            let [rewardData] = await db.query(`SELECT * FROM reward_history WHERE is_expired = 0 AND DATE(expired) <= CURDATE() ORDER BY id DESC`);
            for (const reward of rewardData) {
                let [[user_details]] = await db.query(`SELECT * FROM users WHERE id = ?`, [reward?.user_id]);
                let rewardCoin = reward?.coin;
                let updatedRewardCoin = Number(user_details?.wallet_balance) - Number(rewardCoin);
                if(user_details?.wallet_balance > rewardCoin){
                    await db.query(`UPDATE users SET wallet_balance = ? WHERE id = ?`, [updatedRewardCoin, reward?.user_id]);
                }
                await db.query(`UPDATE reward_history SET is_expired = ? WHERE id = ?`, [1, reward?.id]);
            }
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {}
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = DailyCheckController;