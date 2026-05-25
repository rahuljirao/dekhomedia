const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
function getMySQLDatePlus(date, days) {
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

class UpdateTransactionController {
    static async updateTransaction(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateTransactionController.updateTransactionValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const updateTransactionResponse = await UpdateTransactionController.updateTransactionOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateTransactionResponse?.responseCode === "OK") {
                return context.send(updateTransactionResponse);
            } else {
                return context.status(400).send(updateTransactionResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateTransactionOperation(data, corelationId, context, authorizer) {
        try {
            const [users] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            if (users.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            let userDetails = users[0];

            const [rows] = await db.query('SELECT a.*, b.* FROM users_payments a LEFT JOIN plans b ON a.plan_id = b.id WHERE a.transaction_id = ?', [data?.transaction_id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_TRANSACTION_ID,
                    responseMessage: getStatusText(responsecodes().INVALID_TRANSACTION_ID),
                    responseData: {}
                });
            }
            let transDetails = rows[0];
            if(transDetails?.status == 2 || transDetails?.status == 3){
                return await utils.generateResponseObj({
                    responseCode: responsecodes().TRANSACTION_ALREADY_UPDATED,
                    responseMessage: getStatusText(responsecodes().TRANSACTION_ALREADY_UPDATED),
                    responseData: {}
                });
            }
            if(data?.status == 2){
                if(transDetails?.is_unlimited == 1){
                    if(transDetails?.is_weekly == 1){
                        let baseDate = new Date();
                        if (userDetails.yearly_vip_ended && new Date(userDetails.yearly_vip_ended) > baseDate) {
                            baseDate = new Date(userDetails.yearly_vip_ended);
                        }
                        if (userDetails.monthly_vip_ended && new Date(userDetails.monthly_vip_ended) > baseDate) {
                            baseDate = new Date(userDetails.monthly_vip_ended);
                        }
                        if (userDetails.weekly_vip_ended && new Date(userDetails.weekly_vip_ended) > baseDate) {
                            baseDate = new Date(userDetails.weekly_vip_ended);
                        }
                        const expire_date = getMySQLDatePlus(baseDate, 7);
                        const users = `UPDATE users SET is_weekly_vip = ?, weekly_vip_ended = ? WHERE id = ?`;
                        const usersvalues = [
                            1,
                            expire_date,
                            authorizer?.id
                        ];
                        const [result] = await db.query(users, usersvalues);
                    } else if(transDetails?.is_monthly == 1){
                        let baseDate = new Date();
                        if (userDetails.weekly_vip_ended && new Date(userDetails.weekly_vip_ended) > baseDate) {
                            baseDate = new Date(userDetails.weekly_vip_ended);
                        }
                        if (userDetails.monthly_vip_ended && new Date(userDetails.monthly_vip_ended) > baseDate) {
                            baseDate = new Date(userDetails.monthly_vip_ended);
                        }
                        if (userDetails.yearly_vip_ended && new Date(userDetails.yearly_vip_ended) > baseDate) {
                            baseDate = new Date(userDetails.yearly_vip_ended);
                        }
                        const expire_date = getMySQLDatePlus(baseDate, transDetails?.month_days || 30);
                        const users = `UPDATE users SET is_monthly_vip = ?, monthly_vip_ended = ? WHERE id = ?`;
                        const usersvalues = [
                            1,
                            expire_date,
                            authorizer?.id
                        ];
                        const [result] = await db.query(users, usersvalues);
                    } else if(transDetails?.is_yearly == 1){
                        let baseDate = new Date();
                        if (userDetails.weekly_vip_ended && new Date(userDetails.weekly_vip_ended) > baseDate) {
                            baseDate = new Date(userDetails.weekly_vip_ended);
                        }
                        if (userDetails.monthly_vip_ended && new Date(userDetails.monthly_vip_ended) > baseDate) {
                            baseDate = new Date(userDetails.monthly_vip_ended);
                        }
                        if (userDetails.yearly_vip_ended && new Date(userDetails.yearly_vip_ended) > baseDate) {
                            baseDate = new Date(userDetails.yearly_vip_ended);
                        }
                        const expire_date = getMySQLDatePlus(baseDate, 365);
                        const users = `UPDATE users SET is_yearly_vip = ?, yearly_vip_ended = ? WHERE id = ?`;
                        const usersvalues = [
                            1,
                            expire_date,
                            authorizer?.id
                        ];
                        const [result] = await db.query(users, usersvalues);
                    }
                } else{
                    // const [users] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
                    let coins = Number(userDetails['coin_balance']) + Number(transDetails?.coin) + Number(transDetails?.extra_coin);
                    const user = `UPDATE users SET coin_balance = ? WHERE id = ?`;
                    const usersvalues = [
                        coins,
                        authorizer?.id
                    ];
                    const [result] = await db.query(user, usersvalues);
                }
            }
            const query = 'UPDATE users_payments SET transaction_key = ?, status = ? WHERE transaction_id = ?';
            const values = [
                data?.transaction_key,
                data?.status,
                data?.transaction_id
            ];
            const [result] = await db.query(query, values);
            const [newRows] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: newRows[0]
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async updateTransactionValidator(req) {
        let errObj = {};

        if (!req?.transaction_id) {
            errObj = {
                responseCode: responsecodes().TRANSACTION_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().TRANSACTION_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.status) {
            errObj = {
                responseCode: responsecodes().STATUS_REQUIRED,
                responseMessage: getStatusText(responsecodes().STATUS_REQUIRED),
                responseData: {}
            };
        }
        if (parseInt(req?.status) === 2 && !req?.transaction_key) {
            errObj = {
                responseCode: responsecodes().TRANSACTION_KEY_REQUIRED,
                responseMessage: getStatusText(responsecodes().TRANSACTION_KEY_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateTransactionController;
