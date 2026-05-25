const admin = require('firebase-admin');
const crypto = require('crypto');
const { db } = require("./db");

let firebaseApp = null;
let currentHash = null;

async function initializeFirebaseFromDB() {
    const [rows] = await db.query('SELECT firebase_json FROM site_settings WHERE id = ?', [1]);

    if (!rows || rows.length === 0) throw new Error("No Firebase credentials found");

    const jsonStr = rows[0].firebase_json;
    const newHash = crypto.createHash('sha256').update(jsonStr).digest('hex');

    // Check if we already initialized with same credentials
    if (firebaseApp && newHash === currentHash) {
        return firebaseApp;
    }

    // Parse JSON string into object
    const serviceAccountJson = JSON.parse(jsonStr);

    // Cleanup old instance if it exists
    if (firebaseApp) {
        try {
            await firebaseApp.delete();
        } catch (e) {
            console.warn("⚠️ Could not delete old Firebase app:", e.message);
        }
    }

    // Initialize new Firebase app
    firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson)
    }, `firebase-app-${Date.now()}`);

    currentHash = newHash;

    return firebaseApp;
}

async function sendPushNotification({ notificationData }) {
    const firebase = await initializeFirebaseFromDB();

    try {
        const payload = {
            notification: {
                title: notificationData.title,
                body: notificationData.body,
            },
            android: {
                notification: {
                    priority: 'high',
                    sound: 'default'
                }
            },
            apns: {
                payload: {
                    aps: {
                        'mutable-content': 1,
                        sound: 'default',
                        badge: 1
                    }
                }
            },
            topic: 'all_users'
        };

        // Add image conditionally for Android
        if (notificationData.image) {
            payload.android.notification.imageUrl = notificationData.image;

            // Add image for iOS
            payload.apns.fcm_options = {
                image: notificationData.image
            };
        }

        console.log(payload);

        const response = await firebase.messaging().send(payload);
        console.log('✅ Successfully sent to all users:', response);
        return response;
    } catch (err) {
        console.error("❌ Failed to send notification:", err.message);
        throw err;
    }
}

module.exports = {
    sendPushNotification,
};
