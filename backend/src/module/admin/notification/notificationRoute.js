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
		let uploadPath = "uploads/types/";
		ensureDir(uploadPath);
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
		cb(null, uniqueName); // Save file with a unique name
	}
});
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'];
		if (!allowedImageMimeTypes.includes(file.mimetype)) {
			return cb(new Error('Invalid file type. Only video files are allowed.'), false);
		}
		cb(null, true);
	},
	limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 100MB
});
const AuthMiddleware = require("../../../middleware/authMiddleware");
class NotificationRouter {
	constructor() {
		this.router = Router();
		this.getRouter();
		this.postRouter();
		this.putRouter();
		this.patchRouter();
		this.deleteRouter();
	}

	postRouter() {
		// this.router.post("/add", AuthMiddleware.validateToken, upload.single('image'), (req, res, next) => {
		// 	const addNotificationController = require("./addNotificationController");
		// 	addNotificationController.addNotification(req, res, next);
		// });
		// this.router.post("/update", AuthMiddleware.validateToken, upload.single('image'), (req, res, next) => {
		// 	const updateNotificationController = require("./updateNotificationController");
		// 	updateNotificationController.updateNotification(req, res, next);
		// });
		// this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
		// 	const deleteNotificationController = require("./deleteNotificationController");
		// 	deleteNotificationController.deleteNotification(req, res, next);
		// });
		// this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
		// 	const getDetailsNotificationController = require("./getDetailsNotificationController");
		// 	getDetailsNotificationController.getDetailsNotification(req, res, next);
		// });
		// this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
		// 	const getNotificationController = require("./getNotificationController");
		// 	getNotificationController.getNotification(req, res, next);
		// });
		this.router.post("/send", AuthMiddleware.validateToken, upload.single('image'), (req, res, next) => {
			const sendNotificationController = require("./sendNotificationController");
			sendNotificationController.sendNotification(req, res, next);
		});
	}

	getRouter() {}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new NotificationRouter().router;
