const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class DeleteAccountController {

    static async deleteAccount(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {          
            // Perform get operation
            const deleteAccountResponse = await DeleteAccountController.deleteAccountOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deleteAccountResponse?.responseCode === "OK") {
                return context.send(deleteAccountResponse);
            } else {
                return context.status(400).send(deleteAccountResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deleteAccountOperation(data, corelationId, context, authorizer) {
        try {
            const [[user]] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            let status = user?.is_deleted;
            if(status === 0){
                const query = `DELETE FROM users WHERE id = ?`;
                const values = [
                    authorizer?.id
                ];
                const [result] = await db.query(query, values);
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {}
                });
            } else {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().ACCOUNT_ALREADY_DELETED,
                    responseMessage: getStatusText(responsecodes().ACCOUNT_ALREADY_DELETED),
                    responseData: {}
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = DeleteAccountController;
