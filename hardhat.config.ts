import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "hardhat-abi-exporter";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
   //custom network
  //  etherscan: {
  //   apiKey: {
  //     polygonAmoy:"BFZRN5J8PB4SQP9BI5Y2PS842M6F15CU8P",
  //   },
  //   customChains: [
  //     {
  //       network: "polygonAmoy",
  //       chainId: 80002,
  //       urls: {
  //         apiURL: "https://api-amoy.polygonscan.com/api",
  //         browserURL: "https://amoy.polygonscan.com"
  //       },
  //     }
  //   ]
  // },

  //----------
  networks: {
    bsc: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: [process.env.PRIVATE_KEY!].filter(Boolean),
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/6GGPz9eXUlycxror02Qnmg1nPEeIGIuY`,
      accounts: [process.env.PRIVATE_KEY!].filter(Boolean),
    },
    mumbai: {
      url: `https://polygon-mumbai-pokt.nodies.app`,
      accounts: process.env.MNEMONIC
        ? { mnemonic: process.env.MNEMONIC }
        : [process.env.PRIVATE_KEY!].filter(Boolean),
    },
    amoy: {
      url: `https://api.tatum.io/v3/blockchain/node/polygon-amoy`,
      accounts: process.env.MNEMONIC
        ? { mnemonic: process.env.MNEMONIC }
        : [process.env.PRIVATE_KEY!].filter(Boolean),
    },
    geth: {
      url: `http://localhost:8552`,
      accounts: [process.env.PRIVATE_KEY!].filter(Boolean),
    },
    livegeth: {
      url: `http://127.0.0.1:8552`,
      accounts: [process.env.PRIVATE_KEY!].filter(Boolean),
    },
    mainnet: {
      url: `https://polygon-rpc.com`,
      accounts: process.env.MNEMONIC
        ? { mnemonic: process.env.MNEMONIC }
        : [process.env.PRIVATE_KEY!].filter(Boolean),
    },
    hardhat: {
      forking: {
        url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
        blockNumber: 42424017
        , // Use a specific block number
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: "./typechain",
  },
  abiExporter: {
    path: "./abis",
    except: ["IPockies"],
    only: ["Pockies"],
  },
  gasReporter: {
    enabled: !process.env.CI,
    currency: "USD",
    gasPrice: 80,
    src: "contracts",
    coinmarketcap: "7643dfc7-a58f-46af-8314-2db32bdd18ba",
  },
};

export default config;
