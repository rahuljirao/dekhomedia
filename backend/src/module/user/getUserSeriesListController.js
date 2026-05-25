const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetUserSeriesListController {

    static async getUserSeriesList(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getUserSeriesListResponse = await GetUserSeriesListController.getUserSeriesListOperation(
                corelationId,
                context,
                authorizer
            );

            if (getUserSeriesListResponse?.responseCode === "OK") {
                return context.send(getUserSeriesListResponse);
            } else {
                return context.status(400).send(getUserSeriesListResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getUserSeriesListOperation(corelationId, context, authorizer) {
        try {
            const query = `SELECT a.*, b.title, b.thumbnail FROM users_watched_series a LEFT JOIN series b ON a.series_id = b.id WHERE a.user_id = ${authorizer?.id}`;
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

module.exports = GetUserSeriesListController;
