const AdminService = require("../admin/adminService");
const { responsecodes } = require("../../response-codes/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { db } = require("../../common/db");

class SigninUserController {
  	static  async signIn (event, context)  
  	{
        const request = typeof event.body == "string" ? JSON.parse(event.body) : event.body;
		try {
			const validateResponse = await SigninUserController.validateSignin(event);
			if (Object.keys(validateResponse).length > 0) {
				context.status(400);
				return context.send(validateResponse);
			}
			const signinParameters = request;
			const signinResponse = await AdminService.signin(signinParameters);
			if (Object.keys(signinResponse).length > 0) {
				if(signinResponse.responseCode == 'OK'){
					return context.send(signinResponse);
				} else {
					context.status(400);
					return context.send(signinResponse);
				}
			}
		} catch (err) {
			context.status(400);
			return context.send(await utils.throwCatchError(err));
			
		}
	};


    static async  validateSignin(event){
		const request = typeof event.body == "string" ? JSON.parse(event.body) : event.body;
	
		let errObj = [];
		let email = request?.email;

		const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const isEmailValid = validateEmail(email);
    
		if (request) {
			if (!email || email.trim() === '') {
				return {
					requestId: request?.requestId,
					responseCode: responsecodes().EMAIL_ID_REQUIRED,
					responseMessage: getStatusText(responsecodes().EMAIL_ID_REQUIRED),
					responseData: {}
				};
			}

			if (!isEmailValid) {
				return {
					requestId: request?.requestId,
					responseCode: responsecodes().EMAIL_REQUIRED,
					responseMessage: getStatusText(responsecodes().EMAIL_REQUIRED),
					responseData: {}
				};
			}

			if (!request?.password) {
				return {
					requestId: request?.requestId,
					responseCode: responsecodes().USER_PASSWORD_REQUIRED,
					responseMessage: getStatusText(responsecodes().USER_PASSWORD_REQUIRED),
					responseData: {}
				};
			}
      	}
    	return errObj;
  	}
}
module.exports = SigninUserController;