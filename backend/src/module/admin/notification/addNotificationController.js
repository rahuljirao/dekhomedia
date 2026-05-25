const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class AddNotificationController {

    static async addNotification(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await AddNotificationController.addNotificationValidator(event);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addNotification = await AddNotificationController.addNotificationOperation(
                event,
                corelationId,
                context,
                authorizer
            );

            if (addNotification?.responseCode === "OK") {
                return context.send(addNotification);
            } else {
                return context.status(400).send(addNotification);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addNotificationOperation(req, corelationId, context, authorizer) {
        try {
            const image = req.file;
            const filepath = `${process.env.BASE_URL}uploads/types/${image?.filename}`;

            const query = `INSERT INTO types (type_image, type_name) VALUES (?, ?)`;
            const values = [
                filepath,
                req?.body?.type_name
            ];
            const [result] = await db.query(query, values);

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: result?.insertId,
                    type_image: filepath,
                    type_name: req?.body?.type_name
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addNotificationValidator(req) {
        let errObj = {};
        if (!req?.body?.type_name) {
            return {
                responseCode: responsecodes().TYPE_NAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().TYPE_NAME_REQUIRED),
                responseData: {}
            };
        }

        if(!req.file){
            return await utils.generateResponseObj({
                responseCode: responsecodes().TYPE_IMAGE_NOT_FOUND,
                responseMessage: getStatusText(responsecodes().TYPE_IMAGE_NOT_FOUND),
                responseData: {}
            });
        }

        return errObj;
    }
}

module.exports = AddNotificationController;
