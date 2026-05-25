const { Router } = require("express");
const AuthMiddleware = require("../../middleware/authMiddleware");
const appDataRoute = require("../admin/app_data/appDataRoute");
const categoriesRoute = require("../admin/categories/categoriesRoute");
const languagesRoute = require("../admin/languages/languagesRoute");
const tagsRoute = require("../admin/tags/tagsRoute");
const typesRoute = require("../admin/types/typesRoute");
const paymentMethodsRoute = require("../admin/paymentMethods/paymentMethodsRoute");
const seriesRoute = require("../admin/series/seriesRoute");
const episodeRoute = require("../admin/episodes/episodeRoute");
const plansRouter = require("../admin/plans/plansRouter");
const socialLinksRoute = require("../admin/social_links/socialLinksRoute");
const aboutUsRoute = require("../admin/about_us/aboutUsRoute");
const termsConditionRoute = require("../admin/terms_and_conditions/termsConditionRoute");
const privacyPolicyRoute = require("../admin/privacy_and_policy/privacyPolicyRoute");
const siteDetailsRoute = require("../admin/site_details/siteDetailsRoute");
const usersRoute = require("../admin/users/usersRoute");
const adsSettingRoute = require("../admin/ads_setting/adsSettingRouter");
const orderHistoryRoute = require("./order_hostory/orderHistoryRoute");
const reportReasonRoute = require("./report_reason/reportReasonRoute");
const faqRoute = require("./faq/faqRoute");
const notificationRoute = require("./notification/notificationRoute");
const promotersRoute = require("../admin/promoters/promotersRoute");
const premiumVideosRoute = require("../admin/premium_videos/premiumVideosRoute"); // NEW
const multer = require("multer");
const fs = require("fs");
const path = require('path');

const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
const storage = multer.diskStorage({
    destination: (req, file, cb) => { let p = "uploads/profile/"; ensureDir(p); cb(null, p); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)); }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml','image/bmp','image/tiff'];
        if (!allowed.includes(file.mimetype)) return cb(new Error('Only image files allowed.'), false);
        cb(null, true);
    },
    limits: { fileSize: 100 * 1024 * 1024 }
});

class AdminRouter {
    constructor() {
        this.router = Router();
        this.setRouter();
        this.getRouter();
        this.postRouter();
        this.putRouter();
        this.patchRouter();
        this.deleteRouter();
    }

    setRouter() {
        this.router.use("/app-data", appDataRoute);
        this.router.use("/category", categoriesRoute);
        this.router.use("/language", languagesRoute);
        this.router.use("/tags", tagsRoute);
        this.router.use("/types", typesRoute);
        this.router.use("/payment-methods", paymentMethodsRoute);
        this.router.use("/series", seriesRoute);
        this.router.use("/episode", episodeRoute);
        this.router.use("/plans", plansRouter);
        this.router.use("/social-links", socialLinksRoute);
        this.router.use("/about-us", aboutUsRoute);
        this.router.use("/terms-condition", termsConditionRoute);
        this.router.use("/privacy-policy", privacyPolicyRoute);
        this.router.use("/site-details", siteDetailsRoute);
        this.router.use("/users", usersRoute);
        this.router.use("/ads", adsSettingRoute);
        this.router.use("/coin-order-history", orderHistoryRoute);
        this.router.use("/report-reason", reportReasonRoute);
        this.router.use("/faq", faqRoute);
        this.router.use("/notification", notificationRoute);
        this.router.use("/promoters", promotersRoute);
        this.router.use("/premium-videos", premiumVideosRoute); // NEW
    }

    postRouter() {
        this.router.post("/signin", (req, res, next) => { require("./signinController").signIn(req, res, next); });
        this.router.post("/forget-password", (req, res, next) => { require("./forgetPasswordController").forgetPassword(req, res, next); });
        this.router.post("/reset-password", (req, res, next) => { require("./resetPasswordController").resetPassword(req, res, next); });
        this.router.post("/update-profile", AuthMiddleware.validateToken, upload.single('profile_image'), (req, res, next) => { require("./updateProfileController").updateUserProfile(req, res, next); });
        this.router.post("/update-password", AuthMiddleware.validateToken, (req, res, next) => { require("./changePasswordController").changePassword(req, res, next); });
        this.router.post("/verify-token", (req, res, next) => { require("./verifyTokenController").verifyToken(req, res, next); });
    }

    getRouter() {
        this.router.get("/get-profile", AuthMiddleware.validateToken, (req, res, next) => { require("./getProfileController").getProfile(req, res, next); });
        this.router.get("/dashboard", AuthMiddleware.validateToken, (req, res, next) => { require("./getDashboardDetailsController").getDashboardDetails(req, res, next); });
    }

    patchRouter() {} putRouter() {} deleteRouter() {}
}

module.exports = new AdminRouter().router;
