const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();
const { db } = require("./db");

class GooglePlayService {
    constructor() {
        this.packageName = process.env.PACKAGE_NAME;
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            const [rows] = await db.query('SELECT firebase_json FROM site_settings WHERE id = ?', [1]);

            if (!rows || rows.length === 0) throw new Error("No Firebase credentials found");

            const jsonStr = rows[0].firebase_json;

            const credentials = JSON.parse(jsonStr);
            
            this.auth = new google.auth.GoogleAuth({
                credentials: credentials,
                scopes: ['https://www.googleapis.com/auth/androidpublisher']
            });

            this.androidPublisher = google.androidpublisher({
                version: 'v3',
                auth: await this.auth.getClient()
            });

            console.log('Google Play API initialized successfully');
        } catch (error) {
            console.error('Error initializing Google Play API:', error);
            throw error;
        }
    }

    async verifyPurchase(productId, purchaseToken) {
        try {
            
            if (!this.androidPublisher) {
                await this.initializeAuth();
            }
            const response = await this.androidPublisher.purchases.products.get({
                packageName: this.packageName,
                productId: productId,
                token: purchaseToken
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Purchase verification error:', error);
            return {
                success: false,
                error: error.message,
                details: error.response?.data || {}
            };
        }
    }

    async consumePurchase(productId, purchaseToken) {
        try {
            if (!this.androidPublisher) {
                await this.initializeAuth();
            }

            await this.androidPublisher.purchases.products.consume({
                packageName: this.packageName,
                productId: productId,
                token: purchaseToken
            });

            console.log('✅ Purchase consumed - User can buy this product again');
            return { success: true };
        } catch (error) {
            console.error('❌ Consume error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Keep acknowledge method for non-consumable products
    async acknowledgePurchase(productId, purchaseToken) {
        try {
            await this.androidPublisher.purchases.products.acknowledge({
                packageName: this.packageName,
                productId: productId,
                token: purchaseToken
            });

            return { success: true };
        } catch (error) {
            console.error('Acknowledge error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new GooglePlayService();