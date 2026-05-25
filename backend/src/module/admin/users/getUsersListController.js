const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetUsersListController {

    static async getUsersList(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            
            // Perform update operation
            const updateUserResponse = await GetUsersListController.getUsersListOperation(
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

    static async getUsersListOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            const { search, start, length, dir, sortColumn } = req;

            const limit = length || 10;
            const offset = start || 0;
            const searchValue = search || '';
            const orderBy = dir || 'asc';
            const column = sortColumn || 'name';
            
            const query = `SELECT users.*,
                (IFNULL(users.wallet_balance, 0) + IFNULL(users.coin_balance, 0)) AS coins,
                CASE
                    WHEN users.weekly_vip_ended IS NULL OR users.weekly_vip_ended <= NOW() THEN
                        CASE
                            WHEN users.monthly_vip_ended IS NULL OR users.monthly_vip_ended <= NOW() THEN
                                CASE
                                    WHEN users.yearly_vip_ended IS NOT NULL AND users.yearly_vip_ended > NOW() THEN 'Yearly'
                                    ELSE 'Free'
                                END
                            WHEN users.yearly_vip_ended IS NULL OR users.yearly_vip_ended <= NOW() THEN 'Monthly'
                            WHEN users.monthly_vip_ended <= users.yearly_vip_ended THEN 'Monthly'
                            ELSE 'Yearly'
                        END
                    WHEN users.monthly_vip_ended IS NULL OR users.monthly_vip_ended <= NOW() THEN
                        CASE
                            WHEN users.yearly_vip_ended IS NULL OR users.yearly_vip_ended <= NOW() THEN 'Weekly'
                            WHEN users.weekly_vip_ended <= users.yearly_vip_ended THEN 'Weekly'
                            ELSE 'Yearly'
                        END
                    WHEN users.yearly_vip_ended IS NULL OR users.yearly_vip_ended <= NOW() THEN
                        CASE
                            WHEN users.weekly_vip_ended <= users.monthly_vip_ended THEN 'Weekly'
                            ELSE 'Monthly'
                        END
                    WHEN users.weekly_vip_ended <= users.monthly_vip_ended AND users.weekly_vip_ended <= users.yearly_vip_ended THEN 'Weekly'
                    WHEN users.monthly_vip_ended <= users.weekly_vip_ended AND users.monthly_vip_ended <= users.yearly_vip_ended THEN 'Monthly'
                    ELSE 'Yearly'
                END AS current_plan
                FROM users
                WHERE ( IFNULL(users.name, '') LIKE ? OR IFNULL(users.email, '') LIKE ? OR users.login_type LIKE ? )
                ORDER BY ?? ${orderBy} LIMIT ? OFFSET ?`;
            const [result] = await db.query(query, [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, column, parseInt(limit), parseInt(offset)]);

            const [count] = await db.query(`SELECT COUNT(*) as total FROM users`);

            const [filteredCount] = await db.query(`SELECT COUNT(*) as total FROM users WHERE ( IFNULL(name, '') LIKE ? OR IFNULL(email, '') LIKE ? OR login_type LIKE ? )`, [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`]);
            // const [newRows] = await db.query('SELECT * FROM users');

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    data: result,
                    totalRecords: count[0].total,
                    recordsFiltered: filteredCount[0].total
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetUsersListController;
