const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetEpisodeListController {

    static async getEpisodeList(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {      
            let response = await GetEpisodeListController.getEpisodeListValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }      
            // Perform get operation
            const getEpisodeListResponse = await GetEpisodeListController.getEpisodeListOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getEpisodeListResponse?.responseCode === "OK") {
                return context.send(getEpisodeListResponse);
            } else {
                return context.status(400).send(getEpisodeListResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getEpisodeListOperation(req, corelationId, context, authorizer) {
        try {
            const [[series]] = await db.query(`SELECT a.*, b.last_viewed_episode, b.last_unlocked_episode, b.watched_ads_for_episode, b.last_watched_ads_date, b.is_added_list, b.is_auto_unlocked, IFNULL(
                CONCAT('[', 
                    GROUP_CONCAT(
                        DISTINCT CONCAT('{"id":', c.id, ',"name":"', REPLACE(IFNULL(c.name, ''), '"', '\\\\"'), '"}')
                        ORDER BY c.id
                        SEPARATOR ','
                    ), 
                ']'), 
                '[]'
            ) AS tags, d.type_image, d.type_name, d.id as type_id, e.id as category_id, e.name as category_name, CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked, CASE WHEN g.id IS NOT NULL THEN 1 ELSE 0 END AS is_favourite FROM series a LEFT JOIN tags c ON FIND_IN_SET(c.id, a.tag_id) > 0 LEFT JOIN types d ON a.type_id = d.id LEFT JOIN categories e ON a.category_id = e.id LEFT JOIN users_watched_series b ON a.id = b.series_id AND b.user_id = ${authorizer?.id} LEFT JOIN users_liked_episode f ON f.user_id = ${authorizer?.id} AND a.id = f.series_id LEFT JOIN users_favourite_episode g ON g.user_id = ${authorizer?.id} AND a.id = g.series_id WHERE a.id = ${req?.series_id} AND a.is_deleted = 0 AND a.is_active = 1 GROUP BY a.id`);
            if(!series){
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_SERIES,
                    responseMessage: getStatusText(responsecodes().INVALID_SERIES),
                    responseData: {}
                });
            }
            try {
                series.tags = series.tags ? JSON.parse(series.tags) : [];
                series.tags = series.tags.filter(tag => tag && tag.id !== null);
            } catch (e) {
                series.tags = [];
            }
            let limit = series?.free_episodes;
            if(series?.last_unlocked_episode){
                limit = series?.last_unlocked_episode;
            }
            const [all_episodes] = await db.query(`SELECT a.*, CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked FROM series_episodes a LEFT JOIN users_liked_episode c ON c.user_id = ${authorizer?.id} AND a.series_id = c.series_id AND a.id = c.episode_id WHERE a.is_deleted = 0 AND a.series_id = ${req?.series_id} LIMIT ${limit}`);

            const [seriesTagsRows] = await db.query("SELECT tag_id FROM series WHERE id = ?", [req.series_id]);
            const seriesTagCsv = seriesTagsRows[0]?.tag_id || '';
            const tagIds = seriesTagCsv.split(',').map(Number).filter(Boolean);
            let tagConditions = '';
            if (tagIds.length > 0) {
                tagConditions = tagIds.map(id => `FIND_IN_SET(${id}, a.tag_id)`).join(' + ');
            }

            let query = `SELECT a.*, b.name AS category_name, CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked, d.name AS tags_name, (${tagConditions}) AS match_count FROM series a LEFT JOIN categories b ON a.category_id = b.id LEFT JOIN users_liked_episode c ON c.user_id = ${authorizer?.id} AND a.id = c.series_id LEFT JOIN tags d ON a.tag_id = d.id WHERE a.is_deleted = 0 AND a.is_active = 1`;

            let params = [];

            if (req?.series_id) {
                query += ` AND a.id != ?`;
                params.push(req.series_id);
            }

            if (tagConditions) {
                query += ` AND (${tagIds.map(id => `FIND_IN_SET(${id}, a.tag_id) > 0`).join(' OR ')})`;
                query += ` ORDER BY match_count DESC`;
            } else {
                query += ` GROUP BY a.id ORDER BY a.id DESC`;
            }
            
            const [youMightLikelist] = await db.query(query, params);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    series:series,
                    all_episodes:all_episodes,
                    you_might_liked:youMightLikelist
                }
            });
        } catch (err) {
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getEpisodeListValidator(req) {
        let errObj = {};
		if (!req?.series_id) {
            return {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }
		
        return errObj;
    }
}

module.exports = GetEpisodeListController;
