const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetEpisodeSeriesWiseController {

    static async getSeriesEpisodes(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {       
            // Validate input data
            let response = await GetEpisodeSeriesWiseController.getSeriesEpisodesValidator(event);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }     
            // Perform get operation
            const getSeriesEpisodesResponse = await GetEpisodeSeriesWiseController.getSeriesEpisodesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getSeriesEpisodesResponse?.responseCode === "OK") {
                return context.send(getSeriesEpisodesResponse);
            } else {
                return context.status(400).send(getSeriesEpisodesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getSeriesEpisodesOperation(req, corelationId, context, authorizer) {
        try {
            const { search, start, length, dir, sortColumn, series_id } = req;

            const limit = length || 10;
            const offset = start || 0;
            const searchValue = search || '';
            const orderBy = dir || 'asc';
            const column = sortColumn || 'episode_number';
            
            const query = `SELECT a.*, b.views, IFNULL(GROUP_CONCAT(c.name SEPARATOR ', '), '') AS tag_name, d.type_name, d.type_image FROM series_episodes a LEFT JOIN series b ON a.series_id = b.id LEFT JOIN tags c ON FIND_IN_SET(c.id, b.tag_id) LEFT JOIN types d ON b.type_id = d.id WHERE a.is_deleted = 0 AND a.series_id = ? AND ( a.episode_number LIKE ? OR a.title LIKE ? ) GROUP BY a.id ORDER BY ?? ${orderBy} LIMIT ? OFFSET ? `;
            const [result] = await db.query(query, [series_id, `%${searchValue}%`, `%${searchValue}%`, column, parseInt(limit), parseInt(offset)]);

            const [count] = await db.query(`SELECT COUNT(*) as total FROM series_episodes a LEFT JOIN series b ON a.series_id = b.id LEFT JOIN tags c ON b.tag_id = c.id LEFT JOIN types d ON b.type_id = d.id WHERE a.is_deleted = 0 AND a.series_id = ?`, [series_id]);

            const [filteredCount] = await db.query(`SELECT COUNT(*) as total FROM series_episodes a LEFT JOIN series b ON a.series_id = b.id LEFT JOIN tags c ON b.tag_id = c.id LEFT JOIN types d ON b.type_id = d.id WHERE a.is_deleted = 0 AND a.series_id = ? AND ( a.episode_number LIKE ? OR a.title LIKE ? )`, [series_id, `%${searchValue}%`, `%${searchValue}%`]);

            for (const item of result) {
                if(!item?.thumbnail_url){
                    let image = await utils.getThumbnailFromVideo(item?.video_url, 'uploads/episode/thumbnail');
                    if(image.err === false){
                        const query = `UPDATE series_episodes SET thumbnail_url = ? WHERE id = ?`;
                        const values = [
                            image?.path ?? null,
                            item?.id
                        ];
                        const [result] = await db.query(query, values);
                        item.thumbnail_url = image?.path ?? null;
                    }
                }
                const [count] = await db.query(`SELECT IFNULL(SUM(coin), 0) AS total_coins, episode_id FROM episode_unlocked WHERE series_id = ? AND episode_id = ?`, [series_id, item.episode_number]);
                item.total_coins = count[0]?.total_coins || 0;
            }

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    data: result,
                    totalRecords: count[0].total,
                    recordsFiltered: filteredCount[0].total
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getSeriesEpisodesValidator(req) {
        let errObj = {};

        if (!req?.body?.series_id) {
            errObj = {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = GetEpisodeSeriesWiseController;
