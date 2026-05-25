const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetTagWiseSeriesController {

    static async getTagWiseSeries(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {      
            let response = await GetTagWiseSeriesController.getTagWiseSeriesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }      
            // Perform get operation
            const getTagWiseSeriesResponse = await GetTagWiseSeriesController.getTagWiseSeriesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getTagWiseSeriesResponse?.responseCode === "OK") {
                return context.send(getTagWiseSeriesResponse);
            } else {
                return context.status(400).send(getTagWiseSeriesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getTagWiseSeriesOperation(req, corelationId, context, authorizer) {
        try {
            const [all] = await db.query(`SELECT * FROM series WHERE is_deleted = 0 AND is_active = 1 AND FIND_IN_SET(${req?.id}, tag_id) > 0`);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: all
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getTagWiseSeriesValidator(req) {
        let errObj = {};
		if (!req?.id) {
            return {
                responseCode: responsecodes().TAG_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().TAG_ID_REQUIRED),
                responseData: {}
            };
        }
		
        return errObj;
    }
}

module.exports = GetTagWiseSeriesController;
