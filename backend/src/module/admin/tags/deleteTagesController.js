const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class DeleteTagesController {

    static async deleteTages(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await DeleteTagesController.deleteTagesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const deleteTagesResponse = await DeleteTagesController.deleteTagesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deleteTagesResponse?.responseCode === "OK") {
                return context.send(deleteTagesResponse);
            } else {
                return context.status(400).send(deleteTagesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deleteTagesOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM tags WHERE id = ?', [data?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_TAG,
                    responseMessage: getStatusText(responsecodes().INVALID_TAG),
                    responseData: {}
                });
            }

            const query = `UPDATE tags SET is_deleted = 1 WHERE id = ?`;
            const values = [
                data?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {}
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deleteTagesValidator(req) {
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

module.exports = DeleteTagesController;
