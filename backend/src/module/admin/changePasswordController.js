const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
class ChangePasswordController {
    static async changePassword(event, context) {
        let corelationId = getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);
        try {
            let response = await ChangePasswordController.changePasswordValidator(request);
            if (Object.keys(response).length > 0) {
                context.status(400);
                return context.send(response);
            }
            const changePasswordResponse = await ChangePasswordController.changePasswordOperation(request, authorizer?.id, corelationId, context);
            if (changePasswordResponse?.responseCode === "OK") {
                return context.send(changePasswordResponse);
            } else {
                context.status(400);
                return context.send(changePasswordResponse);
            }
        } catch (err) {
            return context.send(await utils.throwCatchError(err));
        }
    }

    static async changePasswordOperation(data, admin_id, corelationId, context) {
        try {
            const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [admin_id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            let adminDetails = rows[0] || null;
            let adminPassword = adminDetails?.password ? adminDetails?.password: "";
            let checkPassword = await bcrypt.compare(data?.oldPassword, adminPassword);
            if(checkPassword){
                const encryptedPassword = await bcrypt.hash(data?.newPassword,saltRounds);
                const query = 'UPDATE admin SET password = ? WHERE id = ?';
                const values = [
                    encryptedPassword,
                    admin_id
                ];
                const [result] = await db.query(query, values);
                const [newRows] = await db.query('SELECT * FROM admin WHERE id = ?', [admin_id]);
                let newUserDetails = newRows[0];
                delete newUserDetails?.password;
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: newUserDetails
                });
            } else {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().OLD_PASSWORD_NOT_MATCH,
                    responseMessage: getStatusText(responsecodes().OLD_PASSWORD_NOT_MATCH),
                    responseData: {}
                });
            }
        } catch (err) {
            return context.send(await utils.throwCatchError(err));
        }
    }

    static async changePasswordValidator(req) {
        let errObj = {};
        const requestDetails = req;
        let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{8,}$/;
        if (!requestDetails?.oldPassword) {
            return {
                responseCode: responsecodes().OLD_PASSWORD_REQUIRED,
                responseMessage: getStatusText(responsecodes().OLD_PASSWORD_REQUIRED),
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

module.exports = ChangePasswordController;
