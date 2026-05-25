const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetUserRewardHistoryListController {

    static async getUserRewardHistoryList(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getUserRewardHistoryListResponse = await GetUserRewardHistoryListController.getUserRewardHistoryListOperation(
                corelationId,
                context,
                authorizer
            );

            if (getUserRewardHistoryListResponse?.responseCode === "OK") {
                return context.send(getUserRewardHistoryListResponse);
            } else {
                return context.status(400).send(getUserRewardHistoryListResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getUserRewardHistoryListOperation(corelationId, context, authorizer) {
        try {
            const query = `SELECT * FROM reward_history WHERE user_id = ${authorizer?.id} ORDER BY id DESC`;
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

module.exports = GetUserRewardHistoryListController;
