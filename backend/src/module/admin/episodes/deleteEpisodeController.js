const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
const fs = require("fs");

class DeleteEpisodeController {

    static async deleteEpisode(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await DeleteEpisodeController.deleteEpisodeValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const deleteEpisodeResponse = await DeleteEpisodeController.deleteEpisodeOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (deleteEpisodeResponse?.responseCode === "OK") {
                return context.send(deleteEpisodeResponse);
            } else {
                return context.status(400).send(deleteEpisodeResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deleteEpisodeOperation(data, corelationId, context, authorizer) {
        try {
            const [rows] = await db.query('SELECT * FROM series_episodes WHERE id = ?', [data?.id]);
            if (rows.length == 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_EPISODE,
                    responseMessage: getStatusText(responsecodes().INVALID_EPISODE),
                    responseData: {}
                });
            }

            // const query = `UPDATE series_episodes SET is_deleted = 1 WHERE id = ?`;
            const query = `DELETE FROM series_episodes WHERE id = ?`;
            const values = [
                data?.id
            ];
            const [result] = await db.query(query, values);
            
            if(result.affectedRows > 0){
                await this.deleteEpisodeFile(rows[0].video_url);
                if(rows[0].thumbnail_url){
                    await this.deleteEpisodeFile(rows[0].thumbnail_url);
                }
            }

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {}
            });
        } catch (err) {
            console.log(err);
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async deleteEpisodeValidator(req) {
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

    static async deleteEpisodeFile(file) {
        let files = file.split(process.env.BASE_URL);
        let filePath = files[1];
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, async (err) => {
                console.log(`${filePath} was deleted`);
            });
        }
    }
}

module.exports = DeleteEpisodeController;
