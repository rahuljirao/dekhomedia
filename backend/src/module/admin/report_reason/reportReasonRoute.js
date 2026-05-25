const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class ReportReasonRouter {
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
			const addReportReasonController = require("./addReportReasonController");
			addReportReasonController.addReportReason(req, res, next);
		});
		this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
			const updateReportReasonController = require("./updateReportReasonController");
			updateReportReasonController.updateReportReason(req, res, next);
		});
		this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteReportReasonController = require("./deleteReportReasonController");
			deleteReportReasonController.deleteReportReason(req, res, next);
		});
		this.router.post("/details", AuthMiddleware.validateToken, (req, res, next) => {
			const getDetailsReportReasonController = require("./getDetailsReportReasonController");
			getDetailsReportReasonController.getDetailsReportReason(req, res, next);
		});
		this.router.post("/get", AuthMiddleware.validateToken, (req, res, next) => {
			const getReportReasonController = require("./getReportReasonController");
			getReportReasonController.getReportReason(req, res, next);
		});
		this.router.post("/get-tickets", AuthMiddleware.validateToken, (req, res, next) => {
			const getUsersTicketsController = require("./getUsersTicketsController");
			getUsersTicketsController.getUsersTickets(req, res, next);
		});
		this.router.post("/update-ticket-status", AuthMiddleware.validateToken, (req, res, next) => {
			const updateTicketStatusController = require("./updateTicketStatusController");
			updateTicketStatusController.updateTicketStatus(req, res, next);
		});
	}

	getRouter() {}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new ReportReasonRouter().router;
