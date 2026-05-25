const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetPrivacyPolicyController {

    static async getPrivacyPolicy(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getPrivacyPolicyResponse = await GetPrivacyPolicyController.getPrivacyPolicyOperation(
                corelationId,
                context,
                authorizer
            );

            if (getPrivacyPolicyResponse?.responseCode === "OK") {
                return context.send(getPrivacyPolicyResponse);
            } else {
                return context.status(400).send(getPrivacyPolicyResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getPrivacyPolicyOperation(corelationId, context, authorizer) {
        try {
            const query = `SELECT privacy_and_policy FROM admin WHERE id = 1`;
            const [results] = await db.query(query);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: results[0]
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetPrivacyPolicyController;
