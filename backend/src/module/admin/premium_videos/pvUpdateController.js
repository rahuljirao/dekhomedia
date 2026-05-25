const { db }    = require("../../../common/db");
const utils     = require("../../../common/utils");
const fs        = require("fs");
const path      = require("path");

const toUrl = (filename, folder) =>
    filename ? `${process.env.BASE_URL}${folder}/${filename}` : null;

// Delete old local file safely
const deleteLocal = (urlStr) => {
    if (!urlStr) return;
    try {
        const rel = urlStr.replace(process.env.BASE_URL, "");
        const abs = path.join(__dirname, "../../../../", rel);
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
    } catch (_) {}
};

exports.update = async (req, res) => {
    try {
        const b = req.body;
        const f = req.files || {};

        if (!b.id) return res.status(400).send(await utils.generateResponseObj({ responseCode: "ID_REQUIRED", responseMessage: "ID required", responseData: {} }));
        if (!b.title?.trim()) return res.status(400).send(await utils.generateResponseObj({ responseCode: "TITLE_REQUIRED", responseMessage: "Title required", responseData: {} }));

        const [[existing]] = await db.query(`SELECT * FROM premium_videos WHERE id = ? AND is_deleted = 0`, [b.id]);
        if (!existing) return res.status(404).send(await utils.generateResponseObj({ responseCode: "NOT_FOUND", responseMessage: "Video not found", responseData: {} }));

        // Resolve new or keep old
        let thumbnail_url    = existing.thumbnail_url;
        let cover_video_url  = existing.cover_video_url;
        let poster_image_url = existing.poster_image_url;

        if (f.thumbnail?.[0]) {
            deleteLocal(existing.thumbnail_url);
            thumbnail_url = toUrl(f.thumbnail[0].filename, "uploads/thumbnails");
        } else if (b.thumbnail_url !== undefined) {
            thumbnail_url = b.thumbnail_url || null;
        }

        if (f.cover_video?.[0]) {
            deleteLocal(existing.cover_video_url);
            cover_video_url = toUrl(f.cover_video[0].filename, "uploads/videos");
        } else if (b.cover_video_url !== undefined) {
            cover_video_url = b.cover_video_url || null;
        }

        if (f.poster_image?.[0]) {
            deleteLocal(existing.poster_image_url);
            poster_image_url = toUrl(f.poster_image[0].filename, "uploads/posters");
        } else if (b.poster_image_url !== undefined) {
            poster_image_url = b.poster_image_url || null;
        }

        await db.query(
            `UPDATE premium_videos SET
                title = ?, description = ?, category = ?, tags = ?,
                is_recommended = ?, content_type = ?,
                thumbnail_url = ?, poster_image_url = ?, cover_video_url = ?,
                external_link = ?, is_ad_enabled = ?
             WHERE id = ?`,
            [
                b.title.trim(),
                b.description   || null,
                b.category      || null,
                b.tags          || null,
                b.is_recommended == "1" ? 1 : 0,
                ["normal","premium"].includes(b.content_type) ? b.content_type : existing.content_type,
                thumbnail_url,
                poster_image_url,
                cover_video_url,
                b.external_link || null,
                b.is_ad_enabled == "0" ? 0 : 1,
                b.id
            ]
        );

        const [[row]] = await db.query(`SELECT * FROM premium_videos WHERE id = ?`, [b.id]);
        return res.send(await utils.generateResponseObj({ responseCode: "OK", responseMessage: "Updated successfully", responseData: row }));
    } catch (err) {
        console.error("pvUpdate:", err);
        return res.status(400).send(await utils.throwCatchError(err));
    }
};
