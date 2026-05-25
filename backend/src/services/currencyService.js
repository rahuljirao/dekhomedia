const https = require('https');
const GeoLocationService = require('./geoLocationService');

// Cache for exchange rates (cache for 1 hour)
let exchangeRatesCache = {
    rates: null,
    timestamp: null,
    baseCurrency: 'USD'
};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

class CurrencyService {

    /**
     * Fetch exchange rates from free API (exchangerate-api.com free tier or fallback)
     * Base currency is USD
     */
    static async fetchExchangeRates(fromCurrency) {
        // Check cache
        if (exchangeRatesCache.rates && exchangeRatesCache.timestamp) {
            const age = Date.now() - exchangeRatesCache.timestamp;
            if (age < CACHE_DURATION) {
                return exchangeRatesCache.rates;
            }
        }

        return new Promise((resolve) => {
            const options = {
                hostname: 'open.er-api.com',
                path: `/v6/latest/${fromCurrency || 'USD'}`,
                method: 'GET',
                timeout: 10000
            };

            const request = https.request(options, (response) => {
                let data = '';
                response.on('data', chunk => data += chunk);
                response.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (result.result === 'success' && result.rates) {
                            // Update cache
                            exchangeRatesCache = {
                                rates: result.rates,
                                timestamp: Date.now(),
                                baseCurrency: 'USD'
                            };
                            resolve(result.rates);
                        } else {
                            resolve(CurrencyService.getFallbackRates());
                        }
                    } catch (e) {
                        resolve(CurrencyService.getFallbackRates());
                    }
                });
            });

            request.on('error', () => {
                resolve(CurrencyService.getFallbackRates());
            });

            request.on('timeout', () => {
                request.destroy();
                resolve(CurrencyService.getFallbackRates());
            });

            request.end();
        });
    }

    /**
     * Fallback exchange rates (approximate rates as of 2024)
     */
    static getFallbackRates() {
        return {
            USD: 1,
            INR: 83.5,
            EUR: 0.92,
            GBP: 0.79,
            CAD: 1.36,
            AUD: 1.53,
            JPY: 149.5,
            CNY: 7.24,
            KRW: 1320,
            SGD: 1.34,
            HKD: 7.82,
            NZD: 1.64,
            CHF: 0.88,
            SEK: 10.45,
            NOK: 10.65,
            DKK: 6.87,
            MXN: 17.15,
            BRL: 4.97,
            ZAR: 18.65,
            AED: 3.67,
            SAR: 3.75,
            RUB: 92.5,
            THB: 35.5,
            MYR: 4.72,
            IDR: 15650,
            PHP: 56.2,
            VND: 24500,
            PKR: 278,
            BDT: 110,
            LKR: 325,
            NPR: 133,
            NGN: 1550,
            EGP: 30.9,
            KES: 153,
            GHS: 12.5,
            TRY: 32.5,
            PLN: 3.98,
            CZK: 22.8,
            HUF: 358,
            RON: 4.58,
            ILS: 3.65,
            CLP: 980,
            COP: 3950,
            PEN: 3.72,
            ARS: 870
        };
    }

    /**
     * Convert amount from USD to target currency
     */
    static async convertFromUSD(amountInUSD, targetCurrency) {
        const rates = await CurrencyService.fetchExchangeRates('USD');
        const rate = rates[targetCurrency?.toUpperCase()] || 1;

        const convertedAmount = amountInUSD * rate;

        // Round based on currency type
        if (GeoLocationService.isZeroDecimalCurrency(targetCurrency)) {
            return Math.round(convertedAmount);
        }

        return Math.round(convertedAmount * 100) / 100;
    }

    /**
     * Convert amount between any two currencies
     */
    static async convert(amount, fromCurrency, toCurrency) {
        if (fromCurrency?.toUpperCase() === toCurrency?.toUpperCase()) {
            return amount;
        }
        console.log(amount, fromCurrency, toCurrency, 'convert');

        const rates = await CurrencyService.fetchExchangeRates(fromCurrency);
        const fromRate = rates[fromCurrency?.toUpperCase()] || 1;
        const toRate = rates[toCurrency?.toUpperCase()] || 1;
        console.log(fromRate, toRate, 'convert');

        // Convert: amount in fromCurrency -> USD -> toCurrency
        const amountInUSD = amount / fromRate;
        const convertedAmount = amountInUSD * toRate;

        if (GeoLocationService.isZeroDecimalCurrency(toCurrency)) {
            return Math.round(convertedAmount);
        }

        return Math.round(convertedAmount * 100) / 100;
    }

    /**
     * Format amount with currency symbol
     */
    static formatAmount(amount, currency) {
        // Ensure amount is a valid number
        const numAmount = parseFloat(amount) || 0;
        const symbol = GeoLocationService.getCurrencySymbol(currency);

        if (GeoLocationService.isZeroDecimalCurrency(currency)) {
            return `${symbol}${Math.round(numAmount).toLocaleString()}`;
        }

        return `${symbol}${numAmount.toFixed(2)}`;
    }

    /**
     * Get amount in smallest currency unit (cents/paise)
     * For payment gateway APIs
     */
    static getAmountInSmallestUnit(amount, currency) {
        // Ensure amount is a valid number
        const numAmount = parseFloat(amount) || 0;

        if (GeoLocationService.isZeroDecimalCurrency(currency)) {
            return Math.round(numAmount);
        }
        return Math.round(numAmount * 100);
    }

    /**
     * Get plan price in user's currency with all details
     */
    static async getPlanPriceInCurrency(planAmount, fromCurrencySymbol, targetCurrency) {
        const fromCurrency = await GeoLocationService.getCurrencyInfoFromSymbol(fromCurrencySymbol);
        const convertedAmount = await CurrencyService.convert(planAmount, fromCurrency.currency, targetCurrency);
        const symbol = GeoLocationService.getCurrencySymbol(targetCurrency);

        return {
            originalAmount: planAmount,
            originalCurrency: 'USD',
            convertedAmount: convertedAmount,
            currency: targetCurrency,
            currencySymbol: symbol,
            formattedAmount: CurrencyService.formatAmount(convertedAmount, targetCurrency),
            amountInSmallestUnit: CurrencyService.getAmountInSmallestUnit(convertedAmount, targetCurrency)
        };
    }
}

module.exports = CurrencyService;
