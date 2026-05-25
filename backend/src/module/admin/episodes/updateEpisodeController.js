const fs = require("fs");
const path = require("path");
const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateEpisodesController {

    static async updateEpisodes(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateEpisodesController.updateEpisodesValidator(event);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateEpisodes = await UpdateEpisodesController.updateEpisodesOperation(
                event,
                corelationId,
                context,
                authorizer
            );

            if (updateEpisodes?.responseCode === "OK") {
                return context.send(updateEpisodes);
            } else {
                return context.status(400).send(updateEpisodes);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateEpisodesOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM series_episodes WHERE id = ?', [req?.body?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_EPISODE,
                    responseMessage: getStatusText(responsecodes().INVALID_EPISODE),
                    responseData: {}
                });
            }
            const [existingEpisode] = await db.query(
                `SELECT id FROM series_episodes WHERE series_id = ? AND episode_number = ? AND id != ?`,
                [req?.body?.series_id, Number(req?.body?.episode_number), req?.body?.id]
            );

            if (existingEpisode.length > 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().DUPLICATE_EPISODE_NUMBER,
                    responseMessage: getStatusText(responsecodes().DUPLICATE_EPISODE_NUMBER),
                    responseData: {}
                });
            }
            // console.log(r)
            const episode_video = req?.file;
            if(episode_video){
                const oldVideoUrl = rows[0].video_url;
                const oldVideoPath = path.join(__dirname, oldVideoUrl.replace(process.env.BASE_URL, "../../../../"));
                if (fs.existsSync(oldVideoPath)) {
                    fs.unlinkSync(oldVideoPath);
                }
                if(rows[0].thumbnail_url){
                    const oldThumbnailUrl = rows[0].thumbnail_url;
                    const oldThumbnailPath = path.join(__dirname, oldThumbnailUrl.replace(process.env.BASE_URL, "../../../../"));
                    if (fs.existsSync(oldThumbnailPath)) {
                        fs.unlinkSync(oldThumbnailPath);
                    }
                }
                const filepath = `${process.env.BASE_URL}uploads/episode/${episode_video?.filename}`;
                let thumbnail_url = null;

                let image = await utils.getThumbnailFromVideo(filepath, 'uploads/episode/thumbnail');
                if(image.err === false){
                    thumbnail_url = image?.path ?? null;
                }

                const query = `UPDATE series_episodes SET series_id = ?, episode_number = ?, video_url = ?, title = ?, description = ?, tags = ?, coin = ?, thumbnail_url = ? WHERE id = ?`;
                const values = [
                    req?.body?.series_id,
                    req?.body?.episode_number,
                    filepath,
                    req?.body?.title,
                    req?.body?.description,
                    req?.body?.tags,
                    req?.body?.coin,
                    thumbnail_url,
                    req?.body?.id
                ];
                const [result] = await db.query(query, values);

                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {
                        id: req?.body?.id,
                        series_id: req?.body?.series_id,
                        episode_number: req?.body?.episode_number,
                        title: req?.body?.title,
                        description: req?.body?.description,
                        tags: req?.body?.tags,
                        coin: req?.body?.coin,
                        video_url: filepath,
                        thumbnail_url: thumbnail_url
                    }
                });
            } else {
                const query = `UPDATE series_episodes SET series_id = ?, episode_number = ?, title = ?, description = ?, tags = ?, coin = ? WHERE id = ?`;
                const values = [
                    req?.body?.series_id,
                    req?.body?.episode_number,
                    req?.body?.title,
                    req?.body?.description,
                    req?.body?.tags,
                    req?.body?.coin,
                    req?.body?.id
                ];
                const [result] = await db.query(query, values);

                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {
                        id: req?.body?.id,
                        series_id: req?.body?.series_id,
                        episode_number: req?.body?.episode_number,
                        title: req?.body?.title,
                        description: req?.body?.description,
                        tags: req?.body?.tags,
                        coin: req?.body?.coin,
                        video_url: rows[0].video_url,
                        thumbnail_url: rows[0].thumbnail_url
                    }
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateEpisodesValidator(req) {
        let errObj = {};
        if (!req?.body?.id) {
            return {
                responseCode: responsecodes().EPISODE_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().EPISODE_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.body?.series_id) {
            return {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }

        // if (!req?.body?.title) {
        //     return {
        //         responseCode: responsecodes().EPISODE_TITLE_REQUIRED,
        //         responseMessage: getStatusText(responsecodes().EPISODE_TITLE_REQUIRED),
        //         responseData: {}
        //     };
        // }

        // if (!req?.body?.description) {
        //     return {
        //         responseCode: responsecodes().EPISODE_DESCRIPTION_REQUIRED,
        //         responseMessage: getStatusText(responsecodes().EPISODE_DESCRIPTION_REQUIRED),
        //         responseData: {}
        //     };
        // }

        // if (!req?.body?.tags) {
        //     return {
        //         responseCode: responsecodes().EPISODE_TAGS_REQUIRED,
        //         responseMessage: getStatusText(responsecodes().EPISODE_TAGS_REQUIRED),
        //         responseData: {}
        //     };
        // }

        if (!req?.body?.coin) {
            return {
                responseCode: responsecodes().COINS_REQUIRED,
                responseMessage: getStatusText(responsecodes().COINS_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.body?.episode_number) {
            return {
                responseCode: responsecodes().EPISODE_NUMBER_REQUIRED,
                responseMessage: getStatusText(responsecodes().EPISODE_NUMBER_REQUIRED),
                responseData: {}
            };
        }
        const episodeNumber = Number(req?.body?.episode_number);
        if (isNaN(episodeNumber)) {
            return {
                responseCode: responsecodes().INVALID_EPISODE_NUMBER,
                responseMessage: getStatusText(responsecodes().INVALID_EPISODE_NUMBER),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = UpdateEpisodesController;
