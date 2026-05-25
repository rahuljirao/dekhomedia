const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetDetailsEpisodeController {

    static async getDetailsEpisode(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetDetailsEpisodeController.getDetailsEpisodeValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const getEpisodeResponse = await GetDetailsEpisodeController.getDetailsEpisodeOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getEpisodeResponse?.responseCode === "OK") {
                return context.send(getEpisodeResponse);
            } else {
                return context.status(400).send(getEpisodeResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getDetailsEpisodeOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT a.*, b.*, IFNULL(GROUP_CONCAT(c.name SEPARATOR ", "), "") AS tag_name, d.type_name, d.type_image FROM series_episodes a LEFT JOIN series b ON a.series_id = b.id LEFT JOIN tags c ON FIND_IN_SET(c.id, b.tag_id) LEFT JOIN types d ON b.type_id = d.id WHERE a.is_deleted = 0 AND a.id = ? GROUP BY a.id', [data?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_EPISODE,
                    responseMessage: getStatusText(responsecodes().INVALID_EPISODE),
                    responseData: {}
                });
            }

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: rows[0]
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getDetailsEpisodeValidator(req) {
        let errObj = {};

        if (!req?.id) {
            return {
                responseCode: responsecodes().REQUEST_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().REQUEST_ID_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = GetDetailsEpisodeController;
