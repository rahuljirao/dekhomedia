const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UnlockEpisodeController {
    static async unlockEpisode(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UnlockEpisodeController.unlockEpisodeValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const unlockEpisodeResponse = await UnlockEpisodeController.unlockEpisodeOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (unlockEpisodeResponse?.responseCode === "OK") {
                return context.send(unlockEpisodeResponse);
            } else {
                return context.status(400).send(unlockEpisodeResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async unlockEpisodeOperation(data, corelationId, context, authorizer) {
        try {
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
            const [rows2] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            if (rows2.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            const [[app_data]] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
            let seriesDetails = rows[0];
            let episodeDetails = rows1[0];
            let userDetails = rows2[0];
            let is_unlimited = userDetails.is_weekly_vip || userDetails.is_monthly_vip || userDetails.is_yearly_vip;
            const [watched] = await db.query('SELECT * FROM users_watched_series WHERE series_id = ? AND user_id = ?', [data?.series_id, authorizer?.id]);
            if(is_unlimited || seriesDetails.is_free){
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {}
                });
            }
            if(watched.length > 0){
                let watching = watched[0];
                if(watching?.last_unlocked_episode >= data?.episode_id){
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().ALREADY_UNLOCKED_EPISODE,
                        responseMessage: getStatusText(responsecodes().ALREADY_UNLOCKED_EPISODE),
                        responseData: {}
                    });
                } else {
                    if(data?.is_ads == 1){
                        if(app_data?.watch_ads_for_episode > watching?.watched_ads_for_episode){
                            let last_unlocked_episode = watching?.last_unlocked_episode + app_data?.how_many_episode_watch_after_ads;
                            const query = 'UPDATE users_watched_series SET last_unlocked_episode = ?, watched_ads_for_episode = ?, last_watched_ads_date = ? WHERE id = ?';
                            const values = [
                                last_unlocked_episode,
                                Number(watching?.watched_ads_for_episode) + 1,
                                new Date(),
                                watching?.id
                            ];
                            const [result] = await db.query(query, values);
                            let [watching1] = await db.query('SELECT * FROM users_watched_series WHERE id = ?', [watching?.id]);
                            return await utils.generateResponseObj({
                                responseCode: responsecodes().SUCCESS_OK,
                                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                                responseData: watching1[0]
                            });
                        } else {
                            return await utils.generateResponseObj({
                                responseCode: responsecodes().YOU_ALREADY_WATCHED,
                                responseMessage: getStatusText(responsecodes().YOU_ALREADY_WATCHED),
                                responseData: {}
                            });
                        }
                    } else {
                        let reward_coin = userDetails?.wallet_balance;
                        let coin_balance = userDetails?.coin_balance;
                        if(reward_coin >= episodeDetails?.coin){
                            let coins = Number(reward_coin) - Number(episodeDetails?.coin);
                            const user = `UPDATE users SET wallet_balance = ? WHERE id = ?`;
                            const usersvalues = [
                                coins,
                                authorizer?.id
                            ];
                            const [result2] = await db.query(user, usersvalues);
                            const query = 'UPDATE users_watched_series SET last_unlocked_episode = ? WHERE id = ?';
                            const values = [
                                data?.episode_id,
                                watching?.id
                            ];
                            const [result] = await db.query(query, values);
                            const query1 = 'INSERT into episode_unlocked (user_id, series_id, episode_id, coin) values (?, ?, ?, ?)';
                            const values1 = [
                                authorizer?.id,
                                data?.series_id,
                                data?.episode_id,
                                episodeDetails?.coin
                            ];
                            const [result1] = await db.query(query1, values1);
                            let [watching1] = await db.query('SELECT * FROM users_watched_series WHERE id = ?', [result?.insertId]);
                            return await utils.generateResponseObj({
                                responseCode: responsecodes().SUCCESS_OK,
                                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                                responseData: watching1[0]
                            });
                        } else if(coin_balance >= episodeDetails?.coin){
                            let coins = Number(coin_balance) - Number(episodeDetails?.coin);
                            const user = `UPDATE users SET coin_balance = ? WHERE id = ?`;
                            const usersvalues = [
                                coins,
                                authorizer?.id
                            ];
                            const [result2] = await db.query(user, usersvalues);
                            const query = 'UPDATE users_watched_series SET last_unlocked_episode = ? WHERE id = ?';
                            const values = [
                                data?.episode_id,
                                watching?.id
                            ];
                            const [result] = await db.query(query, values);
                            const query1 = 'INSERT into episode_unlocked (user_id, series_id, episode_id, coin) values (?, ?, ?, ?)';
                            const values1 = [
                                authorizer?.id,
                                data?.series_id,
                                data?.episode_id,
                                episodeDetails?.coin
                            ];
                            const [result1] = await db.query(query1, values1);
                            let [watching1] = await db.query('SELECT * FROM users_watched_series WHERE id = ?', [watching?.id]);
                            return await utils.generateResponseObj({
                                responseCode: responsecodes().SUCCESS_OK,
                                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                                responseData: watching1[0]
                            });
                        } else {
                            return await utils.generateResponseObj({
                                responseCode: responsecodes().UNLOCK_NEW_EPISODE,
                                responseMessage: getStatusText(responsecodes().UNLOCK_NEW_EPISODE),
                                responseData: {}
                            });
                        }
                    }
                }
            } else {
                if(data?.is_ads == 1){
                    let last_unlocked_episode = seriesDetails?.free_episodes + app_data?.how_many_episode_watch_after_ads;
                    const query = 'INSERT into users_watched_series (user_id, series_id, last_viewed_episode, last_unlocked_episode, watched_ads_for_episode, last_watched_ads_date, is_auto_unlocked) values (?, ?, ?, ?, ?, ?, ?)';
                    const values = [
                        authorizer?.id,
                        data?.series_id,
                        seriesDetails?.free_episodes,
                        last_unlocked_episode,
                        1,
                        new Date(),
                        0
                    ];
                    const [result] = await db.query(query, values);
                    let [watching1] = await db.query('SELECT * FROM users_watched_series WHERE id = ?', [result?.insertId]);
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().SUCCESS_OK,
                        responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                        responseData: watching1[0]
                    });
                } else {
                    if(data?.episode_id > seriesDetails?.free_episodes){
                        let reward_coin = userDetails?.wallet_balance;
                        let coin_balance = userDetails?.coin_balance;
                        if(reward_coin >= episodeDetails?.coin){
                            let coins = Number(reward_coin) - Number(episodeDetails?.coin);
                            const user = `UPDATE users SET wallet_balance = ? WHERE id = ?`;
                            const usersvalues = [
                                coins,
                                authorizer?.id
                            ];
                            const [result2] = await db.query(user, usersvalues);
                            const query = 'INSERT into users_watched_series (user_id, series_id, last_viewed_episode, last_unlocked_episode, is_auto_unlocked) values (?, ?, ?, ?, ?)';
                            const values = [
                                authorizer?.id,
                                data?.series_id,
                                seriesDetails?.free_episodes,
                                data?.episode_id,
                                0
                            ];
                            const [result] = await db.query(query, values);
                            const query1 = 'INSERT into episode_unlocked (user_id, series_id, episode_id, coin) values (?, ?, ?, ?)';
                            const values1 = [
                                authorizer?.id,
                                data?.series_id,
                                data?.episode_id,
                                episodeDetails?.coin
                            ];
                            const [result1] = await db.query(query1, values1);
                            let [watching] = await db.query('SELECT * FROM users_watched_series WHERE id = ?', [result?.insertId]);
                            return await utils.generateResponseObj({
                                responseCode: responsecodes().SUCCESS_OK,
                                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                                responseData: watching[0]
                            });
                        } else if(coin_balance >= episodeDetails?.coin){
                            let coins = Number(coin_balance) - Number(episodeDetails?.coin);
                            const user = `UPDATE users SET coin_balance = ? WHERE id = ?`;
                            const usersvalues = [
                                coins,
                                authorizer?.id
                            ];
                            const [result2] = await db.query(user, usersvalues);
                            const query = 'INSERT into users_watched_series (user_id, series_id, last_viewed_episode, last_unlocked_episode, is_auto_unlocked) values (?, ?, ?, ?, ?)';
                            const values = [
                                authorizer?.id,
                                data?.series_id,
                                seriesDetails?.free_episodes,
                                data?.episode_id,
                                0
                            ];
                            const [result] = await db.query(query, values);
                            const query1 = 'INSERT into episode_unlocked (user_id, series_id, episode_id, coin) values (?, ?, ?, ?)';
                            const values1 = [
                                authorizer?.id,
                                data?.series_id,
                                data?.episode_id,
                                episodeDetails?.coin
                            ];
                            const [result1] = await db.query(query1, values1);
                            let [watching] = await db.query('SELECT * FROM users_watched_series WHERE id = ?', [result?.insertId]);
                            return await utils.generateResponseObj({
                                responseCode: responsecodes().SUCCESS_OK,
                                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                                responseData: watching[0]
                            });
                        } else {
                            return await utils.generateResponseObj({
                                responseCode: responsecodes().UNLOCK_NEW_EPISODE,
                                responseMessage: getStatusText(responsecodes().UNLOCK_NEW_EPISODE),
                                responseData: {}
                            });
                        }
                    } else {
                        const query = 'INSERT into users_watched_series (user_id, series_id, last_viewed_episode, last_unlocked_episode, is_auto_unlocked) values (?, ?, ?, ?, ?)';
                        const values = [
                            authorizer?.id,
                            data?.series_id,
                            seriesDetails?.free_episodes,
                            data?.episode_id,
                            0
                        ];
                        const [result] = await db.query(query, values);
                        let [watching] = await db.query('SELECT * FROM users_watched_series WHERE id = ?', [result?.insertId]);
                        return await utils.generateResponseObj({
                            responseCode: responsecodes().SUCCESS_OK,
                            responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                            responseData: watching[0]
                        });
                    }
                }
            }
            
        } catch (err) {
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async unlockEpisodeValidator(req) {
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
        if (req?.is_ads !== 0 && req?.is_ads !== 1) {
            errObj = {
                responseCode: responsecodes().IS_ADS_REQUIRED,
                responseMessage: getStatusText(responsecodes().IS_ADS_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UnlockEpisodeController;
