const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class PlansRouter {
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
			const addPlansController = require("./addPlansController");
			addPlansController.addPlans(req, res, next);
		});	
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updatePlansController = require("./updatePlansController");
			updatePlansController.updatePlans(req, res, next);
		});
		this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
			const deletePlansController = require("./deletePlansController");
			deletePlansController.deletePlans(req, res, next);
		});
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getDetailsPlansController = require("./getDetailsPlansController");
			getDetailsPlansController.getDetailsPlans(req, res, next);
		});
		this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getPlansController = require("./getPlansController");
			getPlansController.getPlans(req, res, next);
		});
		this.router.post("/get-vip", AuthMiddleware.validateToken, (req, res, next) => {
			const getVIPPlansController = require("./getVIPPlansController");
			getVIPPlansController.getVIPPlans(req, res, next);
		});
		this.router.post("/update-status", AuthMiddleware.validateToken, (req, res, next) => {
			const updateIsActiveController = require("./updateIsActiveController");
			updateIsActiveController.updateIsActive(req, res, next);
		});
	}

	getRouter() {}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new PlansRouter().router;
