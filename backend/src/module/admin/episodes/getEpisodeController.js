const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetSeriesEpisodesController {

    static async getSeriesEpisodes(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getSeriesEpisodesResponse = await GetSeriesEpisodesController.getSeriesEpisodesOperation(
                corelationId,
                context,
                authorizer
            );

            if (getSeriesEpisodesResponse?.responseCode === "OK") {
                return context.send(getSeriesEpisodesResponse);
            } else {
                return context.status(400).send(getSeriesEpisodesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getSeriesEpisodesOperation(corelationId, context, authorizer) {
        try {
            const query = `SELECT a.*, b.*, c.name as tag_name, d.type_name, d.type_image FROM series_episodes a LEFT JOIN series b ON a.series_id = b.id LEFT JOIN tags c ON b.tag_id = c.id LEFT JOIN types d ON b.type_id = d.id WHERE a.is_deleted = 0`;
            const [result] = await db.query(query);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: result
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetSeriesEpisodesController;
