const { db } = require("../../../common/db");
const utils = require("../../../common/utils");

exports.add = async (req, res) => {
    const { name, custom_slug, allowed_content_type } = req.body;
    try {
        if (!name || !custom_slug) {
            return res.status(400).send(await utils.generateResponseObj({
                responseCode: "VALIDATION_ERROR", responseMessage: "Name and slug are required", responseData: {}
            }));
        }
        // Check slug uniqueness
        const [existing] = await db.query(`SELECT id FROM promoters WHERE custom_slug = ?`, [custom_slug]);
        if (existing.length > 0) {
            return res.status(400).send(await utils.generateResponseObj({
                responseCode: "DUPLICATE_SLUG", responseMessage: "This slug already exists", responseData: {}
            }));
        }
        const [result] = await db.query(
            `INSERT INTO promoters (name, custom_slug, allowed_content_type) VALUES (?, ?, ?)`,
            [name, custom_slug, allowed_content_type || 'normal']
        );
        const [[row]] = await db.query(`SELECT * FROM promoters WHERE id = ?`, [result.insertId]);
        return res.send(await utils.generateResponseObj({
            responseCode: "OK", responseMessage: "Promoter added successfully", responseData: row
        }));
    } catch (err) {
        return res.status(400).send(await utils.throwCatchError(err));
    }
};
