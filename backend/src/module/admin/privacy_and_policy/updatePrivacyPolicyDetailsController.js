const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdatePrivacyPolicyDetailsController {

    static async updatePrivacyPolicyDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdatePrivacyPolicyDetailsController.PrivacyPolicyDetailsValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const updatePrivacyPolicyResponse = await UpdatePrivacyPolicyDetailsController.PrivacyPolicyDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updatePrivacyPolicyResponse?.responseCode === "OK") {
                return context.send(updatePrivacyPolicyResponse);
            } else {
                return context.status(400).send(updatePrivacyPolicyResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async PrivacyPolicyDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const query = 'UPDATE admin SET privacy_and_policy = ? WHERE id = ?';
            const values = [
                data?.privacy_policy,
                1
            ];
            const [result] = await db.query(query, values);
            const [newRows] = await db.query('SELECT privacy_and_policy FROM admin WHERE id = ?', [1]);
            let newDetails = newRows[0];

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: newDetails
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async PrivacyPolicyDetailsValidator(req) {
        let errObj = {};

        if (!req?.privacy_policy) {
            errObj = {
                responseCode: responsecodes().PRIVACY_POLICY_REQUIRED,
                responseMessage: getStatusText(responsecodes().PRIVACY_POLICY_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdatePrivacyPolicyDetailsController;
