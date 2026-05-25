const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetDetailsSeriesController {

    static async getDetailsSeries(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetDetailsSeriesController.getDetailsSeriesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const getSeriesResponse = await GetDetailsSeriesController.getDetailsSeriesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getSeriesResponse?.responseCode === "OK") {
                return context.send(getSeriesResponse);
            } else {
                return context.status(400).send(getSeriesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getDetailsSeriesOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT a.*, IFNULL(GROUP_CONCAT(b.name SEPARATOR ", "), "") AS tag_name, c.type_name, c.type_image FROM series a LEFT JOIN tags b ON FIND_IN_SET(b.id, a.tag_id) LEFT JOIN types c ON a.type_id = c.id WHERE a.is_deleted = 0 AND a.id = ? GROUP BY a.id', [data?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_SERIES,
                    responseMessage: getStatusText(responsecodes().INVALID_SERIES),
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

    static async getDetailsSeriesValidator(req) {
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

module.exports = GetDetailsSeriesController;
