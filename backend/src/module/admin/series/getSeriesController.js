const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetSeriesController {

    static async getSeries(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getSeriesResponse = await GetSeriesController.getSeriesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getSeriesResponse?.responseCode === "OK") {
                return context.send(getSeriesResponse);
            } else {
                return context.status(400).send(getSeriesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getSeriesOperation(req, corelationId, context, authorizer) {
        try {
            const { search, start, length, dir, sortColumn } = req;

            // const limit = length || 10;
            // const offset = start || 0;
            const searchValue = search || '';
            // const orderBy = dir || 'asc';
            // const column = sortColumn || 'title';
            
            // const query = `SELECT a.*, GROUP_CONCAT(b.name SEPARATOR ', ') AS tag_name, c.type_name, c.type_image FROM series a LEFT JOIN tags b ON FIND_IN_SET(b.id, a.tag_id) LEFT JOIN types c ON a.type_id = c.id WHERE a.is_deleted = 0 AND ( a.title LIKE ? OR b.name LIKE ? OR c.type_name LIKE ? ) GROUP BY a.id ORDER BY ?? ${orderBy} LIMIT ? OFFSET ? `;
            // const [result] = await db.query(query, [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, column, parseInt(limit), parseInt(offset)]);
            
            const query = `SELECT a.*, IFNULL(GROUP_CONCAT(b.name SEPARATOR ', '), '') AS tag_name, c.type_name, c.type_image FROM series a LEFT JOIN tags b ON FIND_IN_SET(b.id, a.tag_id) LEFT JOIN types c ON a.type_id = c.id WHERE a.is_deleted = 0 AND ( a.title LIKE ? OR b.name LIKE ? OR c.type_name LIKE ? ) GROUP BY a.id`;
            const [result] = await db.query(query, [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`]);

            // const [count] = await db.query(`SELECT COUNT(*) as total FROM series a LEFT JOIN tags b ON a.tag_id = b.id LEFT JOIN types c ON a.type_id = c.id WHERE a.is_deleted = 0`);

            // const [filteredCount] = await db.query(`SELECT COUNT(*) as total FROM series a LEFT JOIN tags b ON a.tag_id = b.id LEFT JOIN types c ON a.type_id = c.id WHERE a.is_deleted = 0 AND ( a.title LIKE ? OR b.name LIKE ? OR c.type_name LIKE ? )`, [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`]);
            // const query = `SELECT a.*, b.name as tag_name, c.type_name, c.type_image FROM series a LEFT JOIN tags b ON a.tag_id = b.id LEFT JOIN types c ON a.type_id = c.id WHERE a.is_deleted = 0`;
            // const [result] = await db.query(query);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: result
            });
        } catch (err) {
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetSeriesController;
