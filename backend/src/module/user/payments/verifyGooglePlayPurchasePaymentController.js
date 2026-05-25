const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
const crypto = require("crypto");
const googlePlayService = require("../../../common/googlePlayService");
function getMySQLDatePlus(date, days) {
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

class VerifyGooglePlayPurchasePaymentController {
    static async verifyGooglePlayPurchasePayment(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await VerifyGooglePlayPurchasePaymentController.verifyGooglePlayPurchasePaymentValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const verifyGooglePlayPurchasePaymentResponse = await VerifyGooglePlayPurchasePaymentController.verifyGooglePlayPurchasePaymentOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (verifyGooglePlayPurchasePaymentResponse?.responseCode === "OK") {
                return context.send(verifyGooglePlayPurchasePaymentResponse);
            } else {
                return context.status(400).send(verifyGooglePlayPurchasePaymentResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async verifyGooglePlayPurchasePaymentOperation(data, corelationId, context, authorizer) {
        try {
            console.log("verifyGooglePlayPurchasePaymentOperation body", data)
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
                // // Status 2 means success, so we must verify with Google Play
                // if(!data?.purchase_token || !data?.order_id) {
                //     return await utils.generateResponseObj({
                //         responseCode: responsecodes().PURCHASE_TOKEN_REQUIRED,
                //         responseMessage: 'Purchase token and order ID are required for verification',
                //         responseData: {}
                //     });
                // }

                console.log('Starting Google Play verification for transaction:', data?.transaction_id);
                
                // Step 1: Verify purchase with Google Play
                const verification = await googlePlayService.verifyPurchase(
                    data?.product_id,
                    data?.purchase_token
                );

                console.log("verifyPurchase", verification)

                // If verification fails, mark transaction as failed and return error
                if (!verification.success) {
                    console.error('❌ Google Play verification FAILED:', verification.error);
                    
                    // Update status to failed (3)
                    await db.query(
                        'UPDATE users_payments SET status = ? WHERE transaction_id = ?',
                        [3, data?.transaction_id]
                    );
                    
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().PAYMENT_VERIFICATION_FAILED,
                        responseMessage: 'Google Play purchase verification failed',
                        responseData: { error: verification.error }
                    });
                }

                const purchaseData = verification.data;
                console.log('✅ Google Play verification successful');

                // Step 2: Validate purchase state (0 = purchased, 1 = canceled, 2 = pending)
                if (purchaseData.purchaseState !== 0) {
                    console.error('❌ Invalid purchase state:', purchaseData.purchaseState);
                    
                    await db.query(
                        'UPDATE users_payments SET status = ? WHERE transaction_id = ?',
                        [3, data?.transaction_id]
                    );
                    
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().INVALID_PURCHASE_STATE,
                        responseMessage: 'Purchase is not in valid state (may be cancelled or pending)',
                        responseData: { purchaseState: purchaseData.purchaseState }
                    });
                }
                console.log('✅ Purchase state is valid (purchased)');

                // Step 3: Verify order_id matches
                if (purchaseData.orderId !== data.order_id) {
                    console.error('❌ Order ID mismatch - Expected:', data.order_id, 'Got:', purchaseData.orderId);
                    
                    await db.query(
                        'UPDATE users_payments SET status = ? WHERE transaction_id = ?',
                        [3, data?.transaction_id]
                    );
                    
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().ORDER_ID_MISMATCH,
                        responseMessage: 'Order ID does not match with Google Play',
                        responseData: {}
                    });
                }
                console.log('✅ Order ID verified:', purchaseData.orderId);

                // Step 4: Check for duplicate purchase token
                const [existingPurchase] = await db.query(
                    'SELECT * FROM users_payments WHERE purchase_token = ? AND transaction_id != ? AND status = 2',
                    [data?.purchase_token, data?.transaction_id]
                );

                if (existingPurchase.length > 0) {
                    console.error('❌ Duplicate purchase token detected');
                    
                    await db.query(
                        'UPDATE users_payments SET status = ? WHERE transaction_id = ?',
                        [3, data?.transaction_id]
                    );
                    
                    return await utils.generateResponseObj({
                        responseCode: responsecodes().DUPLICATE_PURCHASE_TOKEN,
                        responseMessage: 'This purchase has already been processed',
                        responseData: { existingTransaction: existingPurchase[0].transaction_id }
                    });
                }
                console.log('✅ Purchase token is unique');

                // Step 5: Store Google Play verification data
                await db.query(`UPDATE users_payments SET purchase_token = ? WHERE transaction_id = ?`, [ data?.purchase_token, data?.transaction_id ]);
                console.log('✅ Google verification data saved');

                // Step 6: CONSUME PURCHASE (Critical for multiple purchases)
                console.log('🔄 Consuming purchase to allow future purchases...');
                const consumeResult = await googlePlayService.consumePurchase(
                    data?.product_id,
                    data?.purchase_token
                );
                
                if (consumeResult.success) {
                    console.log('✅ Purchase consumed successfully');
                    console.log('✅ User can now purchase this product again');
                    
                    // await db.query(
                    //     'UPDATE users_payments SET is_consumed = 1, consumed_at = NOW() WHERE transaction_id = ?',
                    //     [data?.transaction_id]
                    // );
                } else {
                    console.warn('⚠️ Failed to consume purchase:', consumeResult.error);
                    // Continue anyway - the purchase is still valid
                }

                console.log('🎉 All Google Play verifications passed! Processing payment...');

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
                data?.order_id,
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
            console.log("VerifyGooglePlayPurchasePaymentController", err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async verifyGooglePlayPurchasePaymentValidator(req) {

        if (!req?.transaction_id) {
            return {
                responseCode: responsecodes().TRANSACTION_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().TRANSACTION_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.product_id) {
            return {
                responseCode: responsecodes().PRODUCT_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().PRODUCT_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.status) {
            return {
                responseCode: responsecodes().STATUS_REQUIRED,
                responseMessage: getStatusText(responsecodes().STATUS_REQUIRED),
                responseData: {}
            };
        }
        if (parseInt(req?.status) === 2 && !req?.purchase_token) {
            return {
                responseCode: responsecodes().PURCHASE_TOKEN_REQUIRED,
                responseMessage: getStatusText(responsecodes().PURCHASE_TOKEN_REQUIRED),
                responseData: {}
            };
        }
        if (parseInt(req?.status) === 2 && !req?.order_id) {
            return {
                responseCode: responsecodes().ORDER_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().ORDER_ID_REQUIRED),
                responseData: {}
            };
        }

        return {};
    }
}

module.exports = VerifyGooglePlayPurchasePaymentController;
