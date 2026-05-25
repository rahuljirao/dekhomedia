const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
class AdsTimerController {
    static async adsTimer(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AdsTimerController.adsTimerValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const adsTimerResponse = await AdsTimerController.adsTimerOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (adsTimerResponse?.responseCode === "OK") {
                return context.send(adsTimerResponse);
            } else {
                return context.status(400).send(adsTimerResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async adsTimerOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            const [[app_data]] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);

            const [watched] = await db.query('SELECT * FROM users_watched_series WHERE series_id = ? AND user_id = ?', [data?.series_id, authorizer?.id]);
            if(watched.length === 0){
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {
                        is_locked: 0,
                        watched_ads_for_episode: 0,
                        total_ads: app_data?.watch_ads_for_episode
                    }
                });
            }
            
            let watching = watched[0];
            if(app_data?.watch_ads_for_episode > watching?.watched_ads_for_episode){
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {
                        is_locked: 0,
                        watched_ads_for_episode: watching?.watched_ads_for_episode,
                        total_ads: app_data?.watch_ads_for_episode
                    }
                });
            } else {
                const addTime = app_data?.time_after_watch_ads;

                // Convert original date string to a Date object
                const date = new Date(watching?.last_watched_ads_date); // Ensure valid ISO format

                // Parse the addTime string
                const [addHours, addMinutes, addSeconds] = addTime.split(':').map(Number);

                // Add time
                date.setHours(date.getHours() + addHours);
                date.setMinutes(date.getMinutes() + addMinutes);
                date.setSeconds(date.getSeconds() + addSeconds);

                // Format result back to "YYYY-MM-DD HH:mm:ss"
                const pad = (n) => String(n).padStart(2, '0');
                const currentDatetime = new Date(); // Now

                // Get difference in milliseconds
                const diffMs = date - currentDatetime;

                // Convert to human-readable format
                const diffSeconds = Math.floor(diffMs / 1000);
                const diffMinutes = Math.floor(diffSeconds / 60);
                const diffHours = Math.floor(diffMinutes / 60);

                // Breakdown remaining time
                const hours = diffHours % 24;
                const minutes = diffMinutes % 60;
                const seconds = diffSeconds % 60;

                let lastResult = {
                    is_locked: 1,
                    watched_ads_for_episode: watching?.watched_ads_for_episode,
                    last_watched_ads_date: watching?.last_watched_ads_date,
                    unlock_time: date,
                    difference: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
                        total_ads: app_data?.watch_ads_for_episode
                };

                if(currentDatetime >= date){
                    const query = 'UPDATE users_watched_series SET watched_ads_for_episode = ?, last_watched_ads_date = ? WHERE id = ?';
                    const values = [
                        0,
                        null,
                        watching?.id
                    ];
                    const [result] = await db.query(query, values);
                    lastResult = {
                        is_locked: 0,
                        watched_ads_for_episode: null,
                        total_ads: app_data?.watch_ads_for_episode
                    };
                }

                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: lastResult
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async adsTimerValidator(req) {
        let errObj = {};
        if (!req?.series_id) {
            errObj = {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = AdsTimerController;
