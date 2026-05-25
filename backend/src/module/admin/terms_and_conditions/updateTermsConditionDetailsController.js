const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateTermsConditionDetailsController {

    static async updateTermsConditionDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateTermsConditionDetailsController.TermsConditionDetailsValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const updateTermsConditionResponse = await UpdateTermsConditionDetailsController.TermsConditionDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateTermsConditionResponse?.responseCode === "OK") {
                return context.send(updateTermsConditionResponse);
            } else {
                return context.status(400).send(updateTermsConditionResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async TermsConditionDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const query = 'UPDATE admin SET terms_and_conditions = ? WHERE id = ?';
            const values = [
                data?.terms_condition,
                1
            ];
            const [result] = await db.query(query, values);
            const [newRows] = await db.query('SELECT terms_and_conditions FROM admin WHERE id = ?', [1]);
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
    static async TermsConditionDetailsValidator(req) {
        let errObj = {};

        if (!req?.terms_condition) {
            errObj = {
                responseCode: responsecodes().TERMS_CONDITION_REQUIRED,
                responseMessage: getStatusText(responsecodes().TERMS_CONDITION_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateTermsConditionDetailsController;
