const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class TermsConditionRouter {
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
			const updateTermsConditionDetailsController = require("./updateTermsConditionDetailsController");
			updateTermsConditionDetailsController.updateTermsConditionDetails(req, res, next);
		});
	}

	getRouter() {
		this.router.get("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getTermsConditionDetailsController = require("./getTermsConditionDetailsController");
			getTermsConditionDetailsController.getTermsConditionDetails(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new TermsConditionRouter().router;
