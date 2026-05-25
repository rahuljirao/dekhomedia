const { Router } = require("express");
const AuthMiddleware = require("../../../middleware/authMiddleware");

class PromotersRouter {
    constructor() {
        this.router = Router();
        this.getRouter();
        this.postRouter();
    }

    getRouter() {
        this.router.get("/list", AuthMiddleware.validateToken, (req, res, next) => {
            const c = require("./promoterListController");
            c.list(req, res, next);
        });
    }

    postRouter() {
        this.router.post("/add", AuthMiddleware.validateToken, (req, res, next) => {
            const c = require("./promoterAddController");
            c.add(req, res, next);
        });
        this.router.post("/update", AuthMiddleware.validateToken, (req, res, next) => {
            const c = require("./promoterUpdateController");
            c.update(req, res, next);
        });
        this.router.post("/delete", AuthMiddleware.validateToken, (req, res, next) => {
            const c = require("./promoterDeleteController");
            c.delete(req, res, next);
        });
    }
}

module.exports = new PromotersRouter().router;
