const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateAdsPlatformController {

    static async updateAdsPlatform(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateAdsPlatformController.updateAdsPlatformValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateAdsPlatformResponse = await UpdateAdsPlatformController.updateAdsPlatformOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateAdsPlatformResponse?.responseCode === "OK") {
                return context.send(updateAdsPlatformResponse);
            } else {
                return context.status(400).send(updateAdsPlatformResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateAdsPlatformOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM advertisement WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_ADVERTISEMENT_ID,
                    responseMessage: getStatusText(responsecodes().INVALID_ADVERTISEMENT_ID),
                    responseData: {}
                });
            }
            const query = `UPDATE advertisement SET ad_platform_name = ?, ad_publisher_id = ?, ad_banner_status = ?, ad_banner_id = ?, ad_banner_id_ios = ?, ad_banner_remarks = ?, ad_interstitial_status = ?, ad_interstitial_id = ?, ad_interstitial_id_ios = ?, ad_interstitial_clicks = ?, ad_interstitial_remarks = ?, ad_native_status =?, ad_native_id = ?, ad_native_id_ios = ?, ad_native_remarks = ?, ad_reward_status = ?, ad_reward_id = ?, ad_reward_id_ios = ?, ad_reward_remarks = ?, status = ? WHERE id = ?`;
            const values = [
                req?.ad_platform_name?.trim() ? req.ad_platform_name : null,
                req?.ad_publisher_id ? req.ad_publisher_id : null,
                req?.ad_banner_status ? req.ad_banner_status : 0,
                req?.ad_banner_id ? req.ad_banner_id : null,
                req?.ad_banner_id_ios ? req.ad_banner_id_ios : null,
                req?.ad_banner_remarks ? req.ad_banner_remarks : null,
                req?.ad_interstitial_status ? req.ad_interstitial_status : 0,
                req?.ad_interstitial_id ? req.ad_interstitial_id : null,
                req?.ad_interstitial_id_ios ? req.ad_interstitial_id_ios : null,
                req?.ad_interstitial_clicks ? req.ad_interstitial_clicks : 0,
                req?.ad_interstitial_remarks ? req.ad_interstitial_remarks : null,
                req?.ad_native_status ? req.ad_native_status : 0,
                req?.ad_native_id ? req.ad_native_id : null,
                req?.ad_native_id_ios ? req.ad_native_id_ios : null,
                req?.ad_native_remarks ? req.ad_native_remarks : null,
                req?.ad_reward_status ? req.ad_reward_status : 0,
                req?.ad_reward_id ? req.ad_reward_id : null,
                req?.ad_reward_id_ios ? req.ad_reward_id_ios : null,
                req?.ad_reward_remarks ? req.ad_reward_remarks : null,
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
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateAdsPlatformValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().ADVERTISEMENT_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().ADVERTISEMENT_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.ad_platform_name) {
            return {
                responseCode: responsecodes().ADS_PLATFORM_NAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().ADS_PLATFORM_NAME_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateAdsPlatformController;
