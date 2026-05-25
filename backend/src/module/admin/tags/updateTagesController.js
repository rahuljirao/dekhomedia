const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateTagesController {

    static async updateTages(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateTagesController.updateTagesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateTagesResponse = await UpdateTagesController.updateTagesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateTagesResponse?.responseCode === "OK") {
                return context.send(updateTagesResponse);
            } else {
                return context.status(400).send(updateTagesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateTagesOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM tags WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_CATEGORY,
                    responseMessage: getStatusText(responsecodes().INVALID_CATEGORY),
                    responseData: {}
                });
            }
            const query = `UPDATE tags SET name = ? WHERE id = ?`;
            const values = [
                req?.name,
                req?.id
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: req?.id,
                    name: req?.name,
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateTagesValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().TAG_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().TAG_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.name) {
            return {
                responseCode: responsecodes().TAG_NAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().TAG_NAME_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateTagesController;
