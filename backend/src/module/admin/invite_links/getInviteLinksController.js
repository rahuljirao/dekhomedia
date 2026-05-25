const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");

class GetInviteLinksController {

    static async getInviteLinks(event, context) {
        try {
            const [links] = await db.query(
                `SELECT id, token, note, is_active, created_at,
                 CONCAT(?, '/invite/', token) as invite_url
                 FROM invite_links 
                 WHERE is_active = 1 
                 ORDER BY created_at DESC`,
                [process.env.APP_DEEP_LINK_BASE || 'https://dekho-uncut.app']
            );

            return context.send(await utils.generateResponseObj({
                responseCode: "OK",
                responseMessage: "Invite links fetched successfully",
                responseData: links
            }));
        } catch (err) {
            console.log("getInviteLinks error:", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetInviteLinksController;
