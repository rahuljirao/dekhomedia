const { responsecodes } = require("../../response-codes/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { db } = require("../../common/db");
const lib = require("../../middleware/tokenLib");
const axios  = require('axios');

class VerifyGoogleTokenController {
  	static  async verifyGoogleToken (event, context)  
  	{
        const request = typeof event.body == "string" ? JSON.parse(event.body) : event.body;
		try {
			const validateResponse = await VerifyGoogleTokenController.validateVerifyGoogleToken(request);
			if (Object.keys(validateResponse).length > 0) {
				context.status(400);
				return context.send(validateResponse);
			}
			
            // Perform update operation
            const updateUserResponse = await VerifyGoogleTokenController.verifyTokenOperation(
				request,
                context
            );

            if (updateUserResponse?.responseCode === "OK") {
                return context.send(updateUserResponse);
            } else {
                return context.status(400).send(updateUserResponse);
            }
		} catch (err) {
			context.status(400);
			return context.send(await utils.throwCatchError(err));
			
		}
	};

    static async verifyTokenOperation(data, context) {
        try {
			const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: {
				  	Authorization: `Bearer ${data?.token}`,
				},
			});

			const { email, name, picture, sub: googleId } = googleRes.data;
			
			const [rows] = await db.query('SELECT * FROM users WHERE login_type_id = ?', [googleId]);
			let userDetails = {
				email,
				name,
				picture,
				googleId,
				isLogin: false
			}
			if (rows.length > 0) {
				let userData = rows[0];
				userDetails.id = userData.id;
				userDetails.isLogin = true;
			}

			return await utils.generateResponseObj({
				responseCode: responsecodes().SUCCESS_OK,
				responseMessage: getStatusText(responsecodes().SUCCESS_OK),
				responseData: userDetails
			});
        } catch (err) {
			console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }


    static async  validateVerifyGoogleToken(req){
	
		let errObj = [];

		if (!req?.token) {
			return {
				responseCode: responsecodes().TOKEN_REQUIRED,
				responseMessage: getStatusText(responsecodes().TOKEN_REQUIRED),
				responseData: {}
			};
		}

    	return errObj;
  	}
}
module.exports = VerifyGoogleTokenController;