const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const constants = require("../../common/constants");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { generateToken } = require('../../middleware/tokenLib');
class DailyCoinController {

    static async dailyCoin(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await DailyCoinController.dailyCoinValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateCoinResponse = await DailyCoinController.dailyCoinOperation(
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

    static async dailyCoinOperation(req, corelationId, context, authorizer) {
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
            let dailyKey = `checked_in_day_${req?.day}`;
            if(userDetails[dailyKey] == null){
                const [app_data] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
                let dailykeyCoin = `day_${req?.day}_coin`;
                let coinData = app_data[0][dailykeyCoin];
                const query = `UPDATE users SET wallet_balance = ?, ${dailyKey} = ?  WHERE id = ?`;
                const values = [
                    Number(userDetails.wallet_balance) + Number(coinData),
                    new Date(),
                    authorizer?.id
                ];
                const [result] = await db.query(query, values);
                const expired = new Date();
                expired.setDate(expired.getDate() + 10);
                const query1 = 'INSERT into reward_history (user_id, title, coin, expired) values (?, ?, ?, ?)';
                const values1 = [
                    authorizer?.id,
                    "Check-in",
                    coinData,
                    expired
                ];
                const [result1] = await db.query(query1, values1);
                userDetails.wallet_balance = Number(userDetails.wallet_balance) + Number(coinData);
                userDetails[dailyKey] = new Date();
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: userDetails
                });
            } else {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().YOU_ALREADY_CHECKED_IN,
                    responseMessage: getStatusText(responsecodes().YOU_ALREADY_CHECKED_IN),
                    responseData: {}
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async dailyCoinValidator(req) {
        let errObj = {};
		if (!req?.day) {
            return {
                responseCode: responsecodes().DAY_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAY_REQUIRED),
                responseData: {}
            };
        }
		
        return errObj;
    }
}

module.exports = DailyCoinController;