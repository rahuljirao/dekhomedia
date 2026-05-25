const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class UpdateSeriesAutoUnlockController {

    static async updateSeriesAutoUnlock(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {      
            let response = await UpdateSeriesAutoUnlockController.updateSeriesAutoUnlockValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }      
            // Perform get operation
            const updateSeriesAutoUnlockResponse = await UpdateSeriesAutoUnlockController.updateSeriesAutoUnlockOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateSeriesAutoUnlockResponse?.responseCode === "OK") {
                return context.send(updateSeriesAutoUnlockResponse);
            } else {
                return context.status(400).send(updateSeriesAutoUnlockResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateSeriesAutoUnlockOperation(data, corelationId, context, authorizer) {
        try {
            const query = `UPDATE users_watched_series SET is_auto_unlocked = ?  WHERE series_id = ? AND user_id = ?`;
            const values = [
                data?.is_auto_unlocked,
                data?.series_id,
                authorizer?.id
            ];
            const [result] = await db.query(query, values);
            const [[watched]] = await db.query('SELECT * FROM users_watched_series WHERE series_id = ? AND user_id = ?', [data?.series_id, authorizer?.id]);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: watched
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateSeriesAutoUnlockValidator(req) {
        let errObj = {};
		if (!req?.series_id) {
            return {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }
        if (req?.is_auto_unlocked !== 0 && req?.is_auto_unlocked !== 1) {
            errObj = {
                responseCode: responsecodes().IS_AUTO_UNLOCKED_REQUIRED,
                responseMessage: getStatusText(responsecodes().IS_AUTO_UNLOCKED_REQUIRED),
                responseData: {}
            };
        }
		
        return errObj;
    }
}

module.exports = UpdateSeriesAutoUnlockController;
