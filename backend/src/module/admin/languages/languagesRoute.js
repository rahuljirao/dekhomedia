const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class LanguagesRouter {
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
			const addLanguagesController = require("./addLanguagesController");
			addLanguagesController.addLanguages(req, res, next);
		});
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updateLanguagesController = require("./updateLanguagesController");
			updateLanguagesController.updateLanguages(req, res, next);
		});
		this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteLanguagesController = require("./deleteLanguagesController");
			deleteLanguagesController.deleteLanguages(req, res, next);
		});
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getDetailsLanguagesController = require("./getDetailsLanguagesController");
			getDetailsLanguagesController.getDetailsLanguages(req, res, next);
		});
		this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getLanguagesController = require("./getLanguagesController");
			getLanguagesController.getLanguages(req, res, next);
		});
	}

	getRouter() {}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new LanguagesRouter().router;
