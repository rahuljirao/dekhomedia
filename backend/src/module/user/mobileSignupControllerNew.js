const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const constants = require("../../common/constants");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { generateToken } = require('../../middleware/tokenLib');
class MobileSignupController {

    static async mobileSignup(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            let response = await MobileSignupController.mobileSignupValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            const mobileSignupResponse = await MobileSignupController.mobileSignupOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (mobileSignupResponse?.responseCode === "OK") {
                return context.send(mobileSignupResponse);
            } else {
                return context.status(400).send(mobileSignupResponse);
            }
        } catch (err) {
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async mobileSignupOperation(req, corelationId, context, authorizer) {
        try {
            let user;
            let [guestUser] = await db.query('SELECT * FROM users WHERE login_type = "guest" AND device_id = ?', [req?.device_id]);

            if (guestUser.length > 0) {
                if (req?.login_type === 'guest') {
                    user = guestUser;
                } else if (constants.SOCIAL_TYPE.includes(req?.login_type)) {
                    const existingUserData = guestUser[0];
                    const query = `UPDATE users SET login_type = ?, login_type_id = ?, name = ?, email = ?, profile_picture = ?, device_token = ? WHERE id = ?`;
                    const values = [
                        req?.login_type,
                        req?.login_type_id,
                        req?.name,
                        req?.email ? req?.email : null,
                        req?.profile_picture ? req?.profile_picture : null,
                        req?.device_token ? req?.device_token : null,
                        existingUserData.id
                    ];
                    await db.query(query, values);
                    [user] = await db.query('SELECT * FROM users WHERE id = ?', [existingUserData.id]);
                }
            } else {
                if (constants.SOCIAL_TYPE.includes(req?.login_type)) {
                    [user] = await db.query('SELECT * FROM users WHERE login_type = ? AND email = ?', [req?.login_type, req?.email]);
                    if (user.length === 0 && req?.email) {
                        const [existingUserWithEmail] = await db.query('SELECT * FROM users WHERE email = ?', [req?.email]);
                        if (existingUserWithEmail.length > 0) {
                            user = [];
                        }
                    }
                }
            }

            if (user && user.length > 0) {
                const existingUserData = user[0];
                let jwtPayload = {
                    id: existingUserData.id,
                    uid: existingUserData.uid,
                };
                existingUserData.token = await generateToken(jwtPayload);
                if (existingUserData.login_type !== 'guest' && existingUserData.login_reward === 0) {
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
                    await db.query(query1, values1);
                    let updated_coin = Number(existingUserData.wallet_balance) + Number(app_data?.login_reward_coin);
                    await db.query(`UPDATE users SET login_reward = ?, wallet_balance = ?  WHERE id = ?`, [1, updated_coin, existingUserData.id]);
                    existingUserData.login_reward = 1;
                    existingUserData.wallet_balance = updated_coin;
                }
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: existingUserData
                });
            } else {
                let uid = await utils.generate16DigitUUID();
                let query = '';
                let values = [];
                if (req?.login_type === 'guest') {
                    query = `INSERT INTO users (uid, login_type, login_type_id, language_id, device_id, device_token) VALUES (?, ?, ?, ?, ?, ?)`;
                    values = [
                        uid,
                        req?.login_type,
                        req?.login_type_id,
                        1,
                        req?.device_id,
                        req?.device_token ? req?.device_token : null
                    ];
                } else {
                    query = `INSERT INTO users (uid, login_type, login_type_id, email, name, profile_picture, language_id, device_id, device_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    values = [
                        uid,
                        req?.login_type,
                        req?.login_type_id,
                        req?.email ? req?.email : null,
                        req?.name,
                        req?.profile_picture ? req?.profile_picture : null,
                        1,
                        req?.device_id,
                        req?.device_token ? req?.device_token : null
                    ];
                }
                const [result] = await db.query(query, values);
                const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [result?.insertId]);
                let jwtPayload = {
                    id: result?.insertId,
                    uid: uid,
                };
                rows[0].token = await generateToken(jwtPayload);
                if (rows[0].login_type !== 'guest' && rows[0].login_reward === 0) {
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
                    await db.query(query1, values1);
                    let updated_coin = Number(rows[0].wallet_balance) + Number(app_data?.login_reward_coin);
                    await db.query(`UPDATE users SET login_reward = ?, wallet_balance = ?  WHERE id = ?`, [1, updated_coin, result?.insertId]);
                    rows[0].login_reward = 1;
                    rows[0].wallet_balance = updated_coin;
                }
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

    static async mobileSignupValidator(req) {
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
        if (!req?.device_id) {
            return {
                responseCode: responsecodes().DEVICE_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().DEVICE_ID_REQUIRED),
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
		          if (!req?.email) {
		              return {
		                  responseCode: responsecodes().EMAIL_REQUIRED,
		                  responseMessage: getStatusText(responsecodes().EMAIL_REQUIRED),
		                  responseData: {}
		              };
		          }
		      }
        return errObj;
    }
}

module.exports = MobileSignupController;