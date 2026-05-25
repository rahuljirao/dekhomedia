const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class adsSettingRouter {
	constructor() {
		this.router = Router();
		this.getRouter();
		this.postRouter();
		this.putRouter();
		this.patchRouter();
		this.deleteRouter();
	}

	postRouter() {
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updateAdsPlatformController = require("./updateAdsPlatformController");
			updateAdsPlatformController.updateAdsPlatform(req, res, next);
		});
		this.router.post("/update-status", AuthMiddleware.validateToken, (req, res, next) => {
			const updateAdsPlatformStatusController = require("./updateAdsPlatformStatusController");
			updateAdsPlatformStatusController.updateAdsPlatformStatus(req, res, next);
		});
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getDetailsAdsPlatformController = require("./getDetailsAdsPlatformController");
			getDetailsAdsPlatformController.getDetailsAdsPlatform(req, res, next);
		});
	}

	getRouter() {
		this.router.get("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getAdsPlatformController = require("./getAdsPlatformController");
			getAdsPlatformController.getAdsPlatform(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new adsSettingRouter().router;
