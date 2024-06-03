// ownedNFTs.jsx

import React, { useState , useEffect } from 'react';
import useOwnedNFTs from '../graph/useOwnedNFT';
import '../Styles/OwnedNFTs.css'; // Import the CSS file
import { Contract, ethers } from 'ethers';
import { useContract } from "../Context/ContractContext"; // Update the path as necessary
import abi from "../../client/src/artifacts/contracts/MarketPlace.sol/NFTMarket.json";
import ConnectMetamask from './ConnectMetamask';
const NFT_MARKET_ADDRESS = import.meta.env.VITE_NFT_MARKET_ADDRESS;

const OwnedNFTs = () => {

  const { contract, signer, address: account, requestAccount } = useContract();
  const nftMarket = new Contract(NFT_MARKET_ADDRESS, abi.abi, signer);
  const { ownedNFTs } = useOwnedNFTs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState("");
  const [nftNames, setNftNames] = useState({});
  const [nftDescriptions, setNftDescriptions] = useState({});
  const [nftImages, setNftImages] = useState({});


  const handleListNFTClick = (nft) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  const handleListNFT = async () => {
    if (parseFloat(price) <= 0) {
      alert("Price must be greater than 0.");
      return;
    }
    if (selectedNFT) {
      try {
//         const options = { gasLimit: 1000000 }; // Set the appropriate gas limit value

//   const contractCall0 = await nftMarket.li(options); // add - the name of the function.
        const priceInWei = ethers.utils.parseEther(price);
        const transaction = await nftMarket.listNFT(selectedNFT.id, priceInWei);
        await transaction.wait();

        // Close the modal after listing
        setIsModalOpen(false);
        setSelectedNFT(null);
        setPrice("");
      } catch (error) {
        console.error("Failed to list NFT:", error);
        alert("Failed to list NFT. Please try again.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNFT(null);
    setPrice("");
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
    ownedNFTs.forEach((nft) => {
      getNFTDetails(nft);
    });
  }, [ownedNFTs]);

  return (
    <div className="owned-nfts-container">
      <ConnectMetamask/>
      <h2>Owned NFTs</h2>

      <ul>
        {ownedNFTs &&
          ownedNFTs.map((nft) => (
            <li key={nft.id} className="nft-item">
              {/* <img src={nft.tokenURI} alt={`NFT ${nft.id}`} className="nft-image" /> */}
              <div className="nft-details">
                ID: {nft.id}<br/> From: {nft.from}<br/> To: {nft.to}<br/> Price: {nft.price}
              </div>
              <p className="nft-name">NFT Name: {nftNames[nft.id]}</p>
            <p className="nft-description">NFT Description: {nftDescriptions[nft.id]}</p>
              {nftImages[nft.id] ? (
              <p className="nft-image">
                <img src={nftImages[nft.id]} alt="NFT" className="image-list" />
              </p>
            ) : (
              <p className="nft-loading-image">Loading image...</p>
            )}
              {nft.price === "0" && (
                <button className="list-nft-button" onClick={() => handleListNFTClick(nft)}>
                  List this NFT
                </button>
              )}
            </li>
          ))}
      </ul>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>List NFT</h3>
            <p>ID: {selectedNFT && selectedNFT.id}</p>
            <label>
              Price:
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price in ETH"
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleListNFT}>List</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnedNFTs;
