const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class AddPlansController {

    static async addPlans(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AddPlansController.addPlansValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addPlansResponse = await AddPlansController.addPlansOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (addPlansResponse?.responseCode === "OK") {
                return context.send(addPlansResponse);
            } else {
                return context.status(400).send(addPlansResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addPlansOperation(req, corelationId, context, authorizer) {
        try {
            const query = `INSERT INTO plans (name, google_play_id, is_unlimited, is_weekly, is_monthly, is_yearly, coin, extra_coin, amount, discount_percentage, is_limited_time, month_days, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                req?.name?.trim() ? req.name : null,
                req?.google_play_id?.trim() ? req.google_play_id : null,
                req?.is_unlimited,
                req?.is_weekly,
                req?.is_monthly,
                req?.is_yearly,
                req?.coin ? req.coin : null,
                req?.extra_coin ? req.extra_coin : null,
                req?.amount,
                req?.discount_percentage ? req.discount_percentage : null,
                req?.is_limited_time,
                req?.month_days,
                req?.description?.trim() ? req.description : null
            ];
            const [result] = await db.query(query, values);
            const [rows] = await db.query('SELECT * FROM plans WHERE id = ?', [result?.insertId]);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: rows[0]
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addPlansValidator(req) {
        let errObj = {};
        if (!req?.amount) {
            return {
                responseCode: responsecodes().AMOUNT_REQUIRED,
                responseMessage: getStatusText(responsecodes().AMOUNT_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = AddPlansController;
