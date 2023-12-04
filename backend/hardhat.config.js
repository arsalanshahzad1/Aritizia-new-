require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_HTTP_URL = process.env.QUICKNODE_HTTP_URL;
const QUICKNODE_HTTP_URL_SEP = process.env.QUICKNODE_HTTP_URL_SEP
const QUICKNODE_HTTP_URL_MAT = process.env.QUICKNODE_HTTP_URL_MAT
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_GOERLI = process.env.PRIVATE_KEY_GOERLI;

module.exports = {
  solidity: {
    compilers: [
      // {
      //   version: "0.8.0",
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200, // Increase the number of optimization runs
      //     },
      //   },
      // },
      // {
      //   version: "0.6.12",
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200, // Increase the number of optimization runs
      //     },
      //   },
      // },
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
      
      // {
      //   version: "0.5.0",
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200, // Increase the number of optimization runs
      //     },
      //   },
      // },
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
        // url: `https://polygon-mainnet.g.alchemy.com/v2/8JkHo3qUxg6xK4OpBBG7XrfND3pZL0ig`,
        url:"https://eth-mainnet.g.alchemy.com/v2/hmgNbqVFAngktTuwmAB2KceU06IJx-Fh",
        // url: "https://eth.merkle.io"
        //   url: `https://bsc-dataseed1.binance.org/`,
        // url : "https://wiser-wider-valley.bsc.discover.quiknode.pro/050ea5d25ccade9d764fac15bd4709b810d543a1/"
      },
    },

    sepolia: {
      url: QUICKNODE_HTTP_URL_SEP, // Use the URL from the environment variable
      accounts: [PRIVATE_KEY], // Use the private key from the environment variable
      gasPrice: "auto",
    },
    // goerli: {
    //   url: QUICKNODE_HTTP_URL, // Use the URL from the environment variable
    //   accounts: [PRIVATE_KEY], // Use the private key from the environment variable
    //   gasPrice: "auto",
    // },
    polygon_mumbai: {
      url: QUICKNODE_HTTP_URL_MAT, // Use the URL from the environment variable
      accounts: [PRIVATE_KEY], // Use the private key from the environment variable
      gasPrice: "auto",
    },
  },
};
