const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class CategoriesRouter {
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
			const addCategoriesController = require("./addCategoriesController");
			addCategoriesController.addCategories(req, res, next);
		});
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updateCategoriesController = require("./updateCategoriesController");
			updateCategoriesController.updateCategories(req, res, next);
		});
		this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteCategoriesController = require("./deleteCategoriesController");
			deleteCategoriesController.deleteCategories(req, res, next);
		});
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getDetailsCategoriesController = require("./getDetailsCategoriesController");
			getDetailsCategoriesController.getDetailsCategories(req, res, next);
		});
		this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getCategoriesController = require("./getCategoriesController");
			getCategoriesController.getCategories(req, res, next);
		});
	}

	getRouter() {}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new CategoriesRouter().router;
