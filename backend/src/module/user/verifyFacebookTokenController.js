const { responsecodes } = require("../../response-codes/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { db } = require("../../common/db");
const lib = require("../../middleware/tokenLib");
const axios  = require('axios');

class VerifyFacebookTokenController {
  	static  async verifyFacebookToken (event, context)  
  	{
        const request = typeof event.body == "string" ? JSON.parse(event.body) : event.body;
		try {
			const validateResponse = await VerifyFacebookTokenController.validateVerifyFacebookToken(request);
			if (Object.keys(validateResponse).length > 0) {
				context.status(400);
				return context.send(validateResponse);
			}
			
            // Perform update operation
            const updateUserResponse = await VerifyFacebookTokenController.verifyTokenOperation(
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
			console.log(data);
			const fbRes = await axios.get(`https://graph.facebook.com/v22.0/${data?.id}?fields=id,name,email,picture&access_token=${data?.token}`);
			console.log('fb res: ', fbRes.data);

			const { email, name, picture, id } = fbRes.data;
			
			const [rows] = await db.query('SELECT * FROM users WHERE login_type_id = ?', [id]);
			let userDetails = {
				email: email ?? null,
				name,
				picture : picture?.data?.url,
				fb_id: id,
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


    static async  validateVerifyFacebookToken(req){
	
		let errObj = [];

		if (!req?.token) {
			return {
				responseCode: responsecodes().TOKEN_REQUIRED,
				responseMessage: getStatusText(responsecodes().TOKEN_REQUIRED),
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
module.exports = VerifyFacebookTokenController;