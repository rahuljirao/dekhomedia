const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class DeleteWatchHistoryController {

    static async deleteWatchHistory(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await DeleteWatchHistoryController.deleteWatchHistoryValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform get operation
            const deleteWatchHistoryResponse = await DeleteWatchHistoryController.deleteWatchHistoryOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deleteWatchHistoryResponse?.responseCode === "OK") {
                return context.send(deleteWatchHistoryResponse);
            } else {
                return context.status(400).send(deleteWatchHistoryResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deleteWatchHistoryOperation(data, corelationId, context, authorizer) {
        try {
            const [[user]] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);

            if (!user) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            
            // Delete user's watched series records
            const { series_id } = data; // expects single or multiple series_id values

            if (Array.isArray(series_id) && series_id.length > 0) {
                // Delete multiple selected series entries
                const placeholders = series_id.map(() => '?').join(',');
                await db.query(
                    `DELETE FROM users_watched_series WHERE user_id = ? AND series_id IN (${placeholders})`,
                    [authorizer?.id, ...series_id]
                );
            }

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {}
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async deleteWatchHistoryValidator(req) {
        let errObj = {};

        if (!Array.isArray(req?.series_id) || req.series_id.length === 0) {
            errObj = {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = DeleteWatchHistoryController;
