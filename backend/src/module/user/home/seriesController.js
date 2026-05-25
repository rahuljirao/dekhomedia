const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class SeriesController {

    static async getSeries(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            const result = await SeriesController.getSeriesOperation(corelationId, context, authorizer);
            if (result?.responseCode === "OK") {
                return context.send(result);
            } else {
                return context.status(400).send(result);
            }
        } catch (err) {
            console.log("getSeries error:", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getSeriesOperation(corelationId, context, authorizer) {
        try {
            // --- Fetch user's content_group from DB (source of truth) ---
            const [[userRow]] = await db.query(
                `SELECT content_group FROM users WHERE id = ?`,
                [authorizer?.id]
            );
            const contentGroup = userRow?.content_group || 'normal';

            // Filter: only show series matching user's content_group
            const groupFilter = `AND a.content_group = '${contentGroup}'`;

            // --- Base SELECT for series ---
            const seriesSelect = `
                SELECT a.*, 
                       c.id as tags_id, c.name as tags_name,
                       d.type_image, d.type_name, d.id as type_id,
                       e.id as category_id, e.name as category_name,
                       CASE WHEN b.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked
                FROM series a
                LEFT JOIN tags c ON a.tag_id = c.id
                LEFT JOIN types d ON a.type_id = d.id
                LEFT JOIN categories e ON a.category_id = e.id
                LEFT JOIN users_liked_episode b 
                    ON b.user_id = ${authorizer?.id} AND b.series_id = a.id
                WHERE a.is_deleted = 0 AND a.is_active = 1 ${groupFilter}
            `;

            const [recommended] = await db.query(
                `${seriesSelect} AND a.is_recommended = 1`
            );
            const [populer] = await db.query(
                `${seriesSelect} ORDER BY a.views DESC LIMIT 20`
            );
            const [ranking] = await db.query(
                `${seriesSelect} ORDER BY a.views DESC LIMIT 5`
            );
            const [new_relese] = await db.query(
                `${seriesSelect} ORDER BY a.created_at DESC LIMIT 20`
            );
            const [findoutmore] = await db.query(
                `SELECT * FROM tags WHERE is_deleted = 0 ORDER BY RAND() LIMIT 4`
            );

            // Categories with their series (filtered by content_group)
            const [categories] = await db.query(
                `SELECT * FROM categories WHERE is_deleted = 0`
            );
            for (const category of categories) {
                const [series] = await db.query(
                    `${seriesSelect} AND a.category_id = ${category.id}`
                );
                category.series = series;
            }

            // Watch history
            const [history] = await db.query(
                `SELECT a.*, b.*,
                        CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked,
                        d.name as tags_name, e.name as category_name
                 FROM users_watched_series a
                 LEFT JOIN series b ON a.series_id = b.id
                 LEFT JOIN users_liked_episode c 
                     ON a.user_id = c.user_id AND a.series_id = c.series_id
                 LEFT JOIN tags d ON b.tag_id = d.id
                 LEFT JOIN categories e ON b.category_id = e.id
                 WHERE a.user_id = ${authorizer?.id}
                   AND b.is_deleted = 0 AND b.is_active = 1
                   AND b.content_group = '${contentGroup}'`
            );

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    content_group: contentGroup,    // tells Android which mode user is in
                    populer,
                    recommended,
                    ranking,
                    findoutmore,
                    categories,
                    new_relese,
                    history
                }
            });

        } catch (err) {
            console.log("getSeriesOperation error:", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = SeriesController;
