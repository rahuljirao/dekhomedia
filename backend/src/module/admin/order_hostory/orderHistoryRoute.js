const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class OrderHistoryRoute {
    constructor() {
        this.router = Router();
        this.getRouter();
        this.postRouter();
        this.putRouter();
        this.patchRouter();
        this.deleteRouter();
    }

    postRouter() {
        this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
            const getCoinPlansPurchaseHistoryController = require("./getCoinPlansPurchaseHistoryController");
            getCoinPlansPurchaseHistoryController.getCoinPlansPurchaseHistoryList(req, res, next);
        });
        this.router.post("/get-vip", AuthMiddleware.validateToken, (req, res, next) => {
            const getVIPPlansPurchaseHistoryController = require("./getVIPPlansPurchaseHistoryController");
            getVIPPlansPurchaseHistoryController.getVIPPlansPurchaseHistoryList(req, res, next);
        });
    }

    getRouter() {}

    patchRouter() {}
    putRouter() {}
    deleteRouter() {}

}
module.exports = new OrderHistoryRoute().router;
