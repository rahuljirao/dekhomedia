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
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getUsersDetailsController = require("./getUsersDetailsController");
			getUsersDetailsController.getUsersDetails(req, res, next);
		});
		this.router.post("/list", AuthMiddleware.validateToken, (req, res, next) => {
			const getUsersListController = require("./getUsersListController");
			getUsersListController.getUsersList(req, res, next);
		});
		this.router.post("/update-blocked", AuthMiddleware.validateToken, (req, res, next) => {
			const updateIsblockedUserController = require("./updateIsblockedUserController");
			updateIsblockedUserController.updateIsblockedUser(req, res, next);
		});
		this.router.post("/reward-history", AuthMiddleware.validateToken, (req, res, next) => {
			const getUsersRewardsListController = require("./getUsersRewardsListController");
			getUsersRewardsListController.getUsersRewardsList(req, res, next);
		});
		this.router.post("/coin-plan-history", AuthMiddleware.validateToken, (req, res, next) => {
			const getUsersCoinPlanListController = require("./getUsersCoinPlanListController");
			getUsersCoinPlanListController.getUsersCoinPlanList(req, res, next);
		});
		this.router.post("/vip-plan-history", AuthMiddleware.validateToken, (req, res, next) => {
			const getUsersVIPPlanListController = require("./getUsersVIPPlanListController");
			getUsersVIPPlanListController.getUsersVIPPlanList(req, res, next);
		});
	}

	getRouter() {}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new UserRouter().router;
