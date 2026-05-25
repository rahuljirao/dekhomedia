const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class RecommandedSeriesController {

    static async recommandedSeries(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const recommandedSeriesResponse = await RecommandedSeriesController.recommandedSeriesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (recommandedSeriesResponse?.responseCode === "OK") {
                return context.send(recommandedSeriesResponse);
            } else {
                return context.status(400).send(recommandedSeriesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async recommandedSeriesOperation(req, corelationId, context, authorizer) {
        try {
            let query = `SELECT a.*, b.name as category_name, CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked, d.name as tags_name FROM series a LEFT JOIN categories b ON a.category_id = b.id LEFT JOIN users_liked_episode c ON c.user_id = ${authorizer?.id} AND a.id = c.series_id LEFT JOIN tags d ON a.tag_id = d.id WHERE a.is_deleted = 0 AND a.is_recommended = 1 AND a.is_active = 1`;
            let params = [];

            if (req?.series_id) {
                query += ` AND a.id != ?`;
                params.push(req.series_id);
            }

            const [recommandedlist] = await db.query(query, params);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: recommandedlist
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = RecommandedSeriesController;
