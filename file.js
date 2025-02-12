const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const dns = require('dns');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Example list of legitimate domains
const LEGIT_DOMAINS = ['uniswap.org', 'opensea.io'];

// Function to verify a domain
function isLegitimateDomain(domain) {
  return LEGIT_DOMAINS.includes(domain);
}

// Endpoint to check a URL
app.get('/verify', async (req, res) => {
  const { url } = req.query;

  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    // Step 1: Check if the domain is legitimate
    if (!isLegitimateDomain(domain)) {
      return res.status(400).json({ error: 'Phishing attempt detected!' });
    }

    res.json({ message: 'URL is safe.' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL format.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));