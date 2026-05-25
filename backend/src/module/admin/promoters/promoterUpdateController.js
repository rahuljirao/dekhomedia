const { db } = require("../../../common/db");
const utils = require("../../../common/utils");

exports.update = async (req, res) => {
    const { id, name, custom_slug, allowed_content_type } = req.body;
    try {
        if (!id) return res.status(400).send(await utils.generateResponseObj({ responseCode: "ID_REQUIRED", responseMessage: "ID is required", responseData: {} }));
        await db.query(
            `UPDATE promoters SET name=?, custom_slug=?, allowed_content_type=? WHERE id=?`,
            [name, custom_slug, allowed_content_type || 'normal', id]
        );
        return res.send(await utils.generateResponseObj({ responseCode: "OK", responseMessage: "Updated successfully", responseData: {} }));
    } catch (err) {
        return res.status(400).send(await utils.throwCatchError(err));
    }
};
