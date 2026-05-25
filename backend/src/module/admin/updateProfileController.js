const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const path = require('path');
const fs = require("fs");

class UpdateProfileController {

    static async updateUserProfile(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateProfileController.updateProfileValidator(event);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform update operation
            const updateUserResponse = await UpdateProfileController.updateProfileOperation(
                event,
                corelationId,
                context,
                authorizer
            );

            if (updateUserResponse?.responseCode === "OK") {
                return context.send(updateUserResponse);
            } else {
                return context.status(400).send(updateUserResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateProfileOperation(req, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [authorizer?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_USER,
                    responseMessage: getStatusText(responsecodes().INVALID_USER),
                    responseData: {}
                });
            }
            
            const image = req?.file;
            if(image){
                const oldImageUrl = rows[0].profile_image;
                if(oldImageUrl){
                    const oldImagePath = path.join(__dirname, oldImageUrl.replace(process.env.BASE_URL, "../../../"));
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                const filepath = `${process.env.BASE_URL}uploads/profile/${image?.filename}`;
                const query = `UPDATE admin SET name = ?, profile_image = ?, phone = ? WHERE id = ?`;
                const values = [
                    req?.body?.name,
                    filepath,
                    req?.body?.phone,
                    authorizer?.id
                ];
                const [result] = await db.query(query, values);
            } else {
                const query = `UPDATE admin SET name = ?, phone = ? WHERE id = ?`;
                const values = [
                    req?.body?.name,
                    req?.body?.phone,
                    authorizer?.id
                ];
                const [result] = await db.query(query, values);
            }
            const [newRows] = await db.query('SELECT * FROM admin WHERE id = ?', [authorizer?.id]);
            let newDetails = newRows[0];
            delete newDetails?.password;

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: newDetails
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async updateProfileValidator(req) {
        let errObj = {};
        console.log(req?.body);

        if (!req?.body?.name) {
            return {
                responseCode: responsecodes().NAME_REQUIRED,
                responseMessage: getStatusText(responsecodes().NAME_REQUIRED),
                responseData: {}
            };
        }

        if (!req?.body?.phone) {
            return {
                responseCode: responsecodes().PHONE_REQUIRED,
                responseMessage: getStatusText(responsecodes().PHONE_REQUIRED),
                responseData: {}
            };
        }
        
        if (!/^\+?[0-9]{10,15}$/.test(req?.body?.phone)) {
            return {
                responseCode: responsecodes().INVALID_PHONE_NUMBER,
                responseMessage: getStatusText(responsecodes().INVALID_PHONE_NUMBER),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateProfileController;
