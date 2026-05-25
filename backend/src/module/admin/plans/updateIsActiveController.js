const fs = require("fs");
const path = require("path");
const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateIsActiveController {

    static async updateIsActive(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateIsActiveController.updateIsActiveValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateIsActive = await UpdateIsActiveController.updateIsActiveOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateIsActive?.responseCode === "OK") {
                return context.send(updateIsActive);
            } else {
                return context.status(400).send(updateIsActive);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateIsActiveOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM plans WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_PLAN,
                    responseMessage: getStatusText(responsecodes().INVALID_PLAN),
                    responseData: {}
                });
            }
            let planData = rows[0];
            const query = `UPDATE plans SET is_active = ? WHERE id = ?`;
            const values = [
                req?.is_active,
                req?.id
            ];
            const [result] = await db.query(query, values);
            planData.is_active = req?.is_active;
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: planData
            });

            
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateIsActiveValidator(req) {
        let errObj = {};
        if (!req?.is_active && req?.is_active > 1) {
            return {
                responseCode: responsecodes().PLAN_IS_ACTIVE_REQUIRED,
                responseMessage: getStatusText(responsecodes().PLAN_IS_ACTIVE_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.id) {
            return {
                responseCode: responsecodes().PLAN_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PLAN_ID_REQUIRED),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = UpdateIsActiveController;
