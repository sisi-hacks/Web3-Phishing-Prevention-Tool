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

// Example list of legitimate smart contract addresses
const LEGIT_CONTRACT_ADDRESSES = {
  ethereum: ['DEPLOYED_CONTRACT_ADDRESS'], // Replace with the actual address
};

// Function to verify a domain
function isLegitimateDomain(domain) {
  return LEGIT_DOMAINS.includes(domain);
}

// Function to check SSL certificate
async function isValidSSL(url) {
  try {
    const parsedUrl = new URL(url); // Parse the URL
    const hostname = parsedUrl.hostname;

    // Use Node.js HTTPS module for more reliable SSL validation
    return new Promise((resolve, reject) => {
      const https = require('https');
      https.get(hostname, { timeout: 5000 }, (res) => {
        console.log('SSL Status Code:', res.statusCode); // Debugging log
        console.log('Socket Authorized:', res.socket.authorized); // Debugging log

        if (res.statusCode === 200 && res.socket.authorized) {
          resolve(true); // SSL is valid
        } else {
          resolve(false); // SSL is invalid or not authorized
        }
      }).on('error', () => {
        resolve(false); // Resolve as false on error
      });
    });
  } catch (error) {
    console.error('URL Parsing Error:', error.message); // Log parsing errors
    return false; // Return false if URL parsing fails
  }
}

// Function to verify a smart contract address
function isLegitimateContract(chainId, contractAddress) {
  return LEGIT_CONTRACT_ADDRESSES[chainId]?.includes(contractAddress.toLowerCase()) || false;
}

// Function to detect suspicious patterns in URLs
function isSuspicious(url) {
  try {
    const domain = new URL(url).hostname;

    // Check for common phishing patterns
    if (
      domain.includes('uniswapp') || // Typosquatting
      domain.includes('0pensea') || // Obfuscated characters
      domain.includes('bit.ly') || // Shortened links
      domain.includes('redirect') || // Redirects
      domain.split('.').length > 3 // Excessive subdomains
    ) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Invalid URL Format:', error.message); // Log invalid URL errors
    return true; // Treat invalid URLs as suspicious
  }
}

// Function to hash user reports for crowdsourced database
function hashUrl(url) {
  return crypto.createHash('sha256').update(url).digest('hex');
}

// In-memory database for user reports (replace with a real database)
const REPORTED_URLS = {};

// Endpoint to check a URL
app.get('/verify', async (req, res) => {
  const { url, chainId, contractAddress } = req.query;

  try {
    // Step 1: Check if the URL is malformed
    const parsedUrl = new URL(url);

    // Step 2: Extract domain from URL
    const domain = parsedUrl.hostname;

    // Step 3: Check if the domain is legitimate
    if (!isLegitimateDomain(domain)) {
      return res.status(400).json({ error: 'Phishing attempt detected!' });
    }

    // Step 4: Check SSL certificate
    if (!(await isValidSSL(url))) {
      return res.status(400).json({ error: 'Invalid SSL certificate!' });
    }

    // Step 5: Check for suspicious patterns
    if (isSuspicious(url)) {
      return res.status(400).json({ error: 'Suspicious URL detected!' });
    }

    // Step 6: Verify smart contract address (if applicable)
    if (contractAddress && !isLegitimateContract(chainId, contractAddress)) {
      return res.status(400).json({ error: 'Invalid smart contract address!' });
    }

    res.json({ message: 'URL is safe.' });
  } catch (error) {
    console.error('Error verifying URL:', error.message); // Log any remaining errors
    res.status(400).json({ error: 'Error verifying URL.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));