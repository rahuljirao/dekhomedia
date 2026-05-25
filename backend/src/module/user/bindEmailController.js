const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const constants = require("../../common/constants");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { generateToken } = require('../../middleware/tokenLib');
class BindEmailController {

    static async bindEmail(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await BindEmailController.bindEmailValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const bindEmailResponse = await BindEmailController.bindEmailOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (bindEmailResponse?.responseCode === "OK") {
                return context.send(bindEmailResponse);
            } else {
                return context.status(400).send(bindEmailResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async bindEmailOperation(req, corelationId, context, authorizer) {
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
            if(userDetails?.bind_email == 0){
                const [emails] = await db.query('SELECT * FROM users WHERE id != ? AND subscribed_email = ?', [authorizer?.id, req?.email]);
                if(emails.length > 0){
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().EMAIL_ALREADY_EXISTS,
                        responseMessage: getStatusText(responsecodes().EMAIL_ALREADY_EXISTS),
                        responseData: {}
                    });
                }
                const [[app_data]] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
                let coinData = app_data?.bind_email_coin;
                const query = `UPDATE users SET wallet_balance = ?, subscribed_email = ?, bind_email = ? WHERE id = ?`;
                const values = [
                    Number(userDetails.wallet_balance) + Number(coinData),
                    req?.email,
                    1,
                    authorizer?.id
                ];
                await db.query(query, values);
                const expired = new Date();
                expired.setDate(expired.getDate() + 10);
                const query1 = 'INSERT into reward_history (user_id, title, coin, expired) values (?, ?, ?, ?)';
                const values1 = [
                    authorizer?.id,
                    "Bind email",
                    coinData,
                    expired
                ];
                await db.query(query1, values1);
                userDetails.wallet_balance = Number(userDetails.wallet_balance) + Number(coinData);
                userDetails.subscribed_email = req?.email;
                userDetails.bind_email = 1;
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: userDetails
                });
            } else {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().YOU_ALREADY_BINDED,
                    responseMessage: getStatusText(responsecodes().YOU_ALREADY_BINDED),
                    responseData: {}
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async bindEmailValidator(req) {
        let errObj = {};
		if (!req?.email) {
            return {
                responseCode: responsecodes().EMAIL_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().EMAIL_ID_REQUIRED),
                responseData: {}
            };
        }
		
        return errObj;
    }
}

module.exports = BindEmailController;