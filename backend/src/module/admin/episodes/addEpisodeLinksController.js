const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");

class addEpisodeLinksController {

    static async addEpisodeLinks(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await addEpisodeLinksController.addEpisodeLinksValidator(request);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }
            
            // Perform add operation
            const addEpisodeLinks = await addEpisodeLinksController.addEpisodeLinksOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (addEpisodeLinks?.responseCode === "OK") {
                return context.send(addEpisodeLinks);
            } else {
                return context.status(400).send(addEpisodeLinks);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addEpisodeLinksOperation(req, corelationId, context, authorizer) {
        try {
            const episode_links = req?.episode_links;
            const seriesId = req?.series_id;

            let uploaded = [];

            const [[{ max_episode }]] = await db.query(`SELECT IFNULL(MAX(episode_number), 0) AS max_episode FROM series_episodes WHERE series_id = ?`, [seriesId]);

            let startEpisode = (max_episode || 0) + 1;

            for (const [index, link] of episode_links.entries()) {

                const episode_number = startEpisode + index;
            
                const filepath = link;
                let thumbnail_url = null;

                let image = await utils.getThumbnailFromVideo(filepath, 'uploads/episode/thumbnail');
                if(image.err === false){
                    thumbnail_url = image?.path ?? null;
                }
                
                // Calculate Coin based on Episode Number
                const coin = await this.calculateCoin(episode_number);

                const query = `INSERT INTO series_episodes (series_id, episode_number, video_url, title, description, tags, coin, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                const values = [
                    seriesId,
                    episode_number,
                    filepath,
                    req?.title,
                    req?.description,
                    req?.tags,
                    coin,
                    thumbnail_url
                ];
                const [result] = await db.query(query, values);
                
                uploaded.push({
                    id: result?.insertId,
                    series_id: seriesId,
                    episode_number: episode_number,
                    title: req?.title,
                    description: req?.description,
                    tags: req?.tags,
                    coin: coin,
                    video_url: filepath,
                    thumbnail_url: thumbnail_url
                });
            }

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: uploaded
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async addEpisodeLinksValidator(req) {
        let errObj = {};
        if (!req?.series_id) {
            return {
                responseCode: responsecodes().SERIES_ID_REQUIRED,
                responseMessage: getStatusText(responsecodes().SERIES_ID_REQUIRED),
                responseData: {}
            };
        }
        if (!Array.isArray(req?.episode_links)) {
            return {
                responseCode: responsecodes().EPISODE_LINKS_MUST_ARRAY,
                responseMessage: getStatusText(responsecodes().EPISODE_LINKS_MUST_ARRAY),
                responseData: {}
            };
        }
        return errObj;
    }

    static async calculateCoin(episodeNumber) {
        const str = episodeNumber.toString();
    
        if (episodeNumber < 10) {
            return episodeNumber;
        }
    
        const remainder = episodeNumber % 10;
        let group = Math.floor((episodeNumber % 100) / 10);

        // Special handling for multiples of 100
        if (episodeNumber % 100 === 0) {
            let mul = Math.floor(episodeNumber / 100);
            if(mul >= 10){
                return this.calculateCoin(mul);
            } else {
                return mul;
            }
        }
    
        if (group === 0) group = 1;
    
        return remainder === 0 ? group : remainder;
    }
    
}

module.exports = addEpisodeLinksController;
