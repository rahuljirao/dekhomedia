const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class FaqsRouter {
	constructor() {
		this.router = Router();
		this.getRouter();
		this.postRouter();
		this.putRouter();
		this.patchRouter();
		this.deleteRouter();
	}

	postRouter() {
		this.router.post("/add", AuthMiddleware.validateToken, (req, res, next) => {
			const addFAQController = require("./addFAQController");
			addFAQController.addFAQ(req, res, next);
		});
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updateFAQController = require("./updateFAQController");
			updateFAQController.updateFAQ(req, res, next);
		});
		this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteFAQController = require("./deleteFAQController");
			deleteFAQController.deleteFAQ(req, res, next);
		});
		this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getFAQController = require("./getFAQController");
			getFAQController.getFAQ(req, res, next);
		});
	}

	getRouter() {}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new FaqsRouter().router;
