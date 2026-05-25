
const { responsecodes } = require("../../response-codes/lib");
const utils = require("../../common/utils");
const AdminService = require("../admin/adminService");
const { getStatusText } = require("../../response-codes/responseCode");
class forgetPasswordController 
{
    static async forgetPassword(event, context) 
    {
        const request =typeof event.body == "string" ? JSON.parse(event.body) : event.body;
        const forgetPasswordParameters = request;
        try {
            let response = await forgetPasswordController.forgetPasswordValidator(request);
            if (Object.keys(response).length > 0) {
                context.status(400);
                return context.send(response);
            }
            const forgetPasswordResponse = await AdminService.forgetPassword(forgetPasswordParameters,context );
            
            if (forgetPasswordResponse?.responseCode === "OK") {
                return context.send(forgetPasswordResponse);
            } else {
                context.status(400);
                return context.send(forgetPasswordResponse);
            }
        } catch (err){
            context.status(400);
            return context.send(await utils.throwCatchError(err));
        }
    };


    static async forgetPasswordValidator(req) 
    {
        let errObj = {};
        let email = req?.email;
        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isEmailValid = validateEmail(email);
        if (!email) {
            return {
                responseCode: responsecodes().EMAIL_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().EMAIL_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!isEmailValid) {
            return {
                responseCode: responsecodes().EMAIL_REQUIRED,
                responseMessage: getStatusText(responsecodes().EMAIL_REQUIRED),
                responseData: {}
            };
        }
        return errObj;
      }

    }
    module.exports = forgetPasswordController;