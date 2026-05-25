const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateSocialLinksDetailsController {

    static async updateSocialLinksDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateSocialLinksDetailsController.SocialLinksDetailsValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const updateSocialLinksResponse = await UpdateSocialLinksDetailsController.SocialLinksDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateSocialLinksResponse?.responseCode === "OK") {
                return context.send(updateSocialLinksResponse);
            } else {
                return context.status(400).send(updateSocialLinksResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async SocialLinksDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const query = 'UPDATE about_us SET official_website = ?, follow_us_on_instagram = ?, follow_us_in_facebook = ?, follow_us_in_youtube = ?, follow_us_in_whatsapp_channel = ?, highlight = ?, mobile_number = ?, email = ? WHERE id = ?';
            const values = [
                data?.official_website,
                data?.follow_us_on_instagram,
                data?.follow_us_in_facebook,
                data?.follow_us_in_youtube,
                data?.follow_us_in_whatsapp_channel,
                data?.highlight ? data?.highlight: 'Movies, Reels, Originals, Trailers, Episodes, Shorts, Cast, Stories, Behind-the-Scenes, Genres, Reviews, Trending, Watchlist, Entertainment',
                data?.mobile_number ? data?.mobile_number :'+12 (345) 567 890',
                data?.email ? data?.email :'info@dramashort.com',
                1
            ];
            const [result] = await db.query(query, values);
            const [newRows] = await db.query('SELECT * FROM about_us WHERE id = ?', [1]);
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
    static async SocialLinksDetailsValidator(req) {
        let errObj = {};

        if (!req?.official_website) {
            errObj = {
                responseCode: responsecodes().OFFICIAL_WEBSITE_REQUIRED,
                responseMessage: getStatusText(responsecodes().OFFICIAL_WEBSITE_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.follow_us_on_instagram) {
            errObj = {
                responseCode: responsecodes().FOLLOW_US_ON_INSTAGRAM_REQUIRED,
                responseMessage: getStatusText(responsecodes().FOLLOW_US_ON_INSTAGRAM_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.follow_us_in_facebook) {
            errObj = {
                responseCode: responsecodes().FOLLOW_US_ON_FACEBOOK_REQUIRED,
                responseMessage: getStatusText(responsecodes().FOLLOW_US_ON_FACEBOOK_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.follow_us_in_youtube) {
            errObj = {
                responseCode: responsecodes().FOLLOW_US_ON_YOUTUBE_REQUIRED,
                responseMessage: getStatusText(responsecodes().FOLLOW_US_ON_YOUTUBE_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.follow_us_in_whatsapp_channel) {
            errObj = {
                responseCode: responsecodes().FOLLOW_US_ON_WHATSAPP_CHANNEL_REQUIRED,
                responseMessage: getStatusText(responsecodes().FOLLOW_US_ON_WHATSAPP_CHANNEL_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateSocialLinksDetailsController;
