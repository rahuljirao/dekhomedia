const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateAdsPlatformStatusController {

    static async updateAdsPlatformStatus(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateAdsPlatformStatusController.updateAdsPlatformStatusValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateAdsPlatformStatusResponse = await UpdateAdsPlatformStatusController.updateAdsPlatformStatusOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateAdsPlatformStatusResponse?.responseCode === "OK") {
                return context.send(updateAdsPlatformStatusResponse);
            } else {
                return context.status(400).send(updateAdsPlatformStatusResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateAdsPlatformStatusOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM advertisement WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_ADVERTISEMENT_ID,
                    responseMessage: getStatusText(responsecodes().INVALID_ADVERTISEMENT_ID),
                    responseData: {}
                });
            }
            const query = `UPDATE advertisement SET status = ? WHERE id = ?`;
            const values = [
                req?.status || req?.status >= 0 ? req.status : null,
                req?.id
            ];
            const [result] = await db.query(query, values);
            const [rows1] = await db.query('SELECT * FROM advertisement WHERE id = ?', [req?.id]);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: rows1[0]
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateAdsPlatformStatusValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().ADVERTISEMENT_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().ADVERTISEMENT_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.status && req?.status != '') {
            return {
                responseCode: responsecodes().ADS_PLATFORM_STATUS_REQUIRED,
                responseMessage: getStatusText(responsecodes().ADS_PLATFORM_STATUS_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateAdsPlatformStatusController;
