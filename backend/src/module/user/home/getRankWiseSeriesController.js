const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetRankWiseSeriesController {

    static async getRankWiseSeries(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {       
            // Perform get operation
            const getRankWiseSeriesResponse = await GetRankWiseSeriesController.getRankWiseSeriesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getRankWiseSeriesResponse?.responseCode === "OK") {
                return context.send(getRankWiseSeriesResponse);
            } else {
                return context.status(400).send(getRankWiseSeriesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getRankWiseSeriesOperation(req, corelationId, context, authorizer) {
        try {
            const [all] = await db.query(`SELECT * FROM series WHERE is_deleted = 0 AND is_active = 1 ORDER BY views DESC`);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: all
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetRankWiseSeriesController;
