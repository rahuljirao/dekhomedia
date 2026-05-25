const { Router } = require("express");
const AuthMiddleware = require("../../middleware/authMiddleware");
class StreamingRouter {
	constructor() {
		this.router = Router();
		this.getRouter();
		this.postRouter();
		this.putRouter();
		this.patchRouter();
		this.deleteRouter();
	}

	postRouter() {
		this.router.post("/get-video-url", AuthMiddleware.validateToken, (req, res, next) => {
			const GetVideoUrlController = require('./getVideoUrlController');
			GetVideoUrlController.getVideoUrl(req, res, next);
		});
	}

	getRouter() {
        // No AuthMiddleware here - these endpoints validate video tokens internally
        this.router.get("/play/:episodeId", (req, res, next) => {
			const StreamingController = require('./streamingController');
			StreamingController.serveMasterPlaylist(req, res, next);
		});
        this.router.get("/segment/:token/:episodeId/:segmentFile", (req, res, next) => {
			const StreamingController = require('./streamingController');
			StreamingController.serveSegment(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}

}
module.exports = new StreamingRouter().router;