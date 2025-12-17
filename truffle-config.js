/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation, and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * https://trufflesuite.com/docs/truffle/reference/configuration
 *
 * Hands-off deployment with Infura
 * --------------------------------
 *
 * Do you have a complex application that requires lots of transactions to deploy?
 * Use this approach to make deployment a breeze 🏖️:
 *
 * Infura deployment needs a wallet provider (like @truffle/hdwallet-provider)
 * to sign transactions before they're sent to a remote public node.
 * Infura accounts are available for free at 🔍: https://infura.io/register
 *
 * You'll need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. You can store your secrets 🤐 in a .env file.
 * In your project root, run `$ npm install dotenv`.
 * Create .env (which should be .gitignored) and declare your MNEMONIC
 * and Infura PROJECT_ID variables inside.
 * For example, your .env file will have the following structure:
 *
 * MNEMONIC = <Your 12 phrase mnemonic>
 * PROJECT_ID = <Your Infura project id>
 *
 * Deployment with Truffle Dashboard (Recommended for best security practice)
 * --------------------------------------------------------------------------
 *
 * Are you concerned about security and minimizing rekt status 🤔?
 * Use this method for best security:
 *
 * Truffle Dashboard lets you review transactions in detail, and leverages
 * MetaMask for signing, so there's no need to copy-paste your mnemonic.
 * More details can be found at 🔎:
 *
 * https://trufflesuite.com/docs/truffle/getting-started/using-the-truffle-dashboard/
 */

// require('dotenv').config();
// const { MNEMONIC, PROJECT_ID } = process.env;

// const HDWalletProvider = require('@truffle/hdwallet-provider');


require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const PRIVATE_KEY = "1de167648a46d5a0c4f49bbe39185ec1597a2cb7ff68eaf2bd583dbe53052222";
const URL = "https://eth-sepolia.g.alchemy.com/v2/Ksst5V1j5R1Y7irVUXRGy";

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a managed Ganache instance for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas: 6721975,      // Maksimalus Ganache limitas
      gasPrice: 20000000000 // Standartinė kaina
     },

    sepolia: {
      provider: () => new HDWalletProvider(
        [PRIVATE_KEY],
        URL
      ),
      network_id: "*", // Alchemy tiksliai žino Sepolia ID
      gas: 1500000,        // Sumažiname limitą iki 1.5M (kad tilptų į 0.04 ETH balansą)
      gasPrice: 20000000000, // 20 Gwei
      confirmations: 2,      // Alchemy veikia greitai, galime palaukti 2 patvirtinimus
      timeoutBlocks: 200,  
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21",    // Paliekame jūsų versiją
      settings: {          // Pridedame nustatymus
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "paris" // <--- SVARBU: Nurodome senesnę EVM versiją, kurią supranta Ganache
      }
    }
  }
};
