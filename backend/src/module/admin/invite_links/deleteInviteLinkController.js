const { db } = require("../../../common/db");
const utils = require("../../../common/utils");

class DeleteInviteLinkController {

    static async deleteInviteLink(event, context) {
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

        try {
            if (!request?.id) {
                return context.status(400).send(await utils.generateResponseObj({
                    responseCode: "BAD_REQUEST",
                    responseMessage: "Invite link ID is required",
                    responseData: {}
                }));
            }

            await db.query(
                `UPDATE invite_links SET is_active = 0 WHERE id = ?`,
                [request.id]
            );

            return context.send(await utils.generateResponseObj({
                responseCode: "OK",
                responseMessage: "Invite link deleted successfully",
                responseData: {}
            }));
        } catch (err) {
            console.log("deleteInviteLink error:", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = DeleteInviteLinkController;
