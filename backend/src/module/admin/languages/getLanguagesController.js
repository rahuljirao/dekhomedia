const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetLanguagesController {

    static async getLanguages(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getLanguagesResponse = await GetLanguagesController.getLanguagesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getLanguagesResponse?.responseCode === "OK") {
                return context.send(getLanguagesResponse);
            } else {
                return context.status(400).send(getLanguagesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getLanguagesOperation(req, corelationId, context, authorizer) {
        try {
            const { search, start, length, dir, sortColumn, getAll } = req;

            const searchValue = search || '';
            const orderBy = dir || 'asc';
            const column = sortColumn || 'name';
            const isGetAll = getAll === 'true' || getAll === true;
            
            let query = `SELECT * FROM languages WHERE is_deleted = 0`;
            const params = [];

            if (searchValue) {
                query += ` AND name LIKE ?`;
                params.push(`%${searchValue}%`);
            }

            query += ` ORDER BY ?? ${orderBy}`;
            params.push(column);

            if (!isGetAll) {
                const limit = parseInt(length) || 10;
                const offset = parseInt(start) || 0;
                query += ` LIMIT ? OFFSET ?`;
                params.push(limit, offset);
            }
            
            // const query = `SELECT * FROM languages WHERE is_deleted = 0 AND name LIKE ? ORDER BY ?? ${orderBy} LIMIT ? OFFSET ? `;
            const [result] = await db.query(query, params);

            const [count] = await db.query(`SELECT COUNT(*) as total FROM languages WHERE is_deleted = 0`);

            const [filteredCount] = await db.query(`SELECT COUNT(*) as total FROM languages WHERE is_deleted = 0 AND name LIKE ?`, [`%${searchValue}%`]);

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

module.exports = GetLanguagesController;
