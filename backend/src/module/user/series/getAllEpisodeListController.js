const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetAllEpisodeListController {

    static async getAllEpisodeList(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {      
            let response = await GetAllEpisodeListController.getAllEpisodeListValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }      
            // Perform get operation
            const getAllEpisodeListResponse = await GetAllEpisodeListController.getAllEpisodeListOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getAllEpisodeListResponse?.responseCode === "OK") {
                return context.send(getAllEpisodeListResponse);
            } else {
                return context.status(400).send(getAllEpisodeListResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getAllEpisodeListOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            let userDetails = rows[0];
            let is_unlimited = userDetails.is_weekly_vip || userDetails.is_monthly_vip || userDetails.is_yearly_vip;

            const [[series]] = await db.query(`SELECT a.*, b.last_viewed_episode, b.last_unlocked_episode, b.watched_ads_for_episode, b.last_watched_ads_date, b.is_added_list, b.is_auto_unlocked, IFNULL(
                CONCAT('[', 
                    GROUP_CONCAT(
                        DISTINCT CONCAT('{"id":', c.id, ',"name":"', REPLACE(IFNULL(c.name, ''), '"', '\\\\"'), '"}')
                        ORDER BY c.id
                        SEPARATOR ','
                    ), 
                ']'), 
                '[]'
            ) as tags_name, d.type_image, d.type_name, d.id as type_id, e.id as category_id, e.name as category_name, CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked, CASE WHEN g.id IS NOT NULL THEN 1 ELSE 0 END AS is_favourite FROM series a LEFT JOIN tags c ON FIND_IN_SET(c.id, a.tag_id) > 0 LEFT JOIN types d ON a.type_id = d.id LEFT JOIN categories e ON a.category_id = e.id LEFT JOIN users_watched_series b ON a.id = b.series_id AND b.user_id = ${authorizer?.id} LEFT JOIN users_liked_episode f ON f.user_id = ${authorizer?.id} AND a.id = f.series_id LEFT JOIN users_favourite_episode g ON g.user_id = ${authorizer?.id} AND a.id = g.series_id WHERE a.id = ${req?.series_id} AND a.is_deleted = 0 AND a.is_active = 1 GROUP BY a.id`);
            if(!series){
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_SERIES,
                    responseMessage: getStatusText(responsecodes().INVALID_SERIES),
                    responseData: {}
                });
            }

            try {
                series.tags_name = series.tags_name ? JSON.parse(series.tags_name) : [];
                series.tags_name = series.tags_name.filter(tag => tag && tag.id !== null);
            } catch (e) {
                series.tags_name = [];
            }

            series.availableCoin = userDetails?.coin_balance;
            series.availableWalletBalance = userDetails?.wallet_balance;

            const [all_episodes] = await db.query(`SELECT a.*, CASE WHEN c.id IS NOT NULL THEN 0 ELSE 1 END AS is_liked, CASE WHEN d.id IS NOT NULL THEN 0 ELSE 1 END AS is_favourite, CASE WHEN e.last_viewed_episode IS NOT NULL AND a.episode_number <= e.last_viewed_episode THEN 0 ELSE 1 END AS is_viewed, IFNULL(
                CONCAT('[', 
                    GROUP_CONCAT(
                        DISTINCT CONCAT('{"id":', b.id, ',"name":"', REPLACE(IFNULL(b.name, ''), '"', '\\\\"'), '"}')
                        ORDER BY b.id
                        SEPARATOR ','
                    ), 
                ']'), 
                '[]'
            ) AS tags_name FROM series_episodes a LEFT JOIN tags b ON a.tags IS NOT NULL AND a.tags != '' AND FIND_IN_SET(b.id, a.tags) > 0 LEFT JOIN users_liked_episode c ON c.user_id = ${authorizer?.id} AND a.series_id = c.series_id LEFT JOIN users_favourite_episode d ON d.user_id = ${authorizer?.id} AND a.series_id = d.series_id  LEFT JOIN users_watched_series e ON e.user_id = ${authorizer?.id} AND e.series_id = a.series_id WHERE a.is_deleted = 0 AND a.series_id = ${req?.series_id} GROUP BY a.id ORDER BY a.episode_number`);
             
            let free_episodes = series?.last_unlocked_episode ?? series?.free_episodes;
            for (const item of all_episodes) {
                try {
                    item.tags_name = item.tags_name ? JSON.parse(item.tags_name) : [];
                    item.tags_name = item.tags_name.filter(tag => tag && tag.id !== null);
                } catch (e) {
                    item.tags_name = [];
                }

                if(!item?.title){
                    item.title = `Episode ${item.episode_number} - ${series.title}`;
                }
                if(!item?.description){
                    item.description = series.description;
                }
                if(!item?.thumbnail_url){
                    item.thumbnail_url = series.thumbnail;
                }
                if (series.is_free === 1) {
                    item.is_locked = 0;
                } else {
                    if (!is_unlimited) {
                        if (item.episode_number <= free_episodes) {
                            item.is_locked = 0;
                        } else {
                            item.is_locked = 1;
                        }
                    } else {
                        item.is_locked = 0;
                    }
                }
            }
            
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

    static async getAllEpisodeListValidator(req) {
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

module.exports = GetAllEpisodeListController;
