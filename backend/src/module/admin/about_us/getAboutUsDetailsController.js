const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetAboutUsDetailsController {

    static async getAboutUsDetails(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform update operation
            const getAboutUsResponse = await GetAboutUsDetailsController.getUsersDetailsOperation(
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

    static async getUsersDetailsOperation(corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT about_us FROM admin WHERE id = ?', [1]);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: rows[0]
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetAboutUsDetailsController;
