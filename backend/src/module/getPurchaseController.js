const { responsecodes } = require("../response-codes/lib");
const { db } = require("../common/db");
const { getDateTimeString } = require("../common/lib");
const utils = require("../common/utils");
const { getStatusText } = require("../response-codes/responseCode");
const constants = require("../common/constants");
const os = require('os');
function getServerIp() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
            if (config.family === 'IPv4' && !config.internal) {
                return config.address;
            }
        }
    }
    return '127.0.0.1'; // Fallback
}

class GetPurchaseController {

    static async getPurchase(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetPurchaseController.getPurchaseValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform update operation
            const getPurchaseResponse = await GetPurchaseController.getPurchaseOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getPurchaseResponse?.responseCode === "OK") {
                return context.send(getPurchaseResponse);
            } else {
                return context.status(400).send(getPurchaseResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getPurchaseOperation(data, corelationId, context, authorizer) {
        try {
            const ip = await getServerIp();
            console.log(ip, "ip")
            const [existing] = await db.query('SELECT * FROM licenses WHERE type = ? AND referer = ? AND ip = ?', [data?.type, data?.referer, ip]);
            if (existing.length === 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().LICENSE_NOT_VERIFIED,
                    responseMessage: getStatusText(responsecodes().LICENSE_NOT_VERIFIED),
                    responseData: {}
                });
            }
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: existing[0]
            });
        } catch (err) {
            console.log("err=============>", err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async getPurchaseValidator(req) {
        let errObj = {};
        if (!req?.referer) {
            errObj = {
                responseCode: responsecodes().REFERER_REQUIRED,
                responseMessage: getStatusText(responsecodes().REFERER_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.type) {
            errObj = {
                responseCode: responsecodes().ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().ID_REQUIRED),
                responseData: {}
            };
        } else if (!constants.TYPE.includes(req?.type)){
			return {
                responseCode: responsecodes().INVALID_TYPE,
                responseMessage: getStatusText(responsecodes().INVALID_TYPE),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = GetPurchaseController;
