const { db } = require("../../../common/db");
const utils = require("../../../common/utils");

exports.list = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM promoters WHERE is_active = 1 ORDER BY created_at DESC`
        );
        return res.send(await utils.generateResponseObj({
            responseCode: "OK", responseMessage: "Success", responseData: rows
        }));
    } catch (err) {
        return res.status(400).send(await utils.throwCatchError(err));
    }
};
