const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class AddUpdateFavouriteEpisodeController {
    static async addUpdateFavouriteEpisode(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AddUpdateFavouriteEpisodeController.addUpdateFavouriteEpisodeValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const addUpdateFavouriteEpisodeResponse = await AddUpdateFavouriteEpisodeController.addUpdateFavouriteEpisodeOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (addUpdateFavouriteEpisodeResponse?.responseCode === "OK") {
                return context.send(addUpdateFavouriteEpisodeResponse);
            } else {
                return context.status(400).send(addUpdateFavouriteEpisodeResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addUpdateFavouriteEpisodeOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM series WHERE id = ?', [data?.series_id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_SERIES,
                    responseMessage: getStatusText(responsecodes().INVALID_SERIES),
                    responseData: {}
                });
            }
            if(data?.episode_id !== 0 && data?.episode_id !== '0'){
                const [rows1] = await db.query('SELECT * FROM series_episodes WHERE id = ?', [data?.episode_id]);
                if (rows1.length == 0) {
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().INVALID_EPISODE,
                        responseMessage: getStatusText(responsecodes().INVALID_EPISODE),
                        responseData: {}
                    });
                }
            }
            let seriesDetails = rows[0];
            let favourites = seriesDetails?.favourites;
            const [liked] = await db.query('SELECT * FROM users_favourite_episode WHERE series_id = ? AND user_id = ?', [data?.series_id, authorizer?.id]);
            if(liked.length > 0){
                let like = liked[0];
                if(data?.is_favourite === 0){
                    const query = 'DELETE FROM users_favourite_episode WHERE id = ?';
                    const values = [
                        like?.id
                    ];
                    const [result] = await db.query(query, values);
                    let update = await db.query(`UPDATE series SET favourites = ? WHERE id = ?`, [Number(favourites)-1, data?.series_id]);
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().SUCCESS_OK,
                        responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                        responseData: {}
                    });
                } else {
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().SUCCESS_OK,
                        responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                        responseData: {}
                    });
                }
            } else {
                const query = 'INSERT into users_favourite_episode (user_id, series_id, episode_id) values (?, ?, ?)';
                const values = [
                    authorizer?.id,
                    data?.series_id,
                    data?.episode_id
                ];
                const [result] = await db.query(query, values);
                let update = await db.query(`UPDATE series SET favourites = ? WHERE id = ?`, [Number(favourites)+1, data?.series_id]);
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {}
                });
            }
            
        } catch (err) {
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async addUpdateFavouriteEpisodeValidator(req) {
        let errObj = {};

        if (!req?.series_id) {
            errObj = {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }
        if (req?.episode_id === undefined || req?.episode_id === null || req?.episode_id === '') {
            errObj = {
                responseCode: responsecodes().EPISODE_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().EPISODE_ID_REQUIRED),
                responseData: {}
            };
        }
        if (req?.is_favourite !== 0 && req?.is_favourite !== 1) {
            errObj = {
                responseCode: responsecodes().IS_LIKED_REQUIRED,
                responseMessage: getStatusText(responsecodes().IS_LIKED_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = AddUpdateFavouriteEpisodeController;
