require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_HTTP_URL_SEP = process.env.QUICKNODE_HTTP_URL_SEP
const QUICKNODE_HTTP_URL_MAT = process.env.QUICKNODE_HTTP_URL_MAT
const QUICKNODE_HTTP_URL = process.env.QUICKNODE_HTTP_URL

const BNB_MAINNET = process.env.BNB_MAINNET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 15000, // Increase the number of optimization runs
          },
          viaIR: true,
          evmVersion: `paris`
        },
      },
      {
        version: "0.4.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200, // Increase the number of optimization runs
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
      gasPrice: "auto",
      forking: {
        url:process.env.RPC_ADDR,
      },
    },

    sepolia: {
      url: QUICKNODE_HTTP_URL_SEP, // Use the URL from the environment variable
      accounts: [PRIVATE_KEY], // Use the private key from the environment variable
      gasPrice: "auto",
    },
    goerli: {
      url: QUICKNODE_HTTP_URL, // Use the URL from the environment variable
      accounts: [PRIVATE_KEY], // Use the private key from the environment variable
      gasPrice: "auto",
    },
    polygon_mumbai: {
      url: QUICKNODE_HTTP_URL_MAT, // Use the URL from the environment variable
      accounts: [PRIVATE_KEY], // Use the private key from the environment variable
      gasPrice: "auto",
    },
    bnb_mainnet: {
      url: BNB_MAINNET, // Use the URL from the environment variable
      accounts: [PRIVATE_KEY], // Use the private key from the environment variable
      gasPrice: "auto",
    },
  },
};
