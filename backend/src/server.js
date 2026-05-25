const express = require("express");
const cors = require("cors");
const path = require('path');
const helmet = require("helmet");
const { v4: uuidv4 } = require('uuid');
const dotenv = require("dotenv");
const samLib = require("../src/response-codes/lib");
const adminRoute = require("./module/admin/adminRoute");
const userRoute = require("./module/user/userRoute");
const streamingRoute = require("./module/streaming/streamingRoute");

class Server {
  constructor() {
    this.app = express();
    this.router = express.Router();
    this.setConfiguration();
    this.setRouter();
    this.error404Handler();
    this.errorHandler();
  }

  setConfiguration() {
    this.setBodyParser();
    this.setCors();
    this.setHelmet();
  }

  setBodyParser() {
    this.app.use(express.json({ limit: '1024mb' }));
    this.app.use(express.urlencoded({ limit: '1024mb', extended: true }));
  }

  setHelmet() {
    this.app.use(helmet());
  }

  setCors() {
    const corsOptions = {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      optionsSuccessStatus: 204,
    };

    this.app.use(cors(corsOptions));
  }

  setRouter() {
    this.app.use('/uploads', express.static('uploads', {
      setHeaders: (res, path) => {
        res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // Fix for favicon
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      },
    }));
    this.app.use((req, res, next) => {
      req.requestId = req.headers['x-request-id'] || uuidv4();
      res.setHeader('X-Request-Id', req.requestId);  // Optional: include requestId in response headers
      next();
    });
    this.app.use("/admin/v1", adminRoute);
    this.app.use("/user/v1", userRoute);
    this.app.use("/stream", streamingRoute);
    this.router.get("/details", (req, res, next) => {
      const getSiteDataController = require("./module/admin/site_details/getSiteDataController");
      getSiteDataController.getSiteDetails(req, res, next);
    });
    this.router.post("/v1/license/verify", (req, res, next) => {
      const getPurchaseController = require("./module/getPurchaseController");
      getPurchaseController.getPurchase(req, res, next);
    });
    this.router.post("/v1/license", (req, res, next) => {
      const purchaseController = require("./module/purchaseController");
      purchaseController.purchase(req, res, next);
    });
    this.app.use("/", this.router);
    this.app.use(cors());
  }

  // The error handler must be registered before any other error middleware and after all controllers

  error404Handler() {
    this.app.use((req, res, next) => {
      res.status(404).json({ status: 404, message: "pages not found" });
    });
  }

  errorHandler() {
    this.app.use((error, req, res, next) => {
      const errorStatus = 400 || 500;
      res.set("Access-Control-Allow-Origin", "*");
      if (error.message && parseInt(error.message) > 0 && !error.message.includes(",")) {
        let errorStatement = {
            responseId: req.body.requestHeader?.requestId,
            responseCode: error.message,
            responseMessage: samLib.responsecodes().getStatusText(error.message),
            responseMessageList: [],
        };
        res.status(errorStatus).json(errorStatement);
      } else if (error?.message && error.message.includes(",")) {
        const errorMessageParts = error.message.split(",");
        var result = [];
        errorMessageParts.forEach((part) => {
          result.push(samLib.responsecodes().getStatusText(part.trim()));
        });
        let errorStatement = {
            responseCode: samLib.responsecodes().INVALID_REQUEST,
            responseMessage: samLib.responsecodes().getStatusText(samLib.responsecodes().INVALID_REQUEST),
            responseMessageList: result,
        };
        res.status(errorStatus).json(errorStatement);
      } else {
        const errorMessage = error.message || error || error.NotAuthorizedException || "Something Went Wrong Plz Try Again";
        let errorStatement = {
            responseCode: errorStatus,
            responseMessage: errorMessage,
            responseMessageList: [],
        };
        res.status(errorStatus).json(errorStatement);
      }
    });
  }
}


module.exports = new Server().app;

