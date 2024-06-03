import React, { useState, useEffect } from 'react';
import useListedOwnedNFTs from '../graph/useListedOwnedNFTs';
import '../Styles/OwnedNFTs.css'; 
import { Contract, ethers } from 'ethers';
import { useContract } from "../Context/ContractContext"; 
import abi from "../../client/src/artifacts/contracts/MarketPlace.sol/NFTMarket.json";
import ConnectMetamask from './ConnectMetamask';

const NFT_MARKET_ADDRESS = import.meta.env.VITE_NFT_MARKET_ADDRESS;

const ListedOwnedNFTs = () => {
    const { contract, signer, address: account, requestAccount } = useContract();
    const nftMarket = new Contract(NFT_MARKET_ADDRESS, abi.abi, signer);
    const { ownedListedNFTs } = useListedOwnedNFTs(); 
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
        ownedListedNFTs.forEach((nft) => {
            getNFTDetails(nft);
        });
    }, [ownedListedNFTs]);

    return (
        <div className="owned-nfts-container">
            <ConnectMetamask />
            <h2>Listed and Owned NFTs</h2>
            <ul>
                {ownedListedNFTs &&
                    ownedListedNFTs.map((nft) => (
                        <li key={nft.id} className="nft-item">
                            {/* <img src={nft.tokenURI} alt={`NFT ${nft.id}`} className="nft-image" /> */}
                            <div className="nft-details">
                                ID: {nft.id}<br/> From: {nft.from}<br/> To: {nft.to}<br/> Price: {nft.price} <br/>   tokenURI: {nft.tokenURI}
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

export default ListedOwnedNFTs;
