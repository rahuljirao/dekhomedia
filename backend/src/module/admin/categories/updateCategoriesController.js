const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateCategoriesController {

    static async updateCategories(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateCategoriesController.updateCategoriesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const updateCategoriesResponse = await UpdateCategoriesController.updateCategoriesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateCategoriesResponse?.responseCode === "OK") {
                return context.send(updateCategoriesResponse);
            } else {
                return context.status(400).send(updateCategoriesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateCategoriesOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [req?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_CATEGORY,
                    responseMessage: getStatusText(responsecodes().INVALID_CATEGORY),
                    responseData: {}
                });
            }
            const query = `UPDATE categories SET name = ? WHERE id = ?`;
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

    static async updateCategoriesValidator(req) {
        let errObj = {};
        if (!req?.id) {
            return {
                responseCode: responsecodes().CATEGORY_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().CATEGORY_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.name) {
            return {
                responseCode: responsecodes().CATEGORY_NAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().CATEGORY_NAME_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateCategoriesController;
