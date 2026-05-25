const fs = require("fs");
const path = require("path");
const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateFreeSeriesController {

    static async updateFreeSeries(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateFreeSeriesController.updateFreeSeriesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateFreeSeries = await UpdateFreeSeriesController.updateFreeSeriesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateFreeSeries?.responseCode === "OK") {
                return context.send(updateFreeSeries);
            } else {
                return context.status(400).send(updateFreeSeries);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateFreeSeriesOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM series WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_SERIES,
                    responseMessage: getStatusText(responsecodes().INVALID_SERIES),
                    responseData: {}
                });
            }
            let seriesData = rows[0];
            const query = `UPDATE series SET is_free = ? WHERE id = ?`;
            const values = [
                req?.is_free,
                req?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: seriesData?.id,
                    title: seriesData?.title,
                    description: seriesData?.description,
                    thumbnail: seriesData?.thumbnail,
                    cover_video: seriesData?.cover_video,
                    type_id: seriesData?.type_id,
                    tag_id: seriesData?.tag_id,
                    category_id: seriesData?.category_id,
                    total_episode: seriesData?.total_episode,
                    free_episodes: seriesData?.free_episodes,
                    is_free: req?.is_free,
                    is_recommended: seriesData?.is_recommended,
                }
            });

            
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateFreeSeriesValidator(req) {
        let errObj = {};
        if (!req?.is_free) {
            return {
                responseCode: responsecodes().SERIES_IS_FREE_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_IS_FREE_REQUIRED),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = UpdateFreeSeriesController;
