const { db }  = require("../../../common/db");
const utils   = require("../../../common/utils");

exports.list = async (req, res) => {
    try {
        const search      = req.query.search || "";
        const contentType = req.query.content_type || "";          // filter
        const page        = Math.max(1, parseInt(req.query.page) || 1);
        const limit       = Math.min(100, parseInt(req.query.limit) || 20);
        const offset      = (page - 1) * limit;

        let where = "WHERE is_deleted = 0";
        const params = [];

        if (search.trim()) {
            where += " AND (title LIKE ? OR category LIKE ? OR tags LIKE ?)";
            const s = `%${search.trim()}%`;
            params.push(s, s, s);
        }
        if (["normal","premium"].includes(contentType)) {
            where += " AND content_type = ?";
            params.push(contentType);
        }

        const [[{ total }]] = await db.query(
            `SELECT COUNT(*) AS total FROM premium_videos ${where}`, params
        );

        const [rows] = await db.query(
            `SELECT * FROM premium_videos ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        return res.send(await utils.generateResponseObj({
            responseCode: "OK",
            responseMessage: "Success",
            responseData: { data: rows, total, page, limit }
        }));
    } catch (err) {
        return res.status(400).send(await utils.throwCatchError(err));
    }
};
