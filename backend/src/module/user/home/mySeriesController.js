const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class MySeriesController {

    static async mySeries(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const mySeriesResponse = await MySeriesController.mySeriesOperation(
                corelationId,
                context,
                authorizer
            );

            if (mySeriesResponse?.responseCode === "OK") {
                return context.send(mySeriesResponse);
            } else {
                return context.status(400).send(mySeriesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async mySeriesOperation(corelationId, context, authorizer) {
        try {
            const [mylist] = await db.query(`SELECT a.*, b.*, CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked, d.name as tags_name, e.name as category_name FROM users_favourite_episode a LEFT JOIN series b ON a.series_id = b.id LEFT JOIN users_liked_episode c ON a.user_id = c.user_id AND a.series_id = c.series_id LEFT JOIN tags d ON b.tag_id = d.id LEFT JOIN categories e ON b.category_id = e.id WHERE a.user_id = ${authorizer?.id} AND b.is_deleted = 0 AND b.is_active = 1`);
            const [history] = await db.query(`SELECT a.*, b.*, CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END AS is_liked, d.name as tags_name, e.name as category_name FROM users_watched_series a LEFT JOIN series b ON a.series_id = b.id LEFT JOIN users_liked_episode c ON a.user_id = c.user_id AND a.series_id = c.series_id LEFT JOIN tags d ON b.tag_id = d.id LEFT JOIN categories e ON b.category_id = e.id WHERE a.user_id = ${authorizer?.id} AND b.is_deleted = 0 AND b.is_active = 1`);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    mylist: mylist,
                    history: history
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = MySeriesController;
