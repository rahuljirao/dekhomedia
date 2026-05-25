const { Router } = require("express");
const AuthMiddleware = require("../../middleware/authMiddleware");
const croneRoute = require("./crone/croneRoute");
const paymentRoute = require("./payments/paymentRoute");
const homeRoute = require("./home/homeRoute");
const seriesRoute = require("./series/seriesRoute");

class UserRouter {
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
		this.router.use("/crone", croneRoute);
		this.router.use("/payments", paymentRoute);
		this.router.use("/home", homeRoute);
		this.router.use("/series", seriesRoute);
	}

	postRouter() {
		this.router.post("/signup", (req, res, next) => {
			const signupController = require("./signupController");
			signupController.signup(req, res, next);
		});
		this.router.post("/signup-mobile", (req, res, next) => {
			const mobileSignupController = require("./mobileSignupController");
			mobileSignupController.mobileSignup(req, res, next);
		});
		// ─── NEW: Mobile number login ─────────────────────────────────────────
		this.router.post("/mobile-login", (req, res, next) => {
			const mobileLoginController = require("./mobileLoginController");
			mobileLoginController.mobileLogin(req, res, next);
		});
		// ─────────────────────────────────────────────────────────────────────
		this.router.post("/signin", (req, res, next) => {
			const SigninController = require("./signinController");
			SigninController.signin(req, res, next);
		});
		this.router.post("/daily-coin", AuthMiddleware.validateToken, (req, res, next) => {
			const DailyCoinController = require("./dailyCoinController");
			DailyCoinController.dailyCoin(req, res, next);
		});
		this.router.post("/auto-unlock-setting", AuthMiddleware.validateToken, (req, res, next) => {
			const updateSeriesAutoUnlockController = require("./updateSeriesAutoUnlockController");
			updateSeriesAutoUnlockController.updateSeriesAutoUnlock(req, res, next);
		});
		this.router.post("/update-reward", AuthMiddleware.validateToken, (req, res, next) => {
			const rewardCoinController = require("./rewardCoinController");
			rewardCoinController.rewardCoin(req, res, next);
		});
		this.router.post("/bind-email", AuthMiddleware.validateToken, (req, res, next) => {
			const bindEmailController = require("./bindEmailController");
			bindEmailController.bindEmail(req, res, next);
		});
		this.router.post("/picure-in-pucture", AuthMiddleware.validateToken, (req, res, next) => {
			const updatePictureInPictureSettingController = require("./updatePictureInPictureSettingController");
			updatePictureInPictureSettingController.updatePictureInPictureSetting(req, res, next);
		});
		this.router.post("/notification-allowed", AuthMiddleware.validateToken, (req, res, next) => {
			const updateNotificationSettingController = require("./updateNotificationSettingController");
			updateNotificationSettingController.updateNotificationSetting(req, res, next);
		});
		this.router.post("/delete-account", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteAccountController = require("./deleteAccountController");
			deleteAccountController.deleteAccount(req, res, next);
		});
		this.router.post("/delete-watch-history", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteWatchHistoryController = require("./deleteWatchHistoryController");
			deleteWatchHistoryController.deleteWatchHistory(req, res, next);
		});
		this.router.post("/delete-favourite-series", AuthMiddleware.validateToken, (req, res, next) => {
			const deleteFavouriteSeriesController = require("./deleteFavouriteSeriesController");
			deleteFavouriteSeriesController.deleteFavouriteSeries(req, res, next);
		});
		this.router.post("/verify-token", (req, res, next) => {
			const verifyTokenController = require("./verifyTokenController");
			verifyTokenController.verifyToken(req, res, next);
		});
		this.router.post("/verify-google-token", (req, res, next) => {
			const verifyGoogleTokenController = require("./verifyGoogleTokenController");
			verifyGoogleTokenController.verifyGoogleToken(req, res, next);
		});
		this.router.post("/verify-facebook-token", (req, res, next) => {
			const verifyFacebookTokenController = require("./verifyFacebookTokenController");
			verifyFacebookTokenController.verifyFacebookToken(req, res, next);
		});
		this.router.post("/create-ticket", (req, res, next) => {
			const createTicket = require("./createTicket");
			createTicket.createTicket(req, res, next);
		});
		this.router.post("/get-ticket", (req, res, next) => {
			const getMyTicketsController = require("./getMyTicketsController");
			getMyTicketsController.getMyTickets(req, res, next);
		});
		this.router.post("/ads-timer", AuthMiddleware.validateToken, (req, res, next) => {
			const adsTimer = require("./adsTimer");
			adsTimer.adsTimer(req, res, next);
		});
	}

	getRouter() {
		// ─── NEW: Promoter slug verification (public, no auth) ───────────────
		this.router.get("/promoter/verify", (req, res, next) => {
			const promoterVerifyController = require("./promoter/promoterVerifyController");
			promoterVerifyController.verifySlug(req, res, next);
		});
		// ─────────────────────────────────────────────────────────────────────
		this.router.get("/daily-check", AuthMiddleware.validateToken, (req, res, next) => {
			const dailyCheckController = require("./crone/dailyCheckController");
			dailyCheckController.dailyCheck(req, res, next);
		});
		this.router.get("/daily-watch-ads", AuthMiddleware.validateToken, (req, res, next) => {
			const dailyWatchAdsController = require("./dailyWatchAdsController");
			dailyWatchAdsController.dailyWatchAds(req, res, next);
		});
		this.router.get("/coin-data", AuthMiddleware.validateToken, (req, res, next) => {
			const coinDataController = require("./coinDataController");
			coinDataController.coinData(req, res, next);
		});
		this.router.get("/social-links", AuthMiddleware.validateToken, (req, res, next) => {
			const getSocialLinksDetailsController = require("./getSocialLinksDetailsController");
			getSocialLinksDetailsController.getSocialLinksDetails(req, res, next);
		});
		this.router.get("/daily-extra-ads", AuthMiddleware.validateToken, (req, res, next) => {
			const dailyExtraAdsController = require("./dailyExtraAdsController");
			dailyExtraAdsController.dailyExtraAds(req, res, next);
		});
		this.router.get("/plan-list", AuthMiddleware.validateToken, (req, res, next) => {
			const getPlansController = require("./getPlansController");
			getPlansController.getPlans(req, res, next);
		});
		this.router.get("/payment-getways-list", AuthMiddleware.validateToken, (req, res, next) => {
			const getPaymentGetwaysController = require("./getPaymentGetwaysController");
			getPaymentGetwaysController.getPaymentGetways(req, res, next);
		});
		this.router.get("/user-series-list", AuthMiddleware.validateToken, (req, res, next) => {
			const getUserSeriesListController = require("./getUserSeriesListController");
			getUserSeriesListController.getUserSeriesList(req, res, next);
		});
		this.router.get("/unlocked-episode-list", AuthMiddleware.validateToken, (req, res, next) => {
			const getUserUnlockedEpisodeListController = require("./getUserUnlockedEpisodeListController");
			getUserUnlockedEpisodeListController.getUserUnlockedEpisodeList(req, res, next);
		});
		this.router.get("/reward-history-list", AuthMiddleware.validateToken, (req, res, next) => {
			const getUserRewardHistoryListController = require("./getUserRewardHistoryListController");
			getUserRewardHistoryListController.getUserRewardHistoryList(req, res, next);
		});
		this.router.get("/ads", (req, res, next) => {
			const adsController = require("./adsController");
			adsController.getAdvertise(req, res, next);
		});
		this.router.get("/privacy-policy", AuthMiddleware.validateToken, (req, res, next) => {
			const getPrivacyPolicyController = require("./getPrivacyPolicyController");
			getPrivacyPolicyController.getPrivacyPolicy(req, res, next);
		});
		this.router.get("/terms-condition", AuthMiddleware.validateToken, (req, res, next) => {
			const getTermsConditionController = require("./getTermsConditionController");
			getTermsConditionController.getTermsCondition(req, res, next);
		});
		this.router.get("/about-us", AuthMiddleware.validateToken, (req, res, next) => {
			const getAboutUsController = require("./getAboutUsController");
			getAboutUsController.getAboutUs(req, res, next);
		});
		this.router.get("/coin-plan", AuthMiddleware.validateToken, (req, res, next) => {
			const getUsersCoinPlanListController = require("./getUsersCoinPlanListController");
			getUsersCoinPlanListController.getUsersCoinPlanList(req, res, next);
		});
		this.router.get("/vip-plan", AuthMiddleware.validateToken, (req, res, next) => {
			const getUsersVIPPlanListController = require("./getUsersVIPPlanListController");
			getUsersVIPPlanListController.getUsersVIPPlanList(req, res, next);
		});
		this.router.get("/reasons", AuthMiddleware.validateToken, (req, res, next) => {
			const getTicketReasonListController = require("./getTicketReasonListController");
			getTicketReasonListController.getTicketReasonList(req, res, next);
		});
		this.router.get("/faq-list", AuthMiddleware.validateToken, (req, res, next) => {
			const getFaqController = require("./getFaqController");
			getFaqController.getFaq(req, res, next);
		});
	}

	patchRouter() {}
	putRouter() {}
	deleteRouter() {}
}

module.exports = new UserRouter().router;
