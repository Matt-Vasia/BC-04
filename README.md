# BC-04: CrowdFunding Decentralized Application (DApp)

A decentralized crowdfunding platform built on the Ethereum blockchain. This DApp allows users to contribute ETH to a campaign, track progress, and claim refunds if goals aren't met.

## 🌟 Features

- **Contribute:** Users can send ETH to support the project.
- **Goal Tracking:** Real-time updates on raised amounts versus the target.
- **Time Management:** Automatic deadline enforcement with a countdown timer.
- **Manager Withdrawal:** The project creator can withdraw funds if the target is met.
- **Refund System:** Contributors can claim refunds if the target is not met by the deadline.
- **Live UI:** Interactive frontend using Web3.js and jQuery.

## 🛠 Technology Stack

- **Smart Contracts:** Solidity (v0.8.21)
- **Blockchain Framework:** Truffle
- **Frontend:** HTML, CSS, JavaScript, jQuery, Web3.js
- **Local Development:** Ganache
- **Wallet:** MetaMask

## 📋 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Truffle](https://trufflesuite.com/truffle/) (`npm install -g truffle`)
- [Ganache](https://trufflesuite.com/ganache/) (for local blockchain)
- [MetaMask](https://metamask.io/) browser extension

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Matt-Vasia/BC-04.git
   cd BC-04
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ⚙️ Configuration

1. **Environment Variables:**
   Create a `.env` file in the root directory to store your secrets (especially for testnet deployment).
   ```env
   MNEMONIC="your twelve word mnemonic phrase..."
   INFURA_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
   ```

2. **Truffle Config:**
   The project is configured to work with:
   - **Development:** Ganache on port `7545`.
   - **Sepolia:** Via Alchemy/Infura provider.

## ⛓️ Deployment

### Local Development (Ganache)
1. Open **Ganache** and start a workspace (ensure port is 7545).
2. Deploy contracts:
   ```bash
   truffle migrate --network development
   ```
   *Note: The migration script (`2_deploy_contracts.js`) deploys the contract with a target of 10 ETH and a duration of 10 minutes.*

### Testnet (Sepolia)
1. Ensure you have Sepolia ETH in your wallet.
2. Deploy:
   ```bash
   truffle migrate --network sepolia
   ```

## 🖥️ Running the Frontend

1. Start the local development server:
   ```bash
   npm run dev
   ```
   This command runs `lite-server` which serves the `src` folder and connects it to the compiled contracts.

2. Open your browser at `http://localhost:3000`.

3. **Connect MetaMask:**
   - Switch MetaMask network to **Localhost 7545** (for Ganache) or **Sepolia**.
   - **Tip:** Import a Ganache account into MetaMask using its private key to have test ETH available immediately.
   - Refresh the page and connect your wallet when prompted.

## 📂 Project Structure

- `contracts/`: Solidity smart contracts (`CrowdFunding.sol`).
- `migrations/`: JavaScript scripts to deploy contracts to the blockchain.
- `src/`: Frontend source code (`index.html`, `app.js`).
- `test/`: Smart contract tests.
- `truffle-config.js`: Truffle network and compiler configuration.

## 📜 License

ISC


