const { db } = require("../../common/db");
const utils = require("../../common/utils");
const { generateToken } = require("../../middleware/tokenLib");
const { db: dbPool } = require("../../common/db");

class MobileLoginController {

    // POST /user/v1/mobile-login
    // Body: { mobile_number, device_id, device_token, content_group, referred_by_link, promoter_id }
    static async mobileLogin(event, context) {
        const req = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

        try {
            // --- Validate ---
            if (!req?.mobile_number) {
                return context.status(400).send(await utils.generateResponseObj({
                    responseCode: "MOBILE_REQUIRED",
                    responseMessage: "Mobile number is required",
                    responseData: {}
                }));
            }
            if (!req?.device_id) {
                return context.status(400).send(await utils.generateResponseObj({
                    responseCode: "DEVICE_ID_REQUIRED",
                    responseMessage: "Device ID is required",
                    responseData: {}
                }));
            }

            const mobile_number = req.mobile_number.toString().trim();
            const content_group = req.content_group || 'normal';   // from promoter verify
            const referred_by_link = req.referred_by_link || null;  // slug string
            const promoter_id = req.promoter_id || null;
            const device_id = req.device_id;
            const device_token = req.device_token || null;

            // --- Find existing user by mobile ---
            let [existingUsers] = await db.query(
                `SELECT * FROM users WHERE mobile_number = ?`,
                [mobile_number]
            );

            let user;

            if (existingUsers.length > 0) {
                // --- Existing user: update their profile permanently ---
                user = existingUsers[0];
                await db.query(
                    `UPDATE users 
                     SET content_group = ?,
                         referred_by_link = COALESCE(referred_by_link, ?),
                         promoter_id = COALESCE(promoter_id, ?),
                         device_id = ?,
                         device_token = ?
                     WHERE id = ?`,
                    [
                        content_group,
                        referred_by_link,
                        promoter_id,
                        device_id,
                        device_token,
                        user.id
                    ]
                );
                // Refresh user row
                [[user]] = await db.query(`SELECT * FROM users WHERE id = ?`, [user.id]);

            } else {
                // --- New user: create with mobile_number + content_group ---
                const uid = await utils.generate16DigitUUID();
                const [result] = await db.query(
                    `INSERT INTO users 
                        (uid, login_type, login_type_id, mobile_number, content_group, referred_by_link, promoter_id, device_id, device_token, language_id) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        uid,
                        'mobile',
                        mobile_number,  // login_type_id = mobile number for mobile login
                        mobile_number,
                        content_group,
                        referred_by_link,
                        promoter_id,
                        device_id,
                        device_token,
                        1
                    ]
                );
                [[user]] = await db.query(`SELECT * FROM users WHERE id = ?`, [result.insertId]);
            }

            // --- Also merge with existing guest session on same device ---
            // If a guest account exists for this device, carry over their coins/history
            const [guestUsers] = await db.query(
                `SELECT * FROM users WHERE login_type = 'guest' AND device_id = ? AND id != ?`,
                [device_id, user.id]
            );
            if (guestUsers.length > 0) {
                const guest = guestUsers[0];
                // Transfer coin balance from guest
                if (guest.coin_balance > 0) {
                    await db.query(
                        `UPDATE users SET coin_balance = coin_balance + ? WHERE id = ?`,
                        [guest.coin_balance, user.id]
                    );
                }
                // Soft-delete guest account
                await db.query(
                    `UPDATE users SET is_deleted = 1 WHERE id = ?`,
                    [guest.id]
                );
                // Re-fetch user
                [[user]] = await db.query(`SELECT * FROM users WHERE id = ?`, [user.id]);
            }

            // --- Generate JWT ---
            const tokenPayload = { id: user.id, uid: user.uid };
            user.token = await generateToken(tokenPayload);

            return context.send(await utils.generateResponseObj({
                responseCode: "OK",
                responseMessage: "Login successful",
                responseData: user
            }));

        } catch (err) {
            console.log("mobileLogin error:", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = MobileLoginController;
