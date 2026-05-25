const fs = require("fs");
const path = require("path");
const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateSeriesController {

    static async updateSeries(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateSeriesController.updateSeriesValidator(event);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const updateSeries = await UpdateSeriesController.updateSeriesOperation(
                event,
                corelationId,
                context,
                authorizer
            );

            if (updateSeries?.responseCode === "OK") {
                return context.send(updateSeries);
            } else {
                return context.status(400).send(updateSeries);
            }
        } catch (err) {
            console.log("Error in updateSeries:", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateSeriesOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM series WHERE id = ?', [req?.body?.id]);
            if (rows.length === 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_SERIES,
                    responseMessage: getStatusText(responsecodes().INVALID_SERIES),
                    responseData: {}
                });
            }

            let seriesData = rows[0];

            // Delete old files
            const deleteFileIfExists = (filePath) => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            };

            const updateFields = {
                title: req?.body?.title,
                description: req?.body?.description,
                type_id: req?.body?.type_id,
                tag_id: req?.body?.tag_id,
                category_id: req?.body?.category_id,
                total_episode: req?.body?.total_episode,
                free_episodes: req?.body?.free_episodes,
                is_free: req?.body?.is_free,
                is_recommended: req?.body?.is_recommended,
                thumbnail: seriesData?.thumbnail,
                cover_video: seriesData?.cover_video,
                poster: seriesData?.poster,
            };

            if (req?.files?.thumbnail) {
                const oldImagePath = path.join(__dirname, seriesData?.thumbnail.replace(process.env.BASE_URL, "../../../../"));
                deleteFileIfExists(oldImagePath);
                updateFields.thumbnail = `${process.env.BASE_URL}uploads/series/images/${req.files.thumbnail[0].filename}`;
            }

            if (req?.files?.cover_video) {
                const oldVideoPath = path.join(__dirname, seriesData?.cover_video.replace(process.env.BASE_URL, "../../../../"));
                deleteFileIfExists(oldVideoPath);
                updateFields.cover_video = `${process.env.BASE_URL}uploads/series/cover_video/${req.files.cover_video[0].filename}`;
            }

            if (req?.files?.poster) {
                if(seriesData?.poster){
                    const oldPosterPath = path.join(__dirname, seriesData?.poster.replace(process.env.BASE_URL, "../../../../"));
                    deleteFileIfExists(oldPosterPath);
                }
                updateFields.poster = `${process.env.BASE_URL}uploads/series/poster/${req.files.poster[0].filename}`;
            }

            const query = `UPDATE series SET 
                title = ?, 
                description = ?, 
                thumbnail = ?, 
                cover_video = ?, 
                poster = ?, 
                type_id = ?, 
                tag_id = ?, 
                category_id = ?, 
                total_episode = ?, 
                free_episodes = ?, 
                is_free = ?, 
                is_recommended = ? 
                WHERE id = ?`;

            const values = [
                updateFields.title,
                updateFields.description,
                updateFields.thumbnail,
                updateFields.cover_video,
                updateFields.poster,
                updateFields.type_id,
                updateFields.tag_id,
                updateFields.category_id,
                updateFields.total_episode,
                updateFields.free_episodes,
                updateFields.is_free,
                updateFields.is_recommended,
                req?.body?.id
            ];

            await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: req?.body?.id,
                    ...updateFields
                }
            });

        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateSeriesValidator(req) {
        if (!req?.body?.id) {
            return {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.body?.title) {
            return {
                responseCode: responsecodes().SERIES_TITLE_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_TITLE_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.body?.description) {
            return {
                responseCode: responsecodes().SERIES_DESCRIPTION_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_DESCRIPTION_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.body?.tag_id) {
            return {
                responseCode: responsecodes().SERIES_TAG_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_TAG_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.body?.category_id) {
            return {
                responseCode: responsecodes().SERIES_CATEGORY_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_CATEGORY_ID_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.body?.total_episode) {
            return {
                responseCode: responsecodes().SERIES_TOTAL_EPISODE_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_TOTAL_EPISODE_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.body?.free_episodes) {
            return {
                responseCode: responsecodes().SERIES_FREE_EPISODE_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_FREE_EPISODE_REQUIRED),
                responseData: {}
            };
        }

        if (req?.body?.is_free === undefined || req?.body?.is_free === null) {
            return {
                responseCode: responsecodes().SERIES_IS_FREE_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_IS_FREE_REQUIRED),
                responseData: {}
            };
        }

        if (req?.body?.is_recommended === undefined || req?.body?.is_recommended === null) {
            return {
                responseCode: responsecodes().SERIES_IS_RECOMMENDED_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_IS_RECOMMENDED_REQUIRED),
                responseData: {}
            };
        }

        return {};
    }
}

module.exports = UpdateSeriesController;