const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const crypto = require("crypto");

class GenerateInviteLinkController {

    static async generateInviteLink(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

        try {
            // Generate unique token
            const token = crypto.randomBytes(24).toString('hex');
            const note = request?.note || null;

            await db.query(
                `INSERT INTO invite_links (token, note) VALUES (?, ?)`,
                [token, note]
            );

            const inviteUrl = `${process.env.APP_DEEP_LINK_BASE || 'https://dekho-uncut.app'}/invite/${token}`;

            return context.send(await utils.generateResponseObj({
                responseCode: "OK",
                responseMessage: "Invite link generated successfully",
                responseData: {
                    token: token,
                    invite_url: inviteUrl,
                    note: note
                }
            }));
        } catch (err) {
            console.log("generateInviteLink error:", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GenerateInviteLinkController;
