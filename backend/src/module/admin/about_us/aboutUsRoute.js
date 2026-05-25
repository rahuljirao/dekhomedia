const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class AboutUsRouter {
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
			const updateAboutUsDetailsController = require("./updateAboutUsDetailsController");
			updateAboutUsDetailsController.updateAboutUsDetails(req, res, next);
		});
	}

	getRouter() {
		this.router.get("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getAboutUsDetailsController = require("./getAboutUsDetailsController");
			getAboutUsDetailsController.getAboutUsDetails(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new AboutUsRouter().router;
