const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require('path');
const ensureDir = (dir) => {
	if (!fs.existsSync(dir)) {
	  fs.mkdirSync(dir, { recursive: true });
	}
};
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let uploadPath = "uploads/site/";
		if (file.fieldname === "logo") {
			uploadPath = "uploads/site/logo/";
		} else if (file.fieldname === "favicon") {
			uploadPath = "uploads/site/favicon/";
		}
		ensureDir(uploadPath);
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
		cb(null, uniqueName);
	}
});
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'];
		if (!allowedImageMimeTypes.includes(file.mimetype)) {
			return cb(new Error('Invalid file type. Only Image files are allowed.'), false);
		}
		cb(null, true);
	},
	limits: { fileSize: 100 * 1024 * 1024 }
});
const uploadFields = upload.fields([
	{ name: "logo", maxCount: 1 },
	{ name: "favicon", maxCount: 1 },
])
class UserRouter {
	constructor() {
		this.router = Router();
		this.getRouter();
		this.postRouter();
		this.putRouter();
		this.patchRouter();
		this.deleteRouter();
	}

	postRouter() {
		this.router.post("/update", AuthMiddleware.validateToken, uploadFields, (req, res, next) => {
			const updateSiteDetailsController = require("./updateSiteDetailsController");
			updateSiteDetailsController.updateSiteDetails(req, res, next);
		});
	}

	getRouter() {
		this.router.get("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getSiteDetailsController = require("./getSiteDetailsController");
			getSiteDetailsController.getSiteDetails(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new UserRouter().router;
