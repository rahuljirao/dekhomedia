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
		this.router.post("/create", AuthMiddleware.validateToken, (req, res, next) => {
			const createTransactionController = require("./createTransactionController");
			createTransactionController.createTransaction(req, res, next);
		});
		this.router.post("/create-payment-intent", AuthMiddleware.validateToken, (req, res, next) => {
			const createStripePaymentIntentController = require("./createStripePaymentIntentController");
			createStripePaymentIntentController.createStripePaymentIntent(req, res, next);
		});
		this.router.post("/create-order", AuthMiddleware.validateToken, (req, res, next) => {
			const createRazorpayOrderController = require("./createRazorpayOrderController");
			createRazorpayOrderController.createRazorpayOrder(req, res, next);
		});
		this.router.post("/verify-payment", AuthMiddleware.validateToken, (req, res, next) => {
			const verifyRazorpayPaymentController = require("./verifyRazorpayPaymentController");
			verifyRazorpayPaymentController.verifyRazorpayPayment(req, res, next);
		});
		this.router.post("/verify-googleplay-payment", AuthMiddleware.validateToken, (req, res, next) => {
			const verifyGooglePlayPurchasePaymentController = require("./verifyGooglePlayPurchasePaymentController");
			verifyGooglePlayPurchasePaymentController.verifyGooglePlayPurchasePayment(req, res, next);
		});
		this.router.post("/retrive-payment", AuthMiddleware.validateToken, (req, res, next) => {
			const retriveStripePaymentController = require("./retriveStripePaymentController");
			retriveStripePaymentController.retriveStripePayment(req, res, next);
		});
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updateTransactionController = require("./updateTransactionController");
			updateTransactionController.updateTransaction(req, res, next);
		});
	}

	getRouter() {
		this.router.get("/transaction-list", AuthMiddleware.validateToken, (req, res, next) => {
			const getTransactionController = require("./getTransactionController");
			getTransactionController.getTransactions(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new UserRouter().router;
