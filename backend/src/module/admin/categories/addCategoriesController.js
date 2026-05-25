const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class AddCategoriesController {

    static async addCategories(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AddCategoriesController.addCategoriesValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addCategoriesResponse = await AddCategoriesController.addCategoriesOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (addCategoriesResponse?.responseCode === "OK") {
                return context.send(addCategoriesResponse);
            } else {
                return context.status(400).send(addCategoriesResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addCategoriesOperation(req, corelationId, context, authorizer) {
        try {
            const query = `INSERT INTO categories (name) VALUES (?)`;
            const values = [
                req?.name
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: result?.insertId,
                    name: req?.name,
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addCategoriesValidator(req) {
        let errObj = {};
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

module.exports = AddCategoriesController;
