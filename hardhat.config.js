require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28", // Specify the Solidity version
  networks: {
    hardhat: {
      chainId: 1337, // Default chain ID for local development
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/YOUR_INFURA_API_KEY", // Replace with your Infura API key
      accounts: ["YOUR_PRIVATE_KEY"], // Replace with your private key
      chainId: 4, // Rinkeby's chain ID
    },
  },
};