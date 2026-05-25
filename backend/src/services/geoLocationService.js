const http = require('http');
const { db } = require('../common/db');

// Country to currency mapping
const COUNTRY_CURRENCY_MAP = {
    'US': { currency: 'USD', symbol: '$', name: 'US Dollar' },
    'IN': { currency: 'INR', symbol: '₹', name: 'Indian Rupee' },
    'GB': { currency: 'GBP', symbol: '£', name: 'British Pound' },
    'EU': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'CA': { currency: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    'AU': { currency: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    'JP': { currency: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    'CN': { currency: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    'KR': { currency: 'KRW', symbol: '₩', name: 'South Korean Won' },
    'SG': { currency: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    'HK': { currency: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    'NZ': { currency: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    'CH': { currency: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    'SE': { currency: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    'NO': { currency: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    'DK': { currency: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    'MX': { currency: 'MXN', symbol: '$', name: 'Mexican Peso' },
    'BR': { currency: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    'ZA': { currency: 'ZAR', symbol: 'R', name: 'South African Rand' },
    'AE': { currency: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    'SA': { currency: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    'RU': { currency: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    'TH': { currency: 'THB', symbol: '฿', name: 'Thai Baht' },
    'MY': { currency: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    'ID': { currency: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    'PH': { currency: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    'VN': { currency: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
    'PK': { currency: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    'BD': { currency: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    'LK': { currency: 'LKR', symbol: '₨', name: 'Sri Lankan Rupee' },
    'NP': { currency: 'NPR', symbol: '₨', name: 'Nepalese Rupee' },
    'NG': { currency: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    'EG': { currency: 'EGP', symbol: '£', name: 'Egyptian Pound' },
    'KE': { currency: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    'GH': { currency: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
    'TR': { currency: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    'PL': { currency: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    'CZ': { currency: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    'HU': { currency: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    'RO': { currency: 'RON', symbol: 'lei', name: 'Romanian Leu' },
    'IL': { currency: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
    'CL': { currency: 'CLP', symbol: '$', name: 'Chilean Peso' },
    'CO': { currency: 'COP', symbol: '$', name: 'Colombian Peso' },
    'PE': { currency: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
    'AR': { currency: 'USD', symbol: '$', name: 'US Dollar' },
    // 'AR': { currency: 'ARS', symbol: '$', name: 'Argentine Peso' },
    // 'UY': { currency: 'UYU', symbol: '$', name: 'Uruguayan Peso' },
    'UY': { currency: 'USD', symbol: '$', name: 'US Dollar' },
    'DE': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'FR': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'IT': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'ES': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'NL': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'BE': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'AT': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'PT': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'IE': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'FI': { currency: 'EUR', symbol: '€', name: 'Euro' },
    'GR': { currency: 'EUR', symbol: '€', name: 'Euro' },
};

// Stripe supported currencies (lowercase)
const STRIPE_SUPPORTED_CURRENCIES = [
    'usd', 'aed', 'afn', 'all', 'amd', 'ang', 'aoa', 'ars', 'aud', 'awg', 'azn',
    'bam', 'bbd', 'bdt', 'bgn', 'bif', 'bmd', 'bnd', 'bob', 'brl', 'bsd', 'bwp',
    'byn', 'bzd', 'cad', 'cdf', 'chf', 'clp', 'cny', 'cop', 'crc', 'cve', 'czk',
    'djf', 'dkk', 'dop', 'dzd', 'egp', 'etb', 'eur', 'fjd', 'fkp', 'gbp', 'gel',
    'gip', 'gmd', 'gnf', 'gtq', 'gyd', 'hkd', 'hnl', 'hrk', 'htg', 'huf', 'idr',
    'ils', 'inr', 'isk', 'jmd', 'jpy', 'kes', 'kgs', 'khr', 'kmf', 'krw', 'kyd',
    'kzt', 'lak', 'lbp', 'lkr', 'lrd', 'lsl', 'mad', 'mdl', 'mga', 'mkd', 'mmk',
    'mnt', 'mop', 'mro', 'mur', 'mvr', 'mwk', 'mxn', 'myr', 'mzn', 'nad', 'ngn',
    'nio', 'nok', 'npr', 'nzd', 'pab', 'pen', 'pgk', 'php', 'pkr', 'pln', 'pyg',
    'qar', 'ron', 'rsd', 'rub', 'rwf', 'sar', 'sbd', 'scr', 'sek', 'sgd', 'shp',
    'sll', 'sos', 'srd', 'std', 'szl', 'thb', 'tjs', 'top', 'try', 'ttd', 'twd',
    'tzs', 'uah', 'ugx', 'uyu', 'uzs', 'vnd', 'vuv', 'wst', 'xaf', 'xcd', 'xof',
    'xpf', 'yer', 'zar', 'zmw'
];

// Razorpay supported currencies
const RAZORPAY_SUPPORTED_CURRENCIES = ['INR', 'USD'];

// Zero decimal currencies (no cents/paise)
const ZERO_DECIMAL_CURRENCIES = [
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF',
    'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
];

class GeoLocationService {

    /**
     * Get IP address from request
     */
    static getIpFromRequest(req) {
        const forwarded = req.headers?.['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        return req.headers?.['x-real-ip'] ||
               req.connection?.remoteAddress ||
               req.socket?.remoteAddress ||
               'unknown';
    }

    /**
     * Check if IP is private/local
     */
    static isPrivateIp(ip) {
        if (!ip || ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
            return true;
        }
        if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
            return true;
        }
        if (ip.startsWith('::ffff:127.') || ip.startsWith('::ffff:192.168.') ||
            ip.startsWith('::ffff:10.') || ip.startsWith('::ffff:172.')) {
            return true;
        }
        return false;
    }

    /**
     * Get country from IP using free ip-api.com service
     */
    static async getCountryFromIp(ip) {
        return new Promise((resolve) => {
            if (GeoLocationService.isPrivateIp(ip)) {
                resolve(null);
                return;
            }

            let cleanIp = ip;
            if (ip.startsWith('::ffff:')) {
                cleanIp = ip.substring(7);
            }

            const options = {
                hostname: 'ip-api.com',
                path: `/json/${cleanIp}?fields=status,message,country,countryCode`,
                method: 'GET',
                timeout: 3000
            };

            const request = http.request(options, (response) => {
                let data = '';
                response.on('data', chunk => data += chunk);
                response.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (result.status === 'success' && result.countryCode) {
                            resolve({
                                countryCode: result.countryCode,
                                country: result.country
                            });
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                });
            });

            request.on('error', () => resolve(null));
            request.on('timeout', () => {
                request.destroy();
                resolve(null);
            });
            request.end();
        });
    }

    /**
     * Get currency info for a country code
     */
    static getCurrencyForCountry(countryCode) {
        const currencyInfo = COUNTRY_CURRENCY_MAP[countryCode?.toUpperCase()];
        if (currencyInfo) {
            return currencyInfo;
        }
        return { currency: 'USD', symbol: '$', name: 'US Dollar' };
    }

    /**
     * Get currency info from currency symbol
     */
    static getCurrencyInfoFromSymbol(symbol) {
        for (const [countryCode, info] of Object.entries(COUNTRY_CURRENCY_MAP)) {
            if (info.symbol === symbol) {
                return { countryCode, ...info };
            }
        }
        return { countryCode: 'US', currency: 'USD', symbol: '$', name: 'US Dollar' };
    }

    /**
     * Get full location and currency info from request (IP-based only)
     * Falls back to app_data defaults if IP lookup fails
     */
    static async getLocationAndCurrency(req) {
        const ip = GeoLocationService.getIpFromRequest(req);
        // const testIp = "::1";

        // Try IP geolocation first
        const ipResult = await GeoLocationService.getCountryFromIp(ip);
        if (ipResult) {
            const currencyInfo = GeoLocationService.getCurrencyForCountry(ipResult.countryCode);
            return {
                countryCode: ipResult.countryCode,
                country: ipResult.country,
                currency: currencyInfo.currency,
                currencySymbol: currencyInfo.symbol,
                currencyName: currencyInfo.name,
                detectionMethod: 'ip_geolocation',
                ip: ip
            };
        }

        // Fallback to app_data defaults
        try {
            const [appDataRows] = await db.query('SELECT * FROM app_data WHERE id = ?', [1]);
            if (appDataRows && appDataRows.length > 0) {
                const appData = appDataRows[0];
                const currencyInfo = GeoLocationService.getCurrencyInfoFromSymbol(appData.currency_symbol);
                return {
                    countryCode: currencyInfo.countryCode,
                    country: appData.country || currencyInfo.countryCode,
                    currency: currencyInfo.currency,
                    currencySymbol: appData.currency_symbol || currencyInfo.symbol,
                    currencyName: currencyInfo.name,
                    detectionMethod: 'app_data_default',
                    ip: ip
                };
            }
        } catch (err) {
            console.log('Error fetching app_data:', err);
        }

        // Final fallback to US
        return {
            countryCode: 'US',
            country: 'United States',
            currency: 'USD',
            currencySymbol: '$',
            currencyName: 'US Dollar',
            detectionMethod: 'default',
            ip: ip
        };
    }

    /**
     * Check if currency is supported by Stripe
     */
    static isStripeSupportedCurrency(currency) {
        return STRIPE_SUPPORTED_CURRENCIES.includes(currency?.toLowerCase());
    }

    /**
     * Check if currency is supported by Razorpay
     */
    static isRazorpaySupportedCurrency(currency) {
        return RAZORPAY_SUPPORTED_CURRENCIES.includes(currency?.toUpperCase());
    }

    /**
     * Check if currency is zero decimal (no cents)
     */
    static isZeroDecimalCurrency(currency) {
        return ZERO_DECIMAL_CURRENCIES.includes(currency?.toUpperCase());
    }

    /**
     * Get currency symbol from currency code
     */
    static getCurrencySymbol(currency) {
        for (const [, info] of Object.entries(COUNTRY_CURRENCY_MAP)) {
            if (info.currency === currency?.toUpperCase()) {
                return info.symbol;
            }
        }
        return '$';
    }
}

module.exports = GeoLocationService;
