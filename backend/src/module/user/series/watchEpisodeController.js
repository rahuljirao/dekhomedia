const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class WatchEpisodeController {
    static async watchEpisode(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await WatchEpisodeController.watchEpisodeValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const watchEpisodeResponse = await WatchEpisodeController.watchEpisodeOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (watchEpisodeResponse?.responseCode === "OK") {
                return context.send(watchEpisodeResponse);
            } else {
                return context.status(400).send(watchEpisodeResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async watchEpisodeOperation(data, corelationId, context, authorizer) {
        try {
            const [user] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            if (user.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            let userDetails = user[0];
            let is_unlimited = userDetails.is_weekly_vip || userDetails.is_monthly_vip || userDetails.is_yearly_vip;

            const [rows] = await db.query('SELECT * FROM series WHERE id = ?', [data?.series_id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_SERIES,
                    responseMessage: getStatusText(responsecodes().INVALID_SERIES),
                    responseData: {}
                });
            }
            const [rows1] = await db.query('SELECT * FROM series_episodes WHERE episode_number = ? AND series_id = ?', [data?.episode_id, data?.series_id]);
            if (rows1.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_EPISODE,
                    responseMessage: getStatusText(responsecodes().INVALID_EPISODE),
                    responseData: {}
                });
            }
            let seriesDetails = rows[0];
            let views = seriesDetails?.views;
            const [watched] = await db.query('SELECT * FROM users_watched_series WHERE series_id = ? AND user_id = ?', [data?.series_id, authorizer?.id]);
            if(watched.length > 0){
                let watching = watched[0];
                if(data?.episode_id > watching?.last_unlocked_episode && !is_unlimited && !seriesDetails.is_free){
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().UNLOCK_NEW_EPISODE,
                        responseMessage: getStatusText(responsecodes().UNLOCK_NEW_EPISODE),
                        responseData: {}
                    });
                } else {
                    const query = 'UPDATE users_watched_series SET last_viewed_episode = ? WHERE id = ?';
                    const values = [
                        data?.episode_id,
                        watching?.id
                    ];
                    const [result] = await db.query(query, values);
                    watching.last_viewed_episode = data?.episode_id;
                    let update = await db.query(`UPDATE series SET views = ? WHERE id = ?`, [Number(views)+1, data?.series_id]);
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().SUCCESS_OK,
                        responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                        responseData: watching
                    });
                }
            } else {
                const query = 'INSERT into users_watched_series (user_id, series_id, last_viewed_episode, last_unlocked_episode, is_auto_unlocked) values (?, ?, ?, ?, ?)';
                const values = [
                    authorizer?.id,
                    data?.series_id,
                    data?.episode_id,
                    seriesDetails?.free_episodes,
                    0
                ];
                const [result] = await db.query(query, values);
                
                let update = await db.query(`UPDATE series SET views = ? WHERE id = ?`, [Number(views)+1, data?.series_id]);
                let [watching] = await db.query('SELECT * FROM users_watched_series WHERE id = ?', [result?.insertId]);
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: watching[0]
                });
            }
            
        } catch (err) {
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async watchEpisodeValidator(req) {
        let errObj = {};

        if (!req?.series_id) {
            errObj = {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.episode_id) {
            errObj = {
                responseCode: responsecodes().EPISODE_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().EPISODE_ID_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = WatchEpisodeController;
