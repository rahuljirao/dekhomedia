const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class GetPaymentMethodController {

    static async getPaymentMethod(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {            
            // Perform get operation
            const getPaymentMethodResponse = await GetPaymentMethodController.getPaymentMethodOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (getPaymentMethodResponse?.responseCode === "OK") {
                return context.send(getPaymentMethodResponse);
            } else {
                return context.status(400).send(getPaymentMethodResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getPaymentMethodOperation(req, corelationId, context, authorizer) {
        try {
            let { search, start, length, dir, sortColumn } = req;

            const limit = length || 10;
            const offset = start || 0;
            const searchValue = search || '';
            const orderBy = dir || 'asc';
            const column = sortColumn || 'name';
            
            // const query = `SELECT * FROM payment_getways WHERE is_deleted = 0`;
            const query = `SELECT * FROM payment_getways WHERE  is_deleted = 0 AND name LIKE ? ORDER BY ?? ${orderBy} LIMIT ? OFFSET ? `;
            const [result] = await db.query(query, [`%${searchValue}%`, column, parseInt(limit), parseInt(offset)]);

            const [count] = await db.query(`SELECT COUNT(*) as total FROM payment_getways WHERE is_deleted = 0`);

            const [filteredCount] = await db.query(`SELECT COUNT(*) as total FROM payment_getways WHERE is_deleted = 0 AND name LIKE ?`, [`%${searchValue}%`]);

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

module.exports = GetPaymentMethodController;
