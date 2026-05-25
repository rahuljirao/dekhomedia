const { db } = require("../../../common/db");
const utils = require("../../../common/utils");

exports.delete = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) return res.status(400).send(await utils.generateResponseObj({ responseCode: "ID_REQUIRED", responseMessage: "ID is required", responseData: {} }));
        await db.query(`UPDATE promoters SET is_active = 0 WHERE id = ?`, [id]);
        return res.send(await utils.generateResponseObj({ responseCode: "OK", responseMessage: "Deleted successfully", responseData: {} }));
    } catch (err) {
        return res.status(400).send(await utils.throwCatchError(err));
    }
};
