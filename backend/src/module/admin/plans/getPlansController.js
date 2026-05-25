const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetPlansController {

    static async getPlans(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getPlansResponse = await GetPlansController.getPlansOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getPlansResponse?.responseCode === "OK") {
                return context.send(getPlansResponse);
            } else {
                return context.status(400).send(getPlansResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getPlansOperation(req, corelationId, context, authorizer) {
        try {
            const { search, start, length, dir, sortColumn } = req;

            const limit = length || 10;
            const offset = start || 0;
            const searchValue = search || '';
            const orderBy = dir || 'asc';
            const column = sortColumn || 'coin';
            
            const query = `SELECT * FROM plans WHERE is_deleted = 0 AND is_unlimited = 0 AND ( coin LIKE ? OR name LIKE ? OR amount LIKE ? ) ORDER BY ?? ${orderBy} LIMIT ? OFFSET ? `;
            const [result] = await db.query(query, [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, column, parseInt(limit), parseInt(offset)]);

            const [count] = await db.query(`SELECT COUNT(*) as total FROM plans WHERE is_deleted = 0 AND is_unlimited = 0`);

            const [filteredCount] = await db.query(`SELECT COUNT(*) as total FROM plans WHERE is_deleted = 0 AND is_unlimited = 0 AND ( coin LIKE ? OR name LIKE ? OR amount LIKE ? )`, [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`]);

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
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetPlansController;
