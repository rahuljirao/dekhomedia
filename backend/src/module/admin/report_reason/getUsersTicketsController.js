const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetUsersTicketsController {

    static async getUsersTickets(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getUsersTicketsResponse = await GetUsersTicketsController.getUsersTicketsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getUsersTicketsResponse?.responseCode === "OK") {
                return context.send(getUsersTicketsResponse);
            } else {
                return context.status(400).send(getUsersTicketsResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getUsersTicketsOperation(req, corelationId, context, authorizer) {
        try {
            const { search, start, length, dir, sortColumn, getAll } = req;

            const searchValue = search || '';
            const orderBy = dir || 'asc';
            const column = sortColumn || 'name';
            const isGetAll = getAll === 'true' || getAll === true;
            
            let query = `SELECT * FROM user_reported`;
            const params = [];

            if (searchValue) {
                query += ` WHERE ticket_id LIKE ? OR name LIKE ? OR email LIKE ? OR reason LIKE ?`;
                params.push(`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`);
            }

            query += ` ORDER BY ?? ${orderBy}`;
            params.push(column);

            if (!isGetAll) {
                const limit = parseInt(length) || 10;
                const offset = parseInt(start) || 0;
                query += ` LIMIT ? OFFSET ?`;
                params.push(limit, offset);
            }
            
            const [result] = await db.query(query, params);

            const [count] = await db.query(`SELECT COUNT(*) as total FROM user_reported`);

            const [filteredCount] = await db.query(`SELECT COUNT(*) as total FROM user_reported WHERE ticket_id LIKE ? OR name LIKE ? OR email LIKE ? OR reason LIKE ?`, [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`]);

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

module.exports = GetUsersTicketsController;