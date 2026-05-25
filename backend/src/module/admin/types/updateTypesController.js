const fs = require("fs");
const path = require("path");
const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateTypesController {

    static async updateTypes(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateTypesController.updateTypesValidator(event);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addTypes = await UpdateTypesController.updateTypesOperation(
                event,
                corelationId,
                context,
                authorizer
            );

            if (addTypes?.responseCode === "OK") {
                return context.send(addTypes);
            } else {
                return context.status(400).send(addTypes);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateTypesOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM types WHERE id = ?', [req?.body?.type_id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_TYPE,
                    responseMessage: getStatusText(responsecodes().INVALID_TYPE),
                    responseData: {}
                });
            }
            const image = req?.file;
            if(image){
                const oldImageUrl = rows[0].type_image;
                const oldImagePath = path.join(__dirname, oldImageUrl.replace(process.env.BASE_URL, "../../../../"));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
                const filepath = `${process.env.BASE_URL}uploads/types/${image?.filename}`;
                const query = `UPDATE types SET type_image = ?, type_name = ? WHERE id = ?`;
                const values = [
                    filepath,
                    req?.body?.type_name,
                    req?.body?.type_id
                ];
                const [result] = await db.query(query, values);
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {
                        id: req?.body?.type_id,
                        type_image: filepath,
                        type_name: req?.body?.type_name
                    }
                });
            } else {
                const query = `UPDATE types SET type_name = ? WHERE id = ?`;
                const values = [
                    req?.body?.type_name,
                    req?.body?.type_id
                ];
                const [result] = await db.query(query, values);
                return await utils.generateResponseObj({
                    responseCode: responsecodes().SUCCESS_OK,
                    responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                    responseData: {
                        id: req?.body?.type_id,
                        type_image: rows[0].type_image,
                        type_name: req?.body?.type_name
                    }
                });
            }
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateTypesValidator(req) {
        let errObj = {};
        if (!req?.body?.type_id) {
            return {
                responseCode: responsecodes().TYPE_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().TYPE_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.body?.type_name) {
            return {
                responseCode: responsecodes().TYPE_NAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().TYPE_NAME_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateTypesController;
