const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const constants = require("../../common/constants");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { generateToken } = require('../../middleware/tokenLib');
class SigninController {

    static async signin(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await SigninController.signinValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const signinResponse = await SigninController.signinOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (signinResponse?.responseCode === "OK") {
                return context.send(signinResponse);
            } else {
                return context.status(400).send(signinResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async signinOperation(req, corelationId, context, authorizer) {
        try {
			const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
			let userDetails = rows[0];
            if(userDetails?.is_deleted === 1){
                return await utils.generateResponseObj({
                    responseCode: responsecodes().ACCOUNT_HAS_BEEN_DELETED,
                    responseMessage: getStatusText(responsecodes().ACCOUNT_HAS_BEEN_DELETED),
                    responseData: {}
                });
            }
			if(userDetails?.login_type == 'guest' && req?.login_type != userDetails?.login_type){
				if (!req?.login_type_id) {
					return await utils.generateResponseObj({
						responseCode: responsecodes().LOGIN_TYPE_ID_REQUIRED,
						responseMessage: getStatusText(responsecodes().LOGIN_TYPE_ID_REQUIRED),
						responseData: {}
					});
				}
				if (!req?.name) {
					return await utils.generateResponseObj({
						responseCode: responsecodes().NAME_REQUIRED,
						responseMessage: getStatusText(responsecodes().NAME_REQUIRED),
						responseData: {}
					});
				}
				const query = `UPDATE users SET login_type = ?, login_type_id = ?, name = ?, email = ?, profile_picture = ?  WHERE id = ?`;
                const values = [
                    req?.login_type,
                    req?.login_type_id,
                    req?.name,
                    req?.email ? req?.email : null,
                    req?.profile_picture ? req?.profile_picture : null,
                    req?.id
                ];
                const [result] = await db.query(query, values);
				const [rows1] = await db.query('SELECT * FROM users WHERE id = ?', [req?.id]);
				userDetails = rows1[0];
				let jwtPayload = {
					id:req?.id,
					uid: userDetails?.uid
				};
				userDetails.token = await generateToken(jwtPayload);
                if(userDetails?.login_type != 'guest' && userDetails?.login_reward == 0){
                    const [[app_data]] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
                    const expired = new Date();
                    expired.setDate(expired.getDate() + 10);
                    const query1 = 'INSERT into reward_history (user_id, title, coin, expired) values (?, ?, ?, ?)';
                    const values1 = [
                        req?.id,
                        "Login rewards",
                        app_data?.login_reward_coin,
                        expired
                    ];
                    const [result1] = await db.query(query1, values1);
                    let updated_coin = Number(userDetails?.wallet_balance) + Number(app_data?.login_reward_coin)
                    await db.query(`UPDATE users SET login_reward = ?, wallet_balance = ?  WHERE id = ?`, [1, updated_coin, req?.id]);
                    userDetails.login_reward = 1;
                    userDetails.wallet_balance = updated_coin;
                }
				return await utils.generateResponseObj({
					responseCode: responsecodes().SUCCESS_OK,
					responseMessage: getStatusText(responsecodes().SUCCESS_OK),
					responseData: userDetails
				});
			} else {
				let jwtPayload = {
					id:req?.id,
					uid: userDetails?.uid,
				};
				rows[0].token = await generateToken(jwtPayload);
				return await utils.generateResponseObj({
					responseCode: responsecodes().SUCCESS_OK,
					responseMessage: getStatusText(responsecodes().SUCCESS_OK),
					responseData: rows[0]
				});
			}
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async signinValidator(req) {
        let errObj = {};
        if (!req?.login_type) {
            return {
                responseCode: responsecodes().LOGIN_TYPE_REQUIRED,
                responseMessage: getStatusText(responsecodes().LOGIN_TYPE_REQUIRED),
                responseData: {}
            };
        } else if (!constants.LOGIN_TYPE.includes(req?.login_type)){
			return {
                responseCode: responsecodes().INVALID_LOGIN_TYPE,
                responseMessage: getStatusText(responsecodes().INVALID_LOGIN_TYPE),
                responseData: {}
            };
		}
		if (!req?.id) {
            return {
                responseCode: responsecodes().USER_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().USER_ID_REQUIRED),
                responseData: {}
            };
        }
		
        return errObj;
    }
}

module.exports = SigninController;