const express = require("express");
const router = express.Router();
const { validateUrl, analyzeUrl } = require("../utils/anylizeUrl");

router.post('/check', async (req, res) => {
    console.log("Working")
    const { url } = req.body;
    if (!validateUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {
        const analysis = await analyzeUrl(url);
        res.status(200).json(analysis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error analyzing URL' });
    }
});

module.exports = router;