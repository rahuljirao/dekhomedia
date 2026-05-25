const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class AddEpisodesController {

    static async addEpisodes(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AddEpisodesController.addEpisodesValidator(event);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addEpisodes = await AddEpisodesController.addEpisodesOperation(
                event,
                corelationId,
                context,
                authorizer
            );

            if (addEpisodes?.responseCode === "OK") {
                return context.send(addEpisodes);
            } else {
                return context.status(400).send(addEpisodes);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addEpisodesOperation(req, corelationId, context, authorizer) {
        try {
            const episode_video = req.file;
            const filepath = `${process.env.BASE_URL}uploads/episode/${episode_video?.filename}`;
            let thumbnail_url = null;

            let image = await utils.getThumbnailFromVideo(filepath, 'uploads/episode/thumbnail');
            if(image.err === false){
                thumbnail_url = image?.path ?? null;
            }

            const [existingEpisode] = await db.query(
                `SELECT id FROM series_episodes WHERE series_id = ? AND episode_number = ?`,
                [req?.body?.series_id, Number(req?.body?.episode_number)]
            );

            if (existingEpisode.length > 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().DUPLICATE_EPISODE_NUMBER,
                    responseMessage: getStatusText(responsecodes().DUPLICATE_EPISODE_NUMBER),
                    responseData: {}
                });
            }

            const query = `INSERT INTO series_episodes (series_id, episode_number, video_url, title, description, tags, coin, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                req?.body?.series_id,
                req?.body?.episode_number,
                filepath,
                req?.body?.title,
                req?.body?.description,
                req?.body?.tags,
                req?.body?.coin,
                thumbnail_url
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: result?.insertId,
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
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addEpisodesValidator(req) {
        let errObj = {};
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
        if (!req?.body?.coin) {
            return {
                responseCode: responsecodes().COINS_REQUIRED,
                responseMessage: getStatusText(responsecodes().COINS_REQUIRED),
                responseData: {}
            };
        }

        if(!req.file){
            return await utils.generateResponseObj({
                responseCode: responsecodes().EPISODE_VIDEO_NOT_FOUND,
                responseMessage: getStatusText(responsecodes().EPISODE_VIDEO_NOT_FOUND),
                responseData: {}
            });
        }
        return errObj;
    }
}

module.exports = AddEpisodesController;
