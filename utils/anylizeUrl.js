const axios = require('axios');
const whois = require('whois');
const validator = require('validator');
const tldts = require('tldts');
require('dotenv').config();
// Validate URL format
const validateUrl = (url) => validator.isURL(url);

// Analyze URL
const analyzeUrl = async (url) => {
    let report = { url };

    // Check HTTPS
    report.isHttps = url.startsWith('https://');

    // Check WHOIS data
    try {
        report.whois = await getWhoisData(url);
    } catch (error) {
        report.whois = 'Could not fetch WHOIS data';
    }

    // Check Google Safe Browsing API (replace with your API key)
    try {
        const googleSafeBrowsingResult = await checkGoogleSafeBrowsing(url);
        report.safeBrowsing = googleSafeBrowsingResult;
    } catch (error) {
        report.safeBrowsing = 'Error with Google Safe Browsing';
    }

    return report;
};

// Helper to get WHOIS data
const getWhoisData = (inputUrl) => {

    return new Promise((resolve, reject) => {
        try {
            // Validate and parse the URL
            const rootDomain = tldts.getDomain(inputUrl); // Extracts root domain (e.g., "youtube.com")
            if (!rootDomain) throw new Error('Invalid domain or URL');

            // Perform WHOIS lookup
            whois.lookup(rootDomain, (err, data) => {
                if (err) return reject(new Error(`WHOIS lookup failed: ${err.message}`));
                resolve(data);
            });
        } catch (error) {
            reject(new Error(`Error processing URL: ${error.message}`));
        }
    });
};


// Helper to check Google Safe Browsing
const checkGoogleSafeBrowsing = async (url) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    if (!apiKey) throw new Error("Google API Key is missing from environment variables!");
    const body = {
        client: {
            clientId: 'yourcompany',
            clientVersion: '1.0',
        },
        threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
        },
    };

    const response = await axios.post(apiUrl, body);
    if (response.data && response.data.matches) {
        return 'Malicious';
    } else {
        return 'Safe';
    }
};

module.exports = { validateUrl, analyzeUrl };
