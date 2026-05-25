const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class PrivacyPolicyRouter {
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
			const updatePrivacyPolicyDetailsController = require("./updatePrivacyPolicyDetailsController");
			updatePrivacyPolicyDetailsController.updatePrivacyPolicyDetails(req, res, next);
		});
	}

	getRouter() {
		this.router.get("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getPrivacyPolicyDetailsController = require("./getPrivacyPolicyDetailsController");
			getPrivacyPolicyDetailsController.getPrivacyPolicyDetails(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new PrivacyPolicyRouter().router;
