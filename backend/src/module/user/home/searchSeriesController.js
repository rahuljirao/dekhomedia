const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class SearchSeriesController {

    static async searchSeries(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {  
            // Perform get operation
            const searchSeriesResponse = await SearchSeriesController.searchSeriesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (searchSeriesResponse?.responseCode === "OK") {
                return context.send(searchSeriesResponse);
            } else {
                return context.status(400).send(searchSeriesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async searchSeriesOperation(data, corelationId, context, authorizer) {
        try {
            const [tags] = await db.query(`SELECT * FROM tags WHERE is_deleted = 0`);
            if(data?.search && data?.search != ''){
                const [searchlist] = await db.query(`SELECT * FROM series WHERE is_deleted = 0 AND is_active = 1 AND title LIKE '%${data?.search}%'`);
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {
                        tags: tags,
                        searchlist: searchlist
                    }
                });
            } else {
                const [searchlist] = await db.query(`SELECT * FROM series WHERE is_deleted = 0 AND is_active = 1 AND is_recommended = 1`);
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {
                        tags: tags,
                        searchlist: searchlist
                    }
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = SearchSeriesController;
