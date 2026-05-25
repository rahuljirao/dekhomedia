const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class UpdateAboutUsDetailsController {

    static async updateAboutUsDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateAboutUsDetailsController.AboutUsDetailsValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const updateAboutUsResponse = await UpdateAboutUsDetailsController.AboutUsDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateAboutUsResponse?.responseCode === "OK") {
                return context.send(updateAboutUsResponse);
            } else {
                return context.status(400).send(updateAboutUsResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async AboutUsDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const query = 'UPDATE admin SET about_us = ? WHERE id = ?';
            const values = [
                data?.about_us,
                1
            ];
            const [result] = await db.query(query, values);
            const [newRows] = await db.query('SELECT about_us FROM admin WHERE id = ?', [1]);
            let newDetails = newRows[0];

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: newDetails
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async AboutUsDetailsValidator(req) {
        let errObj = {};

        if (!req?.about_us) {
            errObj = {
                responseCode: responsecodes().ABOUT_US_REQUIRED,
                responseMessage: getStatusText(responsecodes().ABOUT_US_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateAboutUsDetailsController;
