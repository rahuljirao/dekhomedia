const { responsecodes } = require("../../response-codes/lib");
const utils = require("../../common/utils");
const AdminService = require("../admin/adminService");
const { getStatusText } = require("../../response-codes/responseCode");
class resetPasswordController 
{
    static async resetPassword (event, context) 
    {
        try {
            const request = typeof event.body == "string" ? JSON.parse(event.body) : event.body;
            const resetPasswordParameters = request;
            let response = await resetPasswordController.resetPasswordValidator(resetPasswordParameters);
            if (Object.keys(response).length > 0) {
                context.status(400);
                return context.send(response);
            }
            const resetPasswordResponse = await AdminService.resetPassword(
                resetPasswordParameters,
                context
            );
            if (Object.keys(resetPasswordResponse).length > 0) {
                if(resetPasswordResponse.responseCode == 'OK'){
                    return context.send(resetPasswordResponse);
                } else {
                    context.status(400);
                    return context.send(resetPasswordResponse);
                }
            } else {
                return context.send(resetPasswordResponse);
            }
        } catch (err) {
            context.status(400);
            return context.send(await utils.throwCatchError(err));
        }
    };

    static async resetPasswordValidator(req) 
    {
        let errObj = {};
        const requestDetails = req;
        let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{8,}$/;
        if (!requestDetails?.token) {
            return {
                responseCode: responsecodes().TOKEN_REQUIRED,
                responseMessage: getStatusText(responsecodes().TOKEN_REQUIRED),
                responseData: {}
            };
        }
        if (!requestDetails?.newPassword) {
            return {
                responseCode: responsecodes().NEW_PASSWORD_REQUIRED,
                responseMessage: getStatusText(responsecodes().NEW_PASSWORD_REQUIRED),
                responseData: {}
            };
        } else if(!passwordRegex.test(requestDetails?.newPassword)){
            return {
                responseCode: responsecodes().NEW_PASSWORD_INVALID,
                responseMessage: getStatusText(responsecodes().NEW_PASSWORD_INVALID),
                responseData: {}
            };
        }
        if (!requestDetails?.confirmPassword) {
            return {
                responseCode: responsecodes().CONFIRM_PASSWORD_REQUIRED,
                responseMessage: getStatusText(responsecodes().CONFIRM_PASSWORD_REQUIRED),
                responseData: {}
            };
        } else if (requestDetails?.newPassword !== requestDetails?.confirmPassword){
            return {
                responseCode: responsecodes().CONFIRM_PASSWORD_NOT_MATCH,
                responseMessage: getStatusText(responsecodes().CONFIRM_PASSWORD_NOT_MATCH),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = resetPasswordController;