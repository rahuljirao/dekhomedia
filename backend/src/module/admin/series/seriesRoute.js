const { Router } = require("express");
const multer = require('multer');
const fs = require("fs");
const path = require('path');
const ensureDir = (dir) => {
	if (!fs.existsSync(dir)) {
	  fs.mkdirSync(dir, { recursive: true });
	}
};
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let uploadPath = "uploads/series/";
		if (file.fieldname === "thumbnail") {
			uploadPath = "uploads/series/images/";
		} else if (file.fieldname === "cover_video") {
			uploadPath = "uploads/series/cover_video/";
		} else if (file.fieldname === "poster") {
			uploadPath = "uploads/series/poster/";
		}
		ensureDir(uploadPath);
    	cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
		cb(null, uniqueName);
	}
});
const fileFilter = (req, file, cb) => {
	if (file.fieldname === "thumbnail") {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files (JPG, PNG, GIF) are allowed for thumbnail"), false);
		}
	} else if (file.fieldname === "cover_video") {
		if (file.mimetype.startsWith("video/")) {
			cb(null, true);
		} else {
			cb(new Error("Only video files (MP4, AVI, MOV, etc.) are allowed for cover video"), false);
		}
	} else if (file.fieldname === "poster") {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files (JPG, PNG, GIF) are allowed for thumbnail"), false);
		}
	} else {
	  cb(new Error("Invalid file field"), false);
	}
};
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 100 * 1024 * 1024 }
});
const uploadFields = upload.fields([
	{ name: "thumbnail", maxCount: 1 },
	{ name: "cover_video", maxCount: 1 },
	{ name: "poster", maxCount: 1 },
])
const AuthMiddleware = require("../../../middleware/authMiddleware");
class SeriesRouter {
	constructor() {
		this.router = Router();
		this.getRouter();
		this.postRouter();
		this.putRouter();
		this.patchRouter();
		this.deleteRouter();
	}

	postRouter() {
		this.router.post("/add", AuthMiddleware.validateToken, uploadFields, (req, res, next) => {
			const addSeriesController = require("./addSeriesController");
			addSeriesController.addSeries(req, res, next);
		});
		this.router.post("/update", AuthMiddleware.validateToken, uploadFields, (req, res, next) => {
			const updateSeriesController = require("./updateSeriesController");
			updateSeriesController.updateSeries(req, res, next);
		});
		this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteSeriesController = require("./deleteSeriesController");
			deleteSeriesController.deleteSeries(req, res, next);
		});
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getDetailsSeriesController = require("./getDetailsSeriesController");
			getDetailsSeriesController.getDetailsSeries(req, res, next);
		});
		this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getSeriesController = require("./getSeriesController");
			getSeriesController.getSeries(req, res, next);
		});
		this.router.post("/update-recommended", AuthMiddleware.validateToken, (req, res, next) => {
			const updateRecommandedSeriesController = require("./updateRecommandedSeriesController");
			updateRecommandedSeriesController.updateRecommandedSeries(req, res, next);
		});
		this.router.post("/update-active", AuthMiddleware.validateToken, (req, res, next) => {
			const updateActiveSeriesController = require("./updateActiveSeriesController");
			updateActiveSeriesController.updateActiveSeries(req, res, next);
		});
		this.router.post("/update-free", AuthMiddleware.validateToken, (req, res, next) => {
			const updateFreeSeriesController = require("./updateFreeSeriesController");
			updateFreeSeriesController.updateFreeSeries(req, res, next);
		});
	}
	getRouter(){}
	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new SeriesRouter().router;
