const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class AdsController {

    static async getAdvertise(event, context) {
        let corelationId = await getDateTimeString();
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getAdvertiseResponse = await AdsController.getAdvertiseOperation(
                corelationId,
                context,
                authorizer
            );

            if (getAdvertiseResponse?.responseCode === "OK") {
                return context.send(getAdvertiseResponse);
            } else {
                return context.status(400).send(getAdvertiseResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getAdvertiseOperation(corelationId, context, authorizer) {
        try {
            const query = `SELECT * FROM advertisement`;
            const [result] = await db.query(query);
            let responseData = result;
            responseData.forEach(res => {
                delete res.ad_platform_image;
                res.ad_banner_id = res.ad_banner_id && res.ad_banner_id != '' ? res.ad_banner_id.split('|'):[];
                res.ad_banner_id_ios = res.ad_banner_id_ios && res.ad_banner_id_ios != '' ? res.ad_banner_id_ios.split('|'):[];
                res.ad_interstitial_id = res.ad_interstitial_id && res.ad_interstitial_id != '' ? res.ad_interstitial_id.split('|'):[];
                res.ad_interstitial_id_ios = res.ad_interstitial_id_ios && res.ad_interstitial_id_ios != '' ? res.ad_interstitial_id_ios.split('|'):[];
                res.ad_native_id = res.ad_native_id && res.ad_native_id != '' ? res.ad_native_id.split('|'):[];
                res.ad_native_id_ios = res.ad_native_id_ios && res.ad_native_id_ios != '' ? res.ad_native_id_ios.split('|'):[];
                res.ad_reward_id = res.ad_reward_id && res.ad_reward_id != '' ? res.ad_reward_id.split('|'):[];
                res.ad_reward_id_ios = res.ad_reward_id_ios && res.ad_reward_id_ios != '' ? res.ad_reward_id_ios.split('|'):[];
            });
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: responseData
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = AdsController;
