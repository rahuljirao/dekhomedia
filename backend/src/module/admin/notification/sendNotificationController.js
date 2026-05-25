const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
const { sendPushNotification } = require("../../../common/firebaseService");

class SendNotificationController {

    static async sendNotification(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {   
            // Validate input data
            let response = await SendNotificationController.sendNotificationValidator(event);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform get operation
            const sendNotification = await SendNotificationController.sendNotificationOperation(
                event,
                corelationId,
                context,
                authorizer
            );

            if (sendNotification?.responseCode === "OK") {
                return context.send(sendNotification);
            } else {
                return context.status(400).send(sendNotification);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async sendNotificationOperation(req, corelationId, context, authorizer) {
        try {
            const { title, message } = req?.body;

            const image = req.file;
            let notificationData = {
                title: title,
                body: message
            };

            if (image) {
                const filepath = `${process.env.BASE_URL}uploads/types/${image.filename}`;
                notificationData.image = filepath;
            }

            await sendPushNotification({ notificationData });

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: ''
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    
    static async sendNotificationValidator(req) {
        let errObj = {};
        if (!req?.body?.title) {
            return {
                responseCode: responsecodes().NOTIFICATION_TITLE_REQUIRED,
                responseMessage: getStatusText(responsecodes().NOTIFICATION_TITLE_REQUIRED),
                responseData: {}
            };
        }
        
        if (!req?.body?.message) {
            return {
                responseCode: responsecodes().NOTIFICATION_MESSAGE_REQUIRED,
                responseMessage: getStatusText(responsecodes().NOTIFICATION_MESSAGE_REQUIRED),
                responseData: {}
            };
        }

        // if(!req.file){
        //     return await utils.generateResponseObj({
        //         responseCode: responsecodes().NOTIFICATION_IMAGE_NOT_FOUND,
        //         responseMessage: getStatusText(responsecodes().NOTIFICATION_IMAGE_NOT_FOUND),
        //         responseData: {}
        //     });
        // }

        return errObj;
    }
}

module.exports = SendNotificationController;
