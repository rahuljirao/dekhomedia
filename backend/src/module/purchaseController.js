const os = require('os');
const { responsecodes } = require("../response-codes/lib");
const { db } = require("../common/db");
const { getDateTimeString } = require("../common/lib");
const utils = require("../common/utils");
const { getStatusText } = require("../response-codes/responseCode");
const constants = require("../common/constants");
const axios = require('axios')
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
class PurchaseController {

    static async purchase(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await PurchaseController.purchaseValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform update operation
            const purchaseResponse = await PurchaseController.purchaseOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (purchaseResponse?.responseCode === "OK") {
                return context.send(purchaseResponse);
            } else {
                return context.status(400).send(purchaseResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async purchaseOperation(data, corelationId, context, authorizer) {
        try {
            const [existing] = await db.query('SELECT * FROM licenses WHERE purchase_code = ? AND type = ?', [data?.code, data?.type]);
            if (existing.length > 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().LICENSE_ALREADY_VERIFIED,
                    responseMessage: getStatusText(responsecodes().LICENSE_ALREADY_VERIFIED),
                    responseData: existing[0]
                });
            }

            const ip = await getServerIp();
            const envatoRes = await axios.get(`https://api.envato.com/v3/market/author/sale?code=${data?.code}`, {
                headers: {
                    Authorization: `Bearer ${constants.ENVATO_TOKEN}`,
                    'User-Agent': 'MyLicenseAPI'
                }
            });
        
            const envatoData = envatoRes.data;

            const query = 'INSERT into licenses (purchase_code, username, item_id, ip, referer, install_path, type) values (?, ?, ?, ?, ?, ?, ?)';
            const values = [
                data?.code,
                data?.username,
                envatoData?.item?.id,
                ip,
                data?.referer,
                data?.installPath,
                data?.type,
            ];
            const [result] = await db.query(query, values);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {},
                // responseData: {
                //     item_name: envatoData?.item.name,
                //     buyer: envatoData?.buyer,
                //     license: envatoData?.license,
                //     support_until: envatoData?.supported_until
                // }
            });
        } catch (err) {
            console.log("err=============>", err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async purchaseValidator(req) {
        let errObj = {};
        if (!req?.username) {
            errObj = {
                responseCode: responsecodes().USERNAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().USERNAME_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.code) {
            errObj = {
                responseCode: responsecodes().CODE_REQUIRED,
                responseMessage: getStatusText(responsecodes().CODE_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.id) {
            errObj = {
                responseCode: responsecodes().ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().ID_REQUIRED),
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

module.exports = PurchaseController;
