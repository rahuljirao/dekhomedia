const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetAboutUsController {

    static async getAboutUs(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getAboutUsResponse = await GetAboutUsController.getAboutUsOperation(
                corelationId,
                context,
                authorizer
            );

            if (getAboutUsResponse?.responseCode === "OK") {
                return context.send(getAboutUsResponse);
            } else {
                return context.status(400).send(getAboutUsResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getAboutUsOperation(corelationId, context, authorizer) {
        try {
            const query = `SELECT about_us FROM admin WHERE id = 1`;
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

module.exports = GetAboutUsController;
