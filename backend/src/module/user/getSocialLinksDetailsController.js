const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetSocialLinksDetailsController {

    static async getSocialLinksDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform update operation
            const getSocialLinksResponse = await GetSocialLinksDetailsController.getUsersDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getSocialLinksResponse?.responseCode === "OK") {
                return context.send(getSocialLinksResponse);
            } else {
                return context.status(400).send(getSocialLinksResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getUsersDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const [[user]] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);

            if (!user) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            const [rows] = await db.query('SELECT * FROM about_us WHERE id = ?', [1]);
            const about = rows[0];

            about.notification_allowed = user?.notification_allowed;
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

module.exports = GetSocialLinksDetailsController;
