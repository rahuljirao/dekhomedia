const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetTermsConditionController {

    static async getTermsCondition(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getTermsConditionResponse = await GetTermsConditionController.getTermsConditionOperation(
                corelationId,
                context,
                authorizer
            );

            if (getTermsConditionResponse?.responseCode === "OK") {
                return context.send(getTermsConditionResponse);
            } else {
                return context.status(400).send(getTermsConditionResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getTermsConditionOperation(corelationId, context, authorizer) {
        try {
            const query = `SELECT terms_and_conditions FROM admin WHERE id = 1`;
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

module.exports = GetTermsConditionController;
