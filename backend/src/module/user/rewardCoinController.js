const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const constants = require("../../common/constants");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { generateToken } = require('../../middleware/tokenLib');
class RewardCoinController {

    static async rewardCoin(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await RewardCoinController.rewardCoinValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateCoinResponse = await RewardCoinController.rewardCoinOperation(
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

    static async rewardCoinOperation(req, corelationId, context, authorizer) {
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
            let coin_update_key = `${req?.reward_type}_coin`;
            if(userDetails[req?.reward_type] == 0){
                const [[app_data]] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
                let coinData = app_data[coin_update_key];
                const query = `UPDATE users SET wallet_balance = ?, ${req?.reward_type} = ?  WHERE id = ?`;
                const values = [
                    Number(userDetails.wallet_balance) + Number(coinData),
                    1,
                    authorizer?.id
                ];
                await db.query(query, values);
                const expired = new Date();
                expired.setDate(expired.getDate() + 10);
                const query1 = 'INSERT into reward_history (user_id, title, coin, expired) values (?, ?, ?, ?)';
                const values1 = [
                    authorizer?.id,
                    constants.REWARD_TYPE_MESSAGE[req?.reward_type],
                    coinData,
                    expired
                ];
                const [result1] = await db.query(query1, values1);
                userDetails.wallet_balance = Number(userDetails.wallet_balance) + Number(coinData);
                userDetails[req?.reward_type] = 1;
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: userDetails
                });
            } else {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().YOU_ALREADY_REWARDED,
                    responseMessage: getStatusText(responsecodes().YOU_ALREADY_REWARDED),
                    responseData: {}
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async rewardCoinValidator(req) {
        let errObj = {};
		if (!req?.reward_type) {
            return {
                responseCode: responsecodes().REWARD_TYPE_REQUIRED,
                responseMessage: getStatusText(responsecodes().REWARD_TYPE_REQUIRED),
                responseData: {}
            };
        } else if (!constants.REWARD_TYPE.includes(req?.reward_type)){
			return {
                responseCode: responsecodes().INVALID_REWARD_TYPE,
                responseMessage: getStatusText(responsecodes().INVALID_REWARD_TYPE),
                responseData: {}
            };
		}
		
        return errObj;
    }
}

module.exports = RewardCoinController;