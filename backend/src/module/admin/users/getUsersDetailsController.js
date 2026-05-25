const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetUsersDetailsController {

    static async getUsersDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetUsersDetailsController.getUsersDetailsValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform update operation
            const updateUserResponse = await GetUsersDetailsController.getUsersDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateUserResponse?.responseCode === "OK") {
                return context.send(updateUserResponse);
            } else {
                return context.status(400).send(updateUserResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getUsersDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            const [users] = await db.query(`SELECT * FROM users WHERE id = ${data?.id}`);
            let userData = users[0];
            const [userPlans] = await db.query('SELECT a.*, b.name as plan_name, c.name as payment_getway_name FROM users_payments a LEFT JOIN plans b ON a.plan_id = b.id LEFT JOIN payment_getways c ON a.payment_getway_id = c.id WHERE a.user_id = ? AND a.status = 2 AND a.expire_date > NOW() ORDER BY a.expire_date ASC', [data?.id]);
            userData.userplans = userPlans;
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: userData
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getUsersDetailsValidator(req) {
        let errObj = {};

        if (!req?.id) {
            return {
                responseCode: responsecodes().REQUEST_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().REQUEST_ID_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = GetUsersDetailsController;
