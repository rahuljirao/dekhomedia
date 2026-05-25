const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetUsersRewardsListController {

    static async getUsersRewardsList(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await GetUsersRewardsListController.getUsersRewardsListValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform update operation
            const updateUserResponse = await GetUsersRewardsListController.getUsersRewardsListOperation(
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

    static async getUsersRewardsListOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            const { search, start, length, dir, sortColumn, id } = req;

            const limit = length || 10;
            const offset = start || 0;
            const searchValue = search || '';
            const orderBy = dir?.toLowerCase() === 'asc' ? 'ASC' : 'DESC'; // Safe direction

            const [result] = await db.query(
                `SELECT * FROM reward_history 
                WHERE user_id = ? 
                AND (title LIKE ? OR coin LIKE ?) 
                ORDER BY id DESC
                LIMIT ? OFFSET ?`,
            [id, `%${searchValue}%`, `%${searchValue}%`, parseInt(limit), parseInt(offset)]
            );

             const [count] = await db.query(`SELECT COUNT(*) as total FROM reward_history WHERE user_id = ?`, [id]);

             let filteredCountQuery = `SELECT COUNT(*) as total FROM reward_history WHERE user_id = ?`;
            let values = [id];

            if (searchValue && searchValue.trim() !== '') {
                filteredCountQuery += ` AND (title LIKE ? OR coin LIKE ?)`;
                const keyword = `%${searchValue}%`;
                values.push(keyword, keyword);
            }

            const [filteredCount] = await db.query(filteredCountQuery, values);

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

    static async getUsersRewardsListValidator(req) {
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

module.exports = GetUsersRewardsListController;
