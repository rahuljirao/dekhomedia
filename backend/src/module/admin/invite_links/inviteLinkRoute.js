const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");

class InviteLinkRouter {
    constructor() {
        this.router = Router();
        this.postRouter();
        this.getRouter();
    }

    postRouter() {
        this.router.post("/generate", AuthMiddleware.validateToken, (req, res, next) => {
            const generateInviteLinkController = require("./generateInviteLinkController");
            generateInviteLinkController.generateInviteLink(req, res, next);
        });
        this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
            const deleteInviteLinkController = require("./deleteInviteLinkController");
            deleteInviteLinkController.deleteInviteLink(req, res, next);
        });
    }

    getRouter() {
        this.router.get("/list", AuthMiddleware.validateToken, (req, res, next) => {
            const getInviteLinksController = require("./getInviteLinksController");
            getInviteLinksController.getInviteLinks(req, res, next);
        });
    }
}

module.exports = new InviteLinkRouter().router;
