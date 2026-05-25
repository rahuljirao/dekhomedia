const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");
class SeriesRouter {
	constructor() {
		this.router = Router();
		this.getRouter();
		this.postRouter();
		this.putRouter();
		this.patchRouter();
		this.deleteRouter();
	}

	postRouter() {
		this.router.post("/watch-episode", AuthMiddleware.validateToken, (req, res, next) => {
			const watchEpisodeController = require("./watchEpisodeController");
			watchEpisodeController.watchEpisode(req, res, next);
		});
		this.router.post("/unlock-episode", AuthMiddleware.validateToken, (req, res, next) => {
			const unlockEpisodeController = require("./unlockEpisodeController");
			unlockEpisodeController.unlockEpisode(req, res, next);
		});
		this.router.post("/like-episode", AuthMiddleware.validateToken, (req, res, next) => {
			const likeDislikeEpisodeController = require("./likeDislikeEpisodeController");
			likeDislikeEpisodeController.likeDislikeEpisode(req, res, next);
		});
		this.router.post("/favourite-episode", AuthMiddleware.validateToken, (req, res, next) => {
			const addUpdateFavouriteEpisodeController = require("./addUpdateFavouriteEpisodeController");
			addUpdateFavouriteEpisodeController.addUpdateFavouriteEpisode(req, res, next);
		});
		this.router.post("/episode-list", AuthMiddleware.validateToken, (req, res, next) => {
			const getEpisodeListController = require("./getEpisodeListController");
			getEpisodeListController.getEpisodeList(req, res, next);
		});
		this.router.post("/all-episode-list", AuthMiddleware.validateToken, (req, res, next) => {
			const getAllEpisodeListController = require("./getAllEpisodeListController");
			getAllEpisodeListController.getAllEpisodeList(req, res, next);
		});
	}
	getRouter() {}
	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new SeriesRouter().router;
