const { db, uuidv4 } = require("../../common/db");
const utils = require("../../common/utils");
const { responsecodes } = require("../../response-codes/lib");
const { getStatusText } = require("../../response-codes/responseCode");
const { SHA256 } = require("crypto-js");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateToken } = require('../../middleware/tokenLib');
const saltRounds = 10;
class AdminService {
	static async forgetPassword(data, context) {
		try {
			const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [data?.email]);
			if(rows.length == 0){
				return await utils.generateResponseObj({
					responseCode: responsecodes().EMAIL_NOT_EXIST,
					responseMessage: getStatusText(responsecodes().EMAIL_NOT_EXIST),
					responseData: {},
				});
			}
            let userDetails = rows[0];
			let TOKEN_SECRET = SHA256(process.env.JWT_SECRET).toString();

			let jwtPayload = {
				id: userDetails?.id,
				email: userDetails?.email,
			};

			let secureToken = jwt.sign(jwtPayload, TOKEN_SECRET, {
				expiresIn: "5m",
			});

			let forgetPasswordLink = `${process.env.ADMIN_URL}/reset-password?token=${secureToken}`;
			await utils.sendMail({
				to: userDetails?.email,
				subject: `Forget password link`,
				message: forgetPasswordLink,
			});

			return await utils.generateResponseObj({
				responseCode: responsecodes().SUCCESS_OK,
				responseMessage: getStatusText(responsecodes().PASSWORD_RESET_LINK),
				responseData: {},
			});
		} catch (err) {
			console.log("error", err);
			return await utils.throwCatchError(err)
		}
	}

	static async resetPassword(data, context) {
		try {
			let TOKEN_SECRET = SHA256(process.env.JWT_SECRET).toString();
			let payload = jwt.verify(data?.token, TOKEN_SECRET);
			const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [payload?.id]);
			if (rows.length > 0) {
				const encryptedPassword = await bcrypt.hash(data?.newPassword,saltRounds);
                const query = 'UPDATE admin SET password = ? WHERE id = ?';
                const values = [
                    encryptedPassword,
                    payload?.id
                ];
                const [result] = await db.query(query, values);
				return await utils.generateResponseObj({
					responseCode: responsecodes().SUCCESS_OK,
					responseMessage: getStatusText(responsecodes().PASSWORD_UPDATE_SUCESS),
					responseData: {},
				});
			} else {
				return await utils.generateResponseObj({
					responseCode: responsecodes().TOKEN_INVALID_OR_EXPIRED,
					responseMessage: getStatusText(responsecodes().TOKEN_INVALID_OR_EXPIRED),
					responseData: {},
				});
			}
		} catch (err) {
			if (err == "TokenExpiredError: jwt expired") {
				return await utils.throwCatchError(err)
			}
			return await utils.throwCatchError(err)
		}
	}

	static async checkTokenExpiration(data, context) {
		try {
			let TOKEN_SECRET = SHA256(process.env.VERIFY_EMAIL_KEY).toString();
			let payload = jwt.verify(data?.token, TOKEN_SECRET);
			return payload;
		} catch (err) {
			if (err.name === "TokenExpiredError") {
				return await utils.generateResponseObj({
					requestId: data?.requestHeader?.requestId,
					responseCode: responsecodes().TOKEN_INVALID_OR_EXPIRED,
					responseMessage: getStatusText(
						responsecodes().TOKEN_INVALID_OR_EXPIRED
					),
					responseData: {},
				});
			} else if (err.name === "JsonWebTokenError") {
				return await utils.generateResponseObj({
					requestId: data?.requestHeader?.requestId,
					responseCode: responsecodes().TOKEN_INVALID_OR_EXPIRED,
					responseMessage: getStatusText(
						responsecodes().TOKEN_INVALID_OR_EXPIRED
					),
					responseData: {},
				});
			} else {
				return await utils.throwCatchError(err)
			}
		}
	}

	static async signin(data) {
		try {
			const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [data?.email]);
			let adminDetails = rows[0];
			if (rows.length == 0) {
				return await utils.generateResponseObj({
					responseCode: responsecodes().EMAIL_NOT_EXIST,
					responseMessage: getStatusText(responsecodes().EMAIL_NOT_EXIST),
					responseData: {},
				});
			}
			const checkPassword = await bcrypt.compare(
				data?.password,
				adminDetails?.password
			);


			if (!adminDetails?.id) {
				return await utils.generateResponseObj({
					responseCode: responsecodes().TECHNICAL_ISSUE,
					responseMessage: getStatusText(responsecodes().TECHNICAL_ISSUE),
					responseData: {},
				});
			}
			delete adminDetails.password;

			if (checkPassword) {
				let jwtPayload = {
					id: adminDetails.id,
					email: adminDetails.email,
				};
				adminDetails.token = await generateToken(jwtPayload);
				return await utils.generateResponseObj({
					responseCode: responsecodes().SUCCESS_OK,
					responseMessage: getStatusText(responsecodes().SUCCESS_OK),
					responseData: adminDetails,
				});
			} else {
				return await utils.generateResponseObj({
					responseCode: responsecodes().INVALID_CREDENTIALS,
					responseMessage: getStatusText(responsecodes().INVALID_CREDENTIALS),
					responseData: {},
				});
			}
		} catch (err) {
			console.error(err);
			return await utils.generateResponseObj({
				responseCode: responsecodes().TECHNICAL_ISSUE,
				responseMessage: getStatusText(responsecodes().TECHNICAL_ISSUE),
				responseData: {},
			});
		}
	}
}

module.exports = AdminService;
