const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const constants = require("../../common/constants");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { generateToken } = require('../../middleware/tokenLib');
class SignupController {

    static async signup(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await SignupController.signupValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const signupResponse = await SignupController.signupOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (signupResponse?.responseCode === "OK") {
                return context.send(signupResponse);
            } else {
                return context.status(400).send(signupResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async signupOperation(req, corelationId, context, authorizer) {
        try {
            let [guestUser] = await db.query('SELECT * FROM users WHERE login_type = ? AND login_type_id = ?', [req?.login_type, req?.login_type_id]);
            if(guestUser.length == 0){
                let uid = await utils.generate16DigitUUID();
                let query = '';
                let values = [];
                if(req?.login_type == 'guest'){
                    query = `INSERT INTO users (uid, login_type, login_type_id, language_id) VALUES (?, ?, ?, ?)`;
                    values = [
                        uid,
                        req?.login_type,
                        req?.login_type_id,
                        1
                    ];
                } else {
                    query = `INSERT INTO users (uid, login_type, login_type_id, email, name, language_id) VALUES (?, ?, ?, ?, ?, ?)`;
                    values = [
                        uid,
                        req?.login_type,
                        req?.login_type_id,
                        req?.email ? req?.email:null,
                        req?.name,
                        1
                    ];
                }
                const [result] = await db.query(query, values);
                const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [result?.insertId]);
                let jwtPayload = {
                    id:result?.insertId,
                    uid: uid,
                };
                rows[0].token = await generateToken(jwtPayload);
                if(rows[0].login_type != 'guest' && rows[0].login_reward == 0){
                    const [[app_data]] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
                    const expired = new Date();
                    expired.setDate(expired.getDate() + 10);
                    const query1 = 'INSERT into reward_history (user_id, title, coin, expired) values (?, ?, ?, ?)';
                    const values1 = [
                        result?.insertId,
                        "Login rewards",
                        app_data?.login_reward_coin,
                        expired
                    ];
                    const [result1] = await db.query(query1, values1);
                    let updated_coin = Number(rows[0].wallet_balance) + Number(app_data?.login_reward_coin)
                    await db.query(`UPDATE users SET login_reward = ?, wallet_balance = ?  WHERE id = ?`, [1, updated_coin, result?.insertId]);
                    rows[0].login_reward = 1;
                    rows[0].wallet_balance = updated_coin;
                }
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: rows[0]
                });
            } else {
                const query = `UPDATE users SET login_type = ?, login_type_id = ?, name = ?, email = ?, profile_picture = ?  WHERE id = ?`;
                const values = [
                    req?.login_type,
                    req?.login_type_id,
                    req?.name,
                    req?.email ? req?.email : null,
                    req?.profile_picture ? req?.profile_picture : null,
                    guestUser[0].id
                ];
                const [result] = await db.query(query, values);
                let jwtPayload = {
                    id:guestUser[0].id,
                    uid: guestUser[0].uid,
                };
                guestUser[0].token = await generateToken(jwtPayload);
                if(guestUser[0].login_type != 'guest' && guestUser[0].login_reward == 0){
                    const [[app_data]] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
                    const expired = new Date();
                    expired.setDate(expired.getDate() + 10);
                    const query1 = 'INSERT into reward_history (user_id, title, coin, expired) values (?, ?, ?, ?)';
                    const values1 = [
                        guestUser[0].id,
                        "Login rewards",
                        app_data?.login_reward_coin,
                        expired
                    ];
                    const [result1] = await db.query(query1, values1);
                    let updated_coin = Number(guestUser[0].wallet_balance) + Number(app_data?.login_reward_coin)
                    await db.query(`UPDATE users SET login_reward = ?, wallet_balance = ?  WHERE id = ?`, [1, updated_coin, guestUser[0].id]);
                    guestUser[0].login_reward = 1;
                    guestUser[0].wallet_balance = updated_coin;
                }
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: guestUser[0]
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async signupValidator(req) {
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
        if (!req?.login_type_id) {
            return {
                responseCode: responsecodes().LOGIN_TYPE_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().LOGIN_TYPE_ID_REQUIRED),
                responseData: {}
            };
        }
		if (constants.SOCIAL_TYPE.includes(req?.login_type)) {
			if (!req?.name) {
				return {
					responseCode: responsecodes().NAME_REQUIRED,
					responseMessage: getStatusText(responsecodes().NAME_REQUIRED),
					responseData: {}
				};
			}
        }
        return errObj;
    }
}

module.exports = SignupController;