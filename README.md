# NFT Marketplace with Chainlink Oracle Integration

## Overview

This project showcases an NFT marketplace smart contract that leverages the Chainlink testnet oracle to make API requests from CryptoCompare. The oracle fetches the latest ETH price in USD, allowing users to list NFTs for sale in USD, with the payment converted to ETH at the time of the transaction. The marketplace takes a 10% commission from each successful trade, which is transferred to the admin (contract deployer).

 - BUY NFT

   
![image](https://github.com/capsy14/NFT-MarketPlace/assets/122152312/c20dadac-c6f3-4d1e-8d7e-7da7a40ed175)
 - Listed and Owned NFTs

   
![image](https://github.com/capsy14/NFT-MarketPlace/assets/122152312/f2e089d2-d7b0-4d43-8b45-9930f9534fbf)
 - Owned NFTs

   
![image](https://github.com/capsy14/NFT-MarketPlace/assets/122152312/2f0a360b-47a4-43a4-92b1-882e427689aa)


## Features

- **Oracle Integration**: Uses Chainlink testnet oracle to get the latest ETH price in USD from CryptoCompare.
- **NFT Listing**: Users can list their NFTs for sale in USD.
- **ETH Payment**: Buyers are charged in ETH equivalent to the USD price at the time of the sale.
- **Admin Commission**: 10% commission from each successful trade goes to the wallet that deployed the contract.
- **The GRAPH**: Uses The Graph to index all NFTs and provides a GraphQL schema for querying.

## Tech Stack

- **Solidity**: Smart contract development.
- **Vite**: Frontend build tool.
- **React**: Frontend framework.
- **TypeScript**: Type-safe JavaScript.
- **The Graph**: Indexing protocol for querying blockchain data.
- **ethers.js**: Library for interacting with the Ethereum blockchain.
- **Hardhat**: Ethereum development environment.

## Setup

### Prerequisites

- Node.js and npm installed.
- A GitHub account to clone the repository.
- Access to the Sepolia testnet.
- Pinata account for IPFS storage.

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/capsy14/NFT-MarketPlace
   cd NFT-MarketPlace

2. **Install Dependencies**

    ```sh
    npm install

3. **Create an .env file**   
    - In the project root, create a .env file with the following content:
    ```sh
    SEPOLIA_URL=<Your_Sepolia_Testnet_URL>
    VITE_PINATA_API_KEY=<Your_Pinata_API_Key>
    VITE_PINATA_SECRET_API_KEY=<Your_Pinata_Secret_API_Key>
    VITE_PUBLIC_GRAPH_URL=<Your_GraphQL_API_URL>
    VITE_NFT_MARKET_ADDRESS=<Your_NFT_Marketplace_Contract_Address>

4. **Install Graph CLI**
    ```sh
    npm install -g @graphprotocol/graph-cli

5. **Create a Subgraph**
    ```sh
    graph init --product hosted-service <GITHUB_USER>/<SUBGRAPH_NAME>

6. **Configure Subgraph**


Update the subgraph.yaml file with the necessary configurations including the contract address and ABI.

7. **Deploy Subgraph**
    ```sh
    graph auth --product hosted-service <ACCESS_TOKEN>
    graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH_NAME>



8. **Start the development server**

    ```sh
    npm run dev


## Smart Contract Details
- NFT Marketplace
The smart contract allows users to list NFTs for sale and buyers to purchase them using ETH. The listing price is specified in USD, and the contract uses the Chainlink oracle to fetch the current ETH/USD exchange rate to determine the equivalent ETH amount. Upon a successful purchase, 10% of the sale price is sent to the admin.


![image](https://github.com/capsy14/NFT-MarketPlace/assets/122152312/c4890826-27e4-4619-8534-3b9da8ddae09)

- Commission
The contract is designed to take a 10% commission from every sale, which is automatically transferred to the admin's address.


![image](https://github.com/capsy14/NFT-MarketPlace/assets/122152312/f6098eac-ef99-4ee3-997c-d46e24f52bd5)


- GraphQL Integration
The project uses The Graph to index all NFTs. This allows efficient querying of NFT data through a GraphQL API. The schema includes the necessary types and queries to fetch NFT details, listings, and sale information.  

![image](https://github.com/capsy14/NFT-MarketPlace/assets/122152312/88634298-ff6d-417a-b4d8-602bdff06ef1)

![image](https://github.com/capsy14/NFT-MarketPlace/assets/122152312/c1423f1d-fcdc-45a0-a0ae-eec0552e09ca)

Test the project at : 
[NFTMarketPlace](https://nft-market-place-roan-sigma.vercel.app/)

## Author
Made by Kartik Bhatt
