const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateAppDataDetailsController {

    static async updateAppDataDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateAppDataDetailsController.appDataDetailsValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const updateAppDataResponse = await UpdateAppDataDetailsController.appDataDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateAppDataResponse?.responseCode === "OK") {
                return context.send(updateAppDataResponse);
            } else {
                return context.status(400).send(updateAppDataResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async appDataDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const query = 'UPDATE app_data SET daily_watch_maximum_ads = ?, extra_daily = ?, daily_watch_ads_for_minimum_coin = ?, daily_watch_ads_for_maximum_coin = ?, watch_ads_for_episode = ?, how_many_episode_watch_after_ads = ?, time_after_watch_ads = ?, time_after_watch_daily_ads = ?, time_between_daily_ads = ?, per_episode_coin = ?, day_1_coin = ?, day_2_coin = ?, day_3_coin = ?, day_4_coin = ?, day_5_coin = ?, day_6_coin = ?, day_7_coin = ?, bind_email_coin = ?, link_whatsapp_coin = ?, follow_us_on_facebook_coin = ?, follow_us_on_youtube_coin = ?, follow_us_on_instagram_coin = ?, login_reward_coin = ?, turn_on_notification_coin = ? WHERE id = ?';
            const values = [
                data?.daily_watch_maximum_ads,
                data?.extra_daily,
                data?.daily_watch_ads_for_minimum_coin,
                data?.daily_watch_ads_for_maximum_coin,
                data?.watch_ads_for_episode,
                data?.how_many_episode_watch_after_ads,
                data?.time_after_watch_ads,
                data?.time_after_watch_daily_ads,
                data?.time_between_daily_ads,
                data?.per_episode_coin,
                data?.day_1_coin,
                data?.day_2_coin,
                data?.day_3_coin,
                data?.day_4_coin,
                data?.day_5_coin,
                data?.day_6_coin,
                data?.day_7_coin,
                data?.bind_email_coin,
                data?.link_whatsapp_coin,
                data?.follow_us_on_facebook_coin,
                data?.follow_us_on_youtube_coin,
                data?.follow_us_on_instagram_coin,
                data?.login_reward_coin,
                data?.turn_on_notification_coin,
                1
            ];
            const [result] = await db.query(query, values);
            const [newRows] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
            let newDetails = newRows[0];

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: newDetails
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async appDataDetailsValidator(req) {
        let errObj = {};

        if (!req?.daily_watch_maximum_ads) {
            errObj = {
                responseCode: responsecodes().DAILY_WATCH_MAXIMUM_ADS_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAILY_WATCH_MAXIMUM_ADS_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.extra_daily) {
            errObj = {
                responseCode: responsecodes().EXTRA_DAILY_REQUIRED,
                responseMessage: getStatusText(responsecodes().EXTRA_DAILY_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.daily_watch_ads_for_minimum_coin) {
            errObj = {
                responseCode: responsecodes().DAILY_WATCH_ADS_FOR_MINIMUM_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAILY_WATCH_ADS_FOR_MINIMUM_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.daily_watch_ads_for_maximum_coin) {
            errObj = {
                responseCode: responsecodes().DAILY_WATCH_ADS_FOR_MAXIMUM_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAILY_WATCH_ADS_FOR_MAXIMUM_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.watch_ads_for_episode) {
            errObj = {
                responseCode: responsecodes().WATCH_ADS_FOR_EPISODE_REQUIRED,
                responseMessage: getStatusText(responsecodes().WATCH_ADS_FOR_EPISODE_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.time_after_watch_ads) {
            errObj = {
                responseCode: responsecodes().TIME_AFTER_WATCH_ADS_REQUIRED,
                responseMessage: getStatusText(responsecodes().TIME_AFTER_WATCH_ADS_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.time_after_watch_daily_ads) {
            errObj = {
                responseCode: responsecodes().TIME_AFTER_WATCH_DAILY_ADS_REQUIRED,
                responseMessage: getStatusText(responsecodes().TIME_AFTER_WATCH_DAILY_ADS_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.time_between_daily_ads) {
            errObj = {
                responseCode: responsecodes().TIME_BETWEEN_DAILY_ADS_REQUIRED,
                responseMessage: getStatusText(responsecodes().TIME_BETWEEN_DAILY_ADS_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.per_episode_coin) {
            errObj = {
                responseCode: responsecodes().PER_EPISODE_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().PER_EPISODE_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.day_1_coin) {
            errObj = {
                responseCode: responsecodes().DAY_ONE_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAY_ONE_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.day_2_coin) {
            errObj = {
                responseCode: responsecodes().DAY_TWO_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAY_TWO_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.day_3_coin) {
            errObj = {
                responseCode: responsecodes().DAY_THREE_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAY_THREE_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.day_4_coin) {
            errObj = {
                responseCode: responsecodes().DAY_FOUR_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAY_FOUR_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.day_5_coin) {
            errObj = {
                responseCode: responsecodes().DAY_FIVE_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAY_FIVE_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.day_6_coin) {
            errObj = {
                responseCode: responsecodes().DAY_SIX_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAY_SIX_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.day_7_coin) {
            errObj = {
                responseCode: responsecodes().DAY_SEVEN_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().DAY_SEVEN_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.bind_email_coin) {
            errObj = {
                responseCode: responsecodes().BIND_EMAIL_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().BIND_EMAIL_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.login_reward_coin) {
            errObj = {
                responseCode: responsecodes().LOGIN_REWARD_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().LOGIN_REWARD_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.turn_on_notification_coin) {
            errObj = {
                responseCode: responsecodes().TURN_ON_NOTIFICATION_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().TURN_ON_NOTIFICATION_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.link_whatsapp_coin) {
            errObj = {
                responseCode: responsecodes().LINK_WHATSAPP_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().LINK_WHATSAPP_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.follow_us_on_facebook_coin) {
            errObj = {
                responseCode: responsecodes().FOLLOW_US_ON_FACEBOOK_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().FOLLOW_US_ON_FACEBOOK_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.follow_us_on_youtube_coin) {
            errObj = {
                responseCode: responsecodes().FOLLOW_US_ON_YOUTUBE_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().FOLLOW_US_ON_YOUTUBE_COIN_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.follow_us_on_instagram_coin) {
            errObj = {
                responseCode: responsecodes().FOLLOW_US_ON_INSTAGRAM_COIN_REQUIRED,
                responseMessage: getStatusText(responsecodes().FOLLOW_US_ON_INSTAGRAM_COIN_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateAppDataDetailsController;
