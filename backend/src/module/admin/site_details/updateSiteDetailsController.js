const { responsecodes } = require("../../../response-codes/lib");
const { db } = require("../../../common/db");
const { getDateTimeString } = require("../../../common/lib");
const utils = require("../../../common/utils");
const { getStatusText } = require("../../../response-codes/responseCode");
const path = require("path");
const fs = require("fs");

class UpdateSiteDetailsController {

    static async updateSiteDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            // Validate input data
            let response = await UpdateSiteDetailsController.siteDetailsValidator(event);
            if (Object.keys(response).length > 0) {
                return context.status(400).send(response);
            }

            // Perform update operation
            const updateSiteDetailsResponse = await UpdateSiteDetailsController.siteDetailsOperation(
                event,
                corelationId,
                context,
                authorizer
            );

            if (updateSiteDetailsResponse?.responseCode === "OK") {
                return context.send(updateSiteDetailsResponse);
            } else {
                return context.status(400).send(updateSiteDetailsResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async siteDetailsOperation(req, corelationId, context, authorizer) {
        try {
            // Fetch site data once at the beginning
            const [rows] = await db.query('SELECT * FROM site_settings WHERE id = ?', [1]);

            if (rows.length === 0) {
                return await utils.generateResponseObj({
                    responseCode: responsecodes().INVALID_SERIES,
                    responseMessage: getStatusText(responsecodes().INVALID_SERIES),
                    responseData: {}
                });
            }

            let siteData = rows[0];
            const { title, copyright_text, firebase_json, is_admin_maintenance, is_website_maintenance, is_inspect } = req?.body;
            const { logo: newLogoFile, favicon: newFaviconFile } = req?.files || {};
            let logoUrl = siteData?.logo;
            let faviconUrl = siteData?.favicon;
            const deleteOldFile = (url) => {
                if (url) {
                    const filePath = path.join(__dirname, url.replace(process.env.BASE_URL, "../../../../"));
                    if (fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                        } catch (err) {
                            console.error(`Failed to delete old file: ${filePath}`, err);
                        }
                    }
                }
            };
            if (newLogoFile && newLogoFile[0]) {
                deleteOldFile(siteData?.logo);
                logoUrl = `${process.env.BASE_URL}uploads/site/logo/${newLogoFile[0].filename}`;
            }
            if (newFaviconFile && newFaviconFile[0]) {
                deleteOldFile(siteData?.favicon);
                faviconUrl = `${process.env.BASE_URL}uploads/site/favicon/${newFaviconFile[0].filename}`;
            }
            const updateFields = [];
            const updateValues = [];

            if (title !== undefined) {
                updateFields.push('title = ?');
                updateValues.push(title);
            }
            if (copyright_text !== undefined) {
                updateFields.push('copyright_text = ?');
                updateValues.push(copyright_text);
            }
            if (firebase_json !== undefined) {
                updateFields.push('firebase_json = ?');
                updateValues.push(firebase_json);
            }
            if (newLogoFile && newLogoFile[0]) {
                updateFields.push('logo = ?');
                updateValues.push(logoUrl);
            }
            if (newFaviconFile && newFaviconFile[0]) {
                updateFields.push('favicon = ?');
                updateValues.push(faviconUrl);
            }
            if (is_admin_maintenance !== undefined) {
                updateFields.push('is_admin_maintenance = ?');
                updateValues.push(is_admin_maintenance);
            }
            if (is_website_maintenance !== undefined) {
                updateFields.push('is_website_maintenance = ?');
                updateValues.push(is_website_maintenance);
            }
            if (is_inspect !== undefined) {
                updateFields.push('is_inspect = ?');
                updateValues.push(is_inspect);
            }

            if (updateFields.length > 0) {
                const query = `UPDATE site_settings SET ${updateFields.join(', ')} WHERE id = ?`;
                updateValues.push(1);
                await db.query(query, updateValues);
            } else {
                console.log("No fields to update, returning current site data.");
            }

            // Return the updated site details
            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    id: 1,
                    title: title || siteData?.title, // Use new title if provided, else old
                    logo: logoUrl,
                    favicon: faviconUrl,
                    firebase_json: firebase_json,
                    copyright_text: copyright_text,
                    is_admin_maintenance: is_admin_maintenance,
                    is_website_maintenance: is_website_maintenance,
                    is_inspect: is_inspect
                }
            });

        } catch (err) {
            console.error("Error in siteDetailsOperation:", err); // Log the actual error
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
    static async siteDetailsValidator(req) {
        let errObj = {};

        if (!req?.body?.title) {
            errObj = {
                responseCode: responsecodes().SITE_TITLE_REQUIRED,
                responseMessage: getStatusText(responsecodes().SITE_TITLE_REQUIRED),
                responseData: {}
            };
        }
        if (!req?.body?.copyright_text) {
            errObj = {
                responseCode: responsecodes().COPYRIGHT_TEXT_REQUIRED,
                responseMessage: getStatusText(responsecodes().COPYRIGHT_TEXT_REQUIRED),
                responseData: {}
            };
        }

        return errObj;
    }
}

module.exports = UpdateSiteDetailsController;
