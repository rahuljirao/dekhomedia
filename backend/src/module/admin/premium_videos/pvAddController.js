const { db }    = require("../../../common/db");
const utils     = require("../../../common/utils");

// Build full URL from relative path
const toUrl = (filename, folder) =>
    filename ? `${process.env.BASE_URL}${folder}/${filename}` : null;

exports.add = async (req, res) => {
    try {
        const b = req.body;
        const f = req.files || {};

        // Required
        if (!b.title?.trim()) {
            return res.status(400).send(await utils.generateResponseObj({
                responseCode: "TITLE_REQUIRED",
                responseMessage: "Title is required",
                responseData: {}
            }));
        }

        const thumbnail_url    = f.thumbnail?.[0]
            ? toUrl(f.thumbnail[0].filename, "uploads/thumbnails")
            : b.thumbnail_url || null;

        const cover_video_url  = f.cover_video?.[0]
            ? toUrl(f.cover_video[0].filename, "uploads/videos")
            : b.cover_video_url || null;

        const poster_image_url = f.poster_image?.[0]
            ? toUrl(f.poster_image[0].filename, "uploads/posters")
            : b.poster_image_url || null;

        const [result] = await db.query(
            `INSERT INTO premium_videos
             (title, description, category, tags, is_recommended, content_type,
              thumbnail_url, poster_image_url, cover_video_url, external_link, is_ad_enabled)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                b.title.trim(),
                b.description   || null,
                b.category      || null,
                b.tags          || null,
                b.is_recommended == "1" ? 1 : 0,
                ["normal","premium"].includes(b.content_type) ? b.content_type : "normal",
                thumbnail_url,
                poster_image_url,
                cover_video_url,
                b.external_link || null,
                b.is_ad_enabled == "0" ? 0 : 1,
            ]
        );

        const [[row]] = await db.query(
            `SELECT * FROM premium_videos WHERE id = ?`, [result.insertId]
        );

        return res.send(await utils.generateResponseObj({
            responseCode: "OK",
            responseMessage: "Video added successfully",
            responseData: row
        }));
    } catch (err) {
        console.error("pvAdd:", err);
        return res.status(400).send(await utils.throwCatchError(err));
    }
};
