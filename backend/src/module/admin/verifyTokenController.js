const { responsecodes } = require("../../response-codes/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { db } = require("../../common/db");
const lib = require("../../middleware/tokenLib");

class VerifyTokenController {
  	static  async verifyToken (event, context)  
  	{
        const request = typeof event.body == "string" ? JSON.parse(event.body) : event.body;
		try {
			const validateResponse = await VerifyTokenController.validateVerifyToken(request);
			if (Object.keys(validateResponse).length > 0) {
				context.status(400);
				return context.send(validateResponse);
			}
			
            // Perform update operation
            const updateUserResponse = await VerifyTokenController.verifyTokenOperation(
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
			const decodedToken = await lib.validateToken(data?.token);
			if (decodedToken) {
				const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [decodedToken?.userdata?.id]);
				if (rows.length == 0) {
					return await utils.generateResponseObj({
						responseCode: responsecodes().INVALID_USER,
						responseMessage: getStatusText(responsecodes().INVALID_USER),
						responseData: {}
					});
				}
				delete rows[0].password;
				delete rows[0].terms_and_conditions;
				delete rows[0].privacy_and_policy;
				delete rows[0].about_us;
				return await utils.generateResponseObj({
					responseCode: responsecodes().SUCCESS_OK,
					responseMessage: getStatusText(responsecodes().SUCCESS_OK),
					responseData: rows[0]
				});
			} else {
				return await utils.generateResponseObj({
					responseCode: responsecodes().TOKEN_INVALID_OR_EXPIRED,
					responseMessage: getStatusText(responsecodes().TOKEN_INVALID_OR_EXPIRED),
					responseData: {}
				});
			}
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }


    static async  validateVerifyToken(req){
	
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
module.exports = VerifyTokenController;