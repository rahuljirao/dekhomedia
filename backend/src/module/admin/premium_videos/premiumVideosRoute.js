const { Router } = require("express");
const multer  = require("multer");
const fs      = require("fs");
const path    = require("path");
const AuthMiddleware = require("../../../middleware/authMiddleware");

// ── helpers ─────────────────────────────────────────────────────────────────
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
const uniqueName = (file) =>
    Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

// ── multer storage ───────────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const map = {
            thumbnail:   "uploads/thumbnails/",
            cover_video: "uploads/videos/",
            poster_image:"uploads/posters/",
        };
        const dest = map[file.fieldname] || "uploads/misc/";
        ensureDir(dest);
        cb(null, dest);
    },
    filename(req, file, cb) { cb(null, uniqueName(file)); }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "cover_video") {
        return file.mimetype.startsWith("video/")
            ? cb(null, true)
            : cb(new Error("Only video files allowed for cover_video"), false);
    }
    return file.mimetype.startsWith("image/")
        ? cb(null, true)
        : cb(new Error("Only image files allowed for thumbnail / poster_image"), false);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 500 * 1024 * 1024 }  // 500 MB
}).fields([
    { name: "thumbnail",    maxCount: 1 },
    { name: "cover_video",  maxCount: 1 },
    { name: "poster_image", maxCount: 1 },
]);

// ── router ───────────────────────────────────────────────────────────────────
class PremiumVideosRouter {
    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
    }

    getRoutes() {
        this.router.get("/list", AuthMiddleware.validateToken, (req, res, next) => {
            require("./pvListController").list(req, res, next);
        });
    }

    postRoutes() {
        this.router.post("/add", AuthMiddleware.validateToken, upload, (req, res, next) => {
            require("./pvAddController").add(req, res, next);
        });
        this.router.post("/update", AuthMiddleware.validateToken, upload, (req, res, next) => {
            require("./pvUpdateController").update(req, res, next);
        });
        this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
            require("./pvDeleteController").del(req, res, next);
        });
        this.router.post("/toggle-recommended", AuthMiddleware.validateToken, (req, res, next) => {
            require("./pvToggleController").toggleRecommended(req, res, next);
        });
        this.router.post("/toggle-active", AuthMiddleware.validateToken, (req, res, next) => {
            require("./pvToggleController").toggleActive(req, res, next);
        });
    }
}

module.exports = new PremiumVideosRouter().router;
