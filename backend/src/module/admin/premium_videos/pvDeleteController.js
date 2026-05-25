const { db }  = require("../../../common/db");
const utils   = require("../../../common/utils");

exports.del = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).send(await utils.generateResponseObj({ responseCode: "ID_REQUIRED", responseMessage: "ID required", responseData: {} }));
    try {
        await db.query(`UPDATE premium_videos SET is_deleted = 1 WHERE id = ?`, [id]);
        return res.send(await utils.generateResponseObj({ responseCode: "OK", responseMessage: "Deleted successfully", responseData: {} }));
    } catch (err) {
        return res.status(400).send(await utils.throwCatchError(err));
    }
};
