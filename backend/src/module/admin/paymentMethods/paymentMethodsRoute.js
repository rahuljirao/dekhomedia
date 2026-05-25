const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class PaymentMethodsRouter {
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
			const addPaymentMethodController = require("./addPaymentMethodController");
			addPaymentMethodController.addPaymentMethod(req, res, next);
		});	
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updatePaymentMethodController = require("./updatePaymentMethodController");
			updatePaymentMethodController.updatePaymentMethod(req, res, next);
		});
		this.router.post("/update-status", AuthMiddleware.validateToken, (req, res, next) => {
			const updatePaymentMethodStatusController = require("./updatePaymentMethodStatusController");
			updatePaymentMethodStatusController.updatePaymentMethodStatus(req, res, next);
		});
		this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
			const deletePaymentMethodController = require("./deletePaymentMethodController");
			deletePaymentMethodController.deletePaymentMethod(req, res, next);
		});
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getDetailsPaymentMethodController = require("./getDetailsPaymentMethodController");
			getDetailsPaymentMethodController.getDetailsPaymentMethod(req, res, next);
		});
		this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getPaymentMethodController = require("./getPaymentMethodController");
			getPaymentMethodController.getPaymentMethod(req, res, next);
		});
	}

	getRouter() {}
	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new PaymentMethodsRouter().router;
