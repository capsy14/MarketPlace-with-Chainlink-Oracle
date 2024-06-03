import React, { useState, useEffect } from 'react';
import { Contract, ethers } from 'ethers';
import useListedNFTs from '../graph/useListedNFT';
import "../Styles/ListNFTs.css"
import { useContract } from '../Context/ContractContext'; 
import abi from '../../client/src/artifacts/contracts/MarketPlace.sol/NFTMarket.json';
import ConnectMetamask from './ConnectMetamask';

const NFT_MARKET_ADDRESS = import.meta.env.VITE_NFT_MARKET_ADDRESS;

const ListNFT = () => {
  const { listedNFTs } = useListedNFTs();
  const { signer } = useContract();
  const [volume, setVolume] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nftNames, setNftNames] = useState({});
  const [nftDescriptions, setNftDescriptions] = useState({});
  const [nftImages, setNftImages] = useState({});

  const nftMarket = React.useMemo(() => {
    return new Contract(NFT_MARKET_ADDRESS, abi.abi, signer);
  }, [signer]);

  const getVolume = async () => {
    try {
      setLoading(true);
      const fetchedVolume = await nftMarket.volume();
      setVolume(fetchedVolume);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching volume:', error);
      setError('Error fetching volume');
      setLoading(false);
    }
  };

  useEffect(() => {
    getVolume();
  }, []);

  const buyNFT = async (nft) => {
    try {
      const priceInEth = Math.round((nft.price / volume) * 1e8) / 1e8;
      const transaction = await nftMarket.buyNFT(nft.id, {
        gasLimit: 100000,
        value: ethers.utils.parseEther(priceInEth.toString()),
      });
      await transaction.wait();
      alert('NFT purchased successfully!');
    } catch (error) {
      console.error('Failed to buy NFT:', error);
      alert('Failed to buy NFT. Please try again.');
    }
  };

  const fetchNFTData = async (tokenURI) => {
    try {
      const response = await fetch(tokenURI);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const tokenURIData = await response.json();
      return tokenURIData;
    } catch (error) {
      console.error('Error fetching tokenURI:', error);
      return {};
    }
  };

  const getNFTDetails = async (nft) => {
    const tokenURIData = await fetchNFTData(nft.tokenURI);
    const { name, description, image } = tokenURIData;
    setNftNames((prevNames) => ({ ...prevNames, [nft.id]: name }));
    setNftDescriptions((prevDescriptions) => ({ ...prevDescriptions, [nft.id]: description }));
    setNftImages((prevImages) => ({ ...prevImages, [nft.id]: image }));
  };

  useEffect(() => {
    listedNFTs.forEach((nft) => {
      getNFTDetails(nft);
    });
  }, [listedNFTs]);

  return (
    <div className="nft-list-container">
      <ConnectMetamask />
      <h2 className="nft-list-title">Listed NFTs</h2>
      {/* <button onClick={getVolume} disabled={loading} className="nft-button">Get Current Price in Eth</button>
      {loading && <p className="nft-loading">Loading...  </p>}
      {error && <p className="nft-error"></p>} */}
      <ul className="nft-list">
        {listedNFTs.map((nft) => (
          <li key={nft.id} className="nft-item">
            <p className="nft-token-id">TokenID: {nft.id}</p>
            <p className="nft-token-uri">TokenURI: {nft.tokenURI}</p>
            <p className="nft-owner">Owner: {nft.from}</p>

            <p className="nft-name">NFT Name: {nftNames[nft.id]}</p>
            <p className="nft-description">NFT Description: {nftDescriptions[nft.id]}</p>
            {nftImages[nft.id] ? (
              <p className="nft-image">
                <img src={nftImages[nft.id]} alt="NFT" className="image-list" />
              </p>
            ) : (
              <p className="nft-loading-image">Loading image...</p>
            )}
            <p className="nft-adjusted-price">
              {/* <button onClick={getVolume} disabled={loading} className="nft-button">Get Current Price in Eth</button> */}
              {loading && <p className="nft-loading">Loading...</p>}
              {error && <p className="nft-error"></p>}
              {!loading && volume > 0 ? (
                <p>Price in Ether: {nft.price / volume}</p>
              ) : (
                <button onClick={getVolume} disabled={loading} className="nft-button">Get Current Price of NFT in Eth</button>
              )}

            </p>
            <p className="nft-price">Price: {nft.price / 1e18} USD</p>
            <button onClick={() => buyNFT(nft)} className="nft-buy-button">Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListNFT;
