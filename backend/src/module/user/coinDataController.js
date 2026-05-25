const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const constants = require("../../common/constants");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const { generateToken } = require('../../middleware/tokenLib');
class coinDataController {

    static async coinData(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Perform add operation
            const updateCoinResponse = await coinDataController.coinDataOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateCoinResponse?.responseCode === "OK") {
                return context.send(updateCoinResponse);
            } else {
                return context.status(400).send(updateCoinResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async coinDataOperation(req, corelationId, context, authorizer) {
        try {
			const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            const [app_data] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);

            const now = new Date();

            // Create a new Date for today at 23:59:59.999
            const endOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23, 59, 59, 999
            );

            // Get the difference in milliseconds
            let diffMs = endOfDay - now;

            // Convert to readable format
            const pad = (n) => String(n).padStart(2, '0');
            const totalSeconds = Math.floor(diffMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            app_data[0].reset_ads_time = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
            app_data[0].daily_watched_ads = rows[0]?.daily_watched_ads ?? 0;
            
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: app_data
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = coinDataController;