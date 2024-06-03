import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from "../../client/src/artifacts/contracts/MarketPlace.sol/NFTMarket.json";
const NFT_MARKET_ADDRESS = import.meta.env.VITE_NFT_MARKET_ADDRESS;

const ContractContext = createContext();

export const useContract = () => {
  return useContext(ContractContext);
};

export const ContractProvider = ({ children }) => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(() => {
    return localStorage.getItem('userAddress') || 'Connect Wallet';
  });
  const contractAddress = NFT_MARKET_ADDRESS;
  const { ethereum } = window;

  useEffect(() => {
    // Check if user is already connected on component mount
    if (ethereum && ethereum.selectedAddress) {
      setAddress(ethereum.selectedAddress);
    }
  }, []);

  const requestAccount = async () => {
    if (!ethereum) {
      alert("MetaMask is not installed");
      return;
    }

    await ethereum.request({
      method: "wallet_requestPermissions",
      params: [{
        eth_accounts: {}
      }]
    });

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const userAddress = accounts[0];
    setAddress(userAddress);
    setConnected(true);
    localStorage.setItem('userAddress', userAddress);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);

    setState({ provider, signer, contract });
  };

  return (
    <ContractContext.Provider value={{ ...state, address, requestAccount, connected }}>
      {children}
    </ContractContext.Provider>
  );
};
