const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetSiteDetailsController {

    static async getSiteDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform update operation
            const getSiteDetailsResponse = await GetSiteDetailsController.getSiteDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getSiteDetailsResponse?.responseCode === "OK") {
                return context.send(getSiteDetailsResponse);
            } else {
                return context.status(400).send(getSiteDetailsResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getSiteDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM site_settings WHERE id = ?', [1]);
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

module.exports = GetSiteDetailsController;
