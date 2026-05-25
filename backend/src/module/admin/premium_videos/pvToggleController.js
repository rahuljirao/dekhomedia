const { db }  = require("../../../common/db");
const utils   = require("../../../common/utils");

exports.toggleRecommended = async (req, res) => {
    const { id, is_recommended } = req.body;
    if (!id) return res.status(400).send(await utils.generateResponseObj({ responseCode: "ID_REQUIRED", responseMessage: "ID required", responseData: {} }));
    try {
        const val = is_recommended == "1" ? 1 : 0;
        await db.query(`UPDATE premium_videos SET is_recommended = ? WHERE id = ?`, [val, id]);
        return res.send(await utils.generateResponseObj({ responseCode: "OK", responseMessage: "Updated", responseData: { id, is_recommended: val } }));
    } catch (err) {
        return res.status(400).send(await utils.throwCatchError(err));
    }
};

exports.toggleActive = async (req, res) => {
    const { id, is_active } = req.body;
    if (!id) return res.status(400).send(await utils.generateResponseObj({ responseCode: "ID_REQUIRED", responseMessage: "ID required", responseData: {} }));
    try {
        const val = is_active == "1" ? 1 : 0;
        await db.query(`UPDATE premium_videos SET is_active = ? WHERE id = ?`, [val, id]);
        return res.send(await utils.generateResponseObj({ responseCode: "OK", responseMessage: "Updated", responseData: { id, is_active: val } }));
    } catch (err) {
        return res.status(400).send(await utils.throwCatchError(err));
    }
};
