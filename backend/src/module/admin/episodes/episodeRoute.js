const { Router } = require("express");
const fs = require("fs");
const multer = require('multer');
const path = require('path');
const ensureDir = (dir) => {
	if (!fs.existsSync(dir)) {
	  fs.mkdirSync(dir, { recursive: true });
	}
};
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let uploadPath = "uploads/episode/";
		ensureDir(uploadPath);
		cb(null, uploadPath); // Specify the directory for video files
	},
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
		cb(null, uniqueName); // Save file with a unique name
	}
});
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("video/")) {
			cb(null, true);
		} else {
			cb(new Error("Only video files (MP4, AVI, MOV, etc.) are allowed for cover video"), false);
		}
	},
	limits: { fileSize: 1024 * 1024 * 1024 } // Limit file size to 100MB
});
const AuthMiddleware = require("../../../middleware/authMiddleware");
class EpisodeRouter {
	constructor() {
		this.router = Router();
		this.getRouter();
		this.postRouter();
		this.putRouter();
		this.patchRouter();
		this.deleteRouter();
	}

	postRouter() {
		this.router.post("/add", AuthMiddleware.validateToken, upload.single('video_url'), (req, res, next) => {
			const addEpisodeController = require("./addEpisodeController");
			addEpisodeController.addEpisodes(req, res, next);
		});
		this.router.post("/add-multiple", AuthMiddleware.validateToken, upload.array('video_url'), (req, res, next) => {
			const addMultipleEpisodeController = require("./addMultipleEpisodeController");
			addMultipleEpisodeController.addEpisodes(req, res, next);
		});
		this.router.post("/add-urls", AuthMiddleware.validateToken, (req, res, next) => {
			const addEpisodeLinksController = require("./addEpisodeLinksController");
			addEpisodeLinksController.addEpisodeLinks(req, res, next);
		});
		this.router.post("/update", AuthMiddleware.validateToken, upload.single('video_url'), (req, res, next) => {
			const updateEpisodeController = require("./updateEpisodeController");
			updateEpisodeController.updateEpisodes(req, res, next);
		});
		this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteEpisodeController = require("./deleteEpisodeController");
			deleteEpisodeController.deleteEpisode(req, res, next);
		});
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getDetailsEpisodeController = require("./getDetailsEpisodeController");
			getDetailsEpisodeController.getDetailsEpisode(req, res, next);
		});
		this.router.post("/seriesWise", AuthMiddleware.validateToken, (req, res, next) => {
			const getEpisodeSeriesWiseController = require("./getEpisodeSeriesWiseController");
			getEpisodeSeriesWiseController.getSeriesEpisodes(req, res, next);
		});
	}
	getRouter(){
		this.router.get("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getEpisodeController = require("./getEpisodeController");
			getEpisodeController.getSeriesEpisodes(req, res, next);
		});
	}
	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new EpisodeRouter().router;
