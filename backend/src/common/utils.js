const { responsecodes } = require("../response-codes/lib");
const { Resend } = require("resend");
const crypto = require('crypto');
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const Ffmpeg = require("fluent-ffmpeg");
const { exec } = require("child_process");

// Ffmpeg.setFfmpegPath(ffmpegPath);

class Utils {

    static async generateResponseObj(responseObj = {}) {
        let response = {
            responseCode: responseObj?.responseCode,
            responseMessage: responseObj?.responseMessage,
            responseDetails: responseObj?.responseData
        }
        return response;
    }

    static async throwCatchError(err = {}) {
        let response = {
            responseCode: responsecodes().INVALID_REQUEST,
            responseMessage: err.message,
            responseDetails:{}
        }
        return response;
    }

    static getAdvertiserDetails(event) {
        try {
          return event.requestContext?.authorizer;
        } catch (err) {
          return err;
        }
    }



    static async sendMail(req, res) {
        try {
            const resend = new Resend(process.env.RESEND_KEY);
            let response = await resend.emails.send({
                from: 'no-replay <noreplay@sarkariyojanavale.com>',
                to: `${req?.to}`,
                subject: `${req?.subject}`,
                html: `${req?.message}`,
            });
            console.log("Email Sent With Response =====> ", response);
            return { status: 1, message: "Sent Successfully", data: response };
            // console.log("reqdata===> ", req.to);
            // console.log("reqdata===> ", req.subject);
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }

    static async decrypt(encryptedText, key) {
        try {
            if (key.length !== 16) {
                throw new Error(`Key must be 16 bytes long. Current length: ${key.length}`);
            }
            const encryptedBuffer = Buffer.from(encryptedText, 'base64');
            const saltedPrefix = encryptedBuffer.slice(0, 8).toString();
            if (saltedPrefix !== 'Salted__') {
                throw new Error('Invalid encrypted text format.');
            }
            const encryptedData = encryptedBuffer.slice(8);
            const decipher = crypto.createDecipheriv('aes-128-ecb', key, null);
            let decryptedData = decipher.update(encryptedData, 'binary', 'utf8');
            decryptedData += decipher.final('utf8');
            return decryptedData;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async encrypt(plainText, key) {
        try {
            if (key.length !== 16) {
                throw new Error(`Key must be 16 bytes long. Current length: ${key.length}`);
            }
            if (typeof plainText === 'object') {
                plainText = JSON.stringify(plainText);
            }
            const cipher = crypto.createCipheriv('aes-128-ecb', key, null);
            let encryptedData = cipher.update(plainText, 'utf8', 'binary');
            encryptedData += cipher.final('binary');
            const saltedPrefix = Buffer.from('Salted__');
            const resultBuffer = Buffer.concat([saltedPrefix, Buffer.from(encryptedData, 'binary')]);
            const encryptedBase64 = resultBuffer.toString('base64');
            return encryptedBase64;
        } catch (error) {
            throw new Error(error);
        }
    }
    static async generate16DigitUUID() {
        let hexUuid = uuidv4().replace(/-/g, "");
        let bigIntUuid = BigInt("0x" + hexUuid);
        let numericUuid = bigIntUuid.toString().slice(0, 10);
        return numericUuid;
    }

    // static async getThumbnailFromVideo(videoPath, uploadPath){
    //     return new Promise((resolve, reject) => {
    //         let uploadDir = path.join(__dirname, '../../' + uploadPath);
    //         if (!fs.existsSync(uploadDir)) {
    //             fs.mkdirSync(uploadDir, { recursive: true });
    //         }
    //         const outputFile = `${Date.now()}-thumbnail.jpg`;
    //         let thumbnailPath = process.env.BASE_URL + uploadPath + '/' + outputFile;

    //         Ffmpeg(videoPath)
    //             .on('end', () => {
    //                 console.log('Thumbnail created at', thumbnailPath);
    //                 resolve({err: false, path: thumbnailPath});
    //             })
    //             .on('error', (err) => {
    //                 console.error('Error:', err.message);
    //                 resolve({err: true, message: err.message});
    //             })
    //             .screenshots({
    //                 count: 1,
    //                 folder: uploadDir,
    //                 filename: outputFile,
    //                 timemarks: ['00:00:01.000'] // capture at 1s
    //             });
    //     });
    // }

    static async getThumbnailFromVideo(videoPath, uploadPath){
        return new Promise((resolve, reject) => {
            try {
                let uploadDir = path.join(__dirname, '../../' + uploadPath);
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const outputFile = `${Date.now()}-thumbnail.jpg`;
                let thumbnailPath = process.env.BASE_URL + uploadPath + '/' + outputFile;

                const command = `ffmpeg -i "${videoPath}" -ss 00:00:05 -vframes 1 "${path.join(uploadDir, outputFile)}"`;
    
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error:', error);
                        resolve({err: true, message: error.message});
                    }
                    resolve({err: false, path: thumbnailPath});
                });
    
                // Ffmpeg.ffprobe(videoPath, (err, metadata) => {
                //     if (err) {
                //         console.error('ffprobe error:', err.message);
                //         return reject({ err: true, message: err.message });
                //     }
            
                //     const duration = metadata?.format?.duration || 10; // default 10s fallback
                //     const midTime = duration / 2; // middle point
            
                //     // Convert seconds to HH:MM:SS.mmm format
                //     const hours = Math.floor(midTime / 3600);
                //     const minutes = Math.floor((midTime % 3600) / 60);
                //     const seconds = (midTime % 60).toFixed(3);
                //     const timemark = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${seconds.padStart(6, '0')}`;
            
                //     // 2. Take screenshot at midTime
                //     Ffmpeg(videoPath)
                //         .inputOptions([
                //             "-protocol_whitelist", "file,http,https,tcp,tls",
                //             "-safe", "0"
                //         ])
                //         .seekInput(midTime) // seek to middle
                //         .frames(1) // grab 1 frame
                //         .output(path.join(uploadDir, outputFile))
                //         .on('end', () => {
                //             resolve({ err: false, path: thumbnailPath });
                //         })
                //         .on('error', (err) => {
                //             console.error('FFmpeg thumbnail error:', err.message);
                //             reject({ err: true, message: err.message });
                //         })
                //         .run();
                // });
            } catch (error) {
                console.error('Error:', error);
                resolve({err: true, message: error.message});
            }
        });
    }
}
module.exports = Utils;
