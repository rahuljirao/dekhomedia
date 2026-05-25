const fs = require("fs");
const path = require("path");
const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateIsblockedUserController {

    static async updateIsblockedUser(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateIsblockedUserController.updateIsblockedUserValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateIsblockedUser = await UpdateIsblockedUserController.updateIsblockedUserOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateIsblockedUser?.responseCode === "OK") {
                return context.send(updateIsblockedUser);
            } else {
                return context.status(400).send(updateIsblockedUser);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateIsblockedUserOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            let seriesData = rows[0];
            const query = `UPDATE users SET is_blocked = ? WHERE id = ?`;
            const values = [
                req?.is_blocked,
                req?.id
            ];
            const [result] = await db.query(query, values);
            seriesData.is_blocked = req?.is_blocked;
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: seriesData
            });

            
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateIsblockedUserValidator(req) {
        let errObj = {};
        if (!req?.is_blocked && req?.is_blocked > 1) {
            return {
                responseCode: responsecodes().USER_IS_BLOCKED_REQUIRED,
                responseMessage: getStatusText(responsecodes().USER_IS_BLOCKED_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.id) {
            return {
                responseCode: responsecodes().USER_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().USER_ID_REQUIRED),
                responseData: {}
            };
        }
        return errObj;
    }
}

module.exports = UpdateIsblockedUserController;
