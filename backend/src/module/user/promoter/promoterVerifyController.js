const { db } = require("../../../common/db");
const utils = require("../../../common/utils");

class PromoterVerifyController {

    // GET /user/v1/promoter/verify?slug=RiyaQueen
    static async verifySlug(event, context) {
        const slug = event.query?.slug || event.params?.slug;

        try {
            if (!slug) {
                return context.status(400).send(await utils.generateResponseObj({
                    responseCode: "SLUG_REQUIRED",
                    responseMessage: "Promoter slug is required",
                    responseData: {}
                }));
            }

            const [rows] = await db.query(
                `SELECT id, name, custom_slug, allowed_content_type 
                 FROM promoters 
                 WHERE custom_slug = ? AND is_active = 1`,
                [slug]
            );

            if (rows.length === 0) {
                return context.status(400).send(await utils.generateResponseObj({
                    responseCode: "INVALID_SLUG",
                    responseMessage: "Invalid or inactive promoter link",
                    responseData: {}
                }));
            }

            const promoter = rows[0];
            return context.send(await utils.generateResponseObj({
                responseCode: "OK",
                responseMessage: "Promoter verified successfully",
                responseData: {
                    promoter_id: promoter.id,
                    promoter_name: promoter.name,
                    slug: promoter.custom_slug,
                    content_group: promoter.allowed_content_type  // 'normal' or 'premium'
                }
            }));

        } catch (err) {
            console.log("verifySlug error:", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = PromoterVerifyController;
