const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class SocialLinksRoute {
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
			const updateSocialLinksDetailsController = require("./updateSocialLinksDetailsController");
			updateSocialLinksDetailsController.updateSocialLinksDetails(req, res, next);
		});
	}

	getRouter() {
		this.router.get("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getSocialLinksDetailsController = require("./getSocialLinksDetailsController");
			getSocialLinksDetailsController.getSocialLinksDetails(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new SocialLinksRoute().router;
