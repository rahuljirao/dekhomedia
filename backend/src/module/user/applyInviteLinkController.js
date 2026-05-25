const { db } = require("../../common/db");
const utils = require("../../common/utils");

class ApplyInviteLinkController {

    static async applyInviteLink(event, context) {
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            const token = request?.token;

            if (!token) {
                return context.status(400).send(await utils.generateResponseObj({
                    responseCode: "BAD_REQUEST",
                    responseMessage: "Invite token is required",
                    responseData: {}
                }));
            }

            // Validate token exists and is active
            const [links] = await db.query(
                `SELECT * FROM invite_links WHERE token = ? AND is_active = 1`,
                [token]
            );

            if (links.length === 0) {
                return context.status(400).send(await utils.generateResponseObj({
                    responseCode: "INVALID_TOKEN",
                    responseMessage: "Invalid or expired invite link",
                    responseData: {}
                }));
            }

            // Mark user as invited
            await db.query(
                `UPDATE users SET is_invited = 1 WHERE id = ?`,
                [authorizer.id]
            );

            return context.send(await utils.generateResponseObj({
                responseCode: "OK",
                responseMessage: "Invite applied successfully! You now have access to exclusive content.",
                responseData: { is_invited: 1 }
            }));
        } catch (err) {
            console.log("applyInviteLink error:", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = ApplyInviteLinkController;
