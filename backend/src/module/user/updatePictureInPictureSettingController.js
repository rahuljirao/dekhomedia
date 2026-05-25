const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class UpdatePictureInPictureSettingController {

    static async updatePictureInPictureSetting(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {          
            // Perform get operation
            const updatePictureInPictureSettingResponse = await UpdatePictureInPictureSettingController.updatePictureInPictureSettingOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updatePictureInPictureSettingResponse?.responseCode === "OK") {
                return context.send(updatePictureInPictureSettingResponse);
            } else {
                return context.status(400).send(updatePictureInPictureSettingResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updatePictureInPictureSettingOperation(data, corelationId, context, authorizer) {
        try {
            const [[user]] = await db.query('SELECT * FROM users WHERE id = ?', [authorizer?.id]);
            let status = user?.is_picture_and_picture;
            status = status ? 0 : 1;
            const query = `UPDATE users SET is_picture_and_picture = ?  WHERE id = ?`;
            const values = [
                status,
                authorizer?.id
            ];
            const [result] = await db.query(query, values);
            user.is_picture_and_picture = status;
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: user
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = UpdatePictureInPictureSettingController;
