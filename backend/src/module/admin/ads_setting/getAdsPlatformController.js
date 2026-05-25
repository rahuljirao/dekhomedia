const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetAdsPlatformController {

    static async getAdsPlatform(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getAdsPlatformResponse = await GetAdsPlatformController.getAdsPlatformOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getAdsPlatformResponse?.responseCode === "OK") {
                return context.send(getAdsPlatformResponse);
            } else {
                return context.status(400).send(getAdsPlatformResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getAdsPlatformOperation(req, corelationId, context, authorizer) {
        try {
            const query = `SELECT * FROM advertisement`;
            const [result] = await db.query(query);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: result
            });
        } catch (err) {
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetAdsPlatformController;
