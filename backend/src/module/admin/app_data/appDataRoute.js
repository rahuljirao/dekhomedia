const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
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
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updateAppDataDetailsController = require("./updateAppDataDetailsController");
			updateAppDataDetailsController.updateAppDataDetails(req, res, next);
		});
		this.router.post("/update-currency", AuthMiddleware.validateToken, (req, res, next) => {
			const updateAppDataCurrencyDetailsController = require("./updateAppDataCurrencyDetailsController");
			updateAppDataCurrencyDetailsController.updateAppDataCurrencyDetails(req, res, next);
		});
	}

	getRouter() {
		this.router.get("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getAppDataDetailsController = require("./getAppDataDetailsController");
			getAppDataDetailsController.getAppDataDetails(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new UserRouter().router;
