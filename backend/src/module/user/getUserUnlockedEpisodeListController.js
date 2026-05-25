const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetUserUnlockedEpisodeListController {

    static async getUserUnlockedEpisodeList(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getUserUnlockedEpisodeListResponse = await GetUserUnlockedEpisodeListController.getUserUnlockedEpisodeListOperation(
                corelationId,
                context,
                authorizer
            );

            if (getUserUnlockedEpisodeListResponse?.responseCode === "OK") {
                return context.send(getUserUnlockedEpisodeListResponse);
            } else {
                return context.status(400).send(getUserUnlockedEpisodeListResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getUserUnlockedEpisodeListOperation(corelationId, context, authorizer) {
        try {
            const query = `SELECT a.*, b.title, c.episode_number FROM episode_unlocked a LEFT JOIN series b ON a.series_id = b.id LEFT JOIN series_episodes c ON a.episode_id = c.id WHERE a.user_id = ${authorizer?.id} ORDER BY a.id DESC`;
            const [results] = await db.query(query);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: results
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetUserUnlockedEpisodeListController;
