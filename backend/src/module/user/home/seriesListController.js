const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class SeriesListController {

    static async seriesList(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.query === "string" ? JSON.parse(event.query) : event.query;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {  
            // Perform get operation
            const seriesListResponse = await SeriesListController.seriesListOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (seriesListResponse?.responseCode === "OK") {
                return context.send(seriesListResponse);
            } else {
                return context.status(400).send(seriesListResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async seriesListOperation(data, corelationId, context, authorizer) {
        try {
            const { random } = data;
            let query = `SELECT a.*, b.last_viewed_episode, b.last_unlocked_episode, b.watched_ads_for_episode, b.last_watched_ads_date, b.is_added_list, b.is_auto_unlocked, IFNULL(
                CONCAT('[', 
                    GROUP_CONCAT(
                        DISTINCT CONCAT('{"id":', c.id, ',"name":"', REPLACE(IFNULL(c.name, ''), '"', '\\\\"'), '"}')
                        ORDER BY c.id
                        SEPARATOR ','
                    ), 
                ']'), 
                '[]'
            ) AS tags, d.type_image, d.type_name, d.id as type_id, e.id as category_id, e.name as category_name, CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked, CASE WHEN g.id IS NOT NULL THEN 1 ELSE 0 END AS is_favourite FROM series a LEFT JOIN tags c ON FIND_IN_SET(c.id, a.tag_id) LEFT JOIN types d ON a.type_id = d.id LEFT JOIN categories e ON a.category_id = e.id LEFT JOIN users_watched_series b ON a.id = b.series_id AND b.user_id = ${authorizer?.id} LEFT JOIN users_liked_episode f ON f.user_id = ${authorizer?.id} AND a.id = f.series_id LEFT JOIN users_favourite_episode g ON g.user_id = ${authorizer?.id} AND a.id = g.series_id WHERE a.is_deleted = 0 AND a.is_active = 1 GROUP BY a.id`;
            if(random == 1){
                query += ` ORDER BY RAND()`;
            }
            const [list] = await db.query(query);
            const parsedList = (list || []).map(item => {
                try {
                    item.tags = item.tags ? JSON.parse(item.tags) : [];
                    // Filter out empty/invalid tags
                    item.tags = item.tags.filter(tag => tag.id !== null);
                } catch (e) {
                    item.tags = [];
                }
                return item;
            });
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: parsedList
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = SeriesListController;
