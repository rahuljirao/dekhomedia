const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class TagesRouter {
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
			const addTagesController = require("./addTagesController");
			addTagesController.addTages(req, res, next);
		});
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updateTagesController = require("./updateTagesController");
			updateTagesController.updateTages(req, res, next);
		});
		this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteTagesController = require("./deleteTagesController");
			deleteTagesController.deleteTages(req, res, next);
		});
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getDetailsTagsController = require("./getDetailsTagsController");
			getDetailsTagsController.getDetailsTags(req, res, next);
		});
		this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getTagesController = require("./getTagesController");
			getTagesController.getTages(req, res, next);
		});
	}

	getRouter() {}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new TagesRouter().router;
