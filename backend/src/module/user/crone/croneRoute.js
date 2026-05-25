const { Router } = require("express");
class CroneRouter {
	constructor() {
		this.router = Router();
		this.getRouter();
		this.postRouter();
		this.putRouter();
		this.patchRouter();
		this.deleteRouter();
	}

	postRouter() {}

	getRouter() {
		this.router.get("/daily-check", (req, res, next) => {
			const dailyCheckController = require("./dailyCheckController");
			dailyCheckController.dailyCheck(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new CroneRouter().router;
