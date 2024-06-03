import React, { useState } from "react";
import axios from "axios";
import { useContract } from "../Context/ContractContext"; 
import ConnectMetamask from "./ConnectMetamask";

const CreateNFTs = () => {
  const { contract, signer, address: account, requestAccount } = useContract();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [uri, setUri] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !name || !description) {
      alert("Please complete all fields before submitting.");
      return;
    }

    if (!contract) {
      alert("Contract is not initialized. Please connect your wallet.");
      return;
    }

    setLoading(true);

    try {
      // Upload the image to IPFS via Pinata
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

      // Upload metadata to IPFS
      const metadata = {
        name,
        description,
        image: imgHash
      };

      const resMetadata = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: metadata,
        headers: {
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
          "Content-Type": "application/json",
        },
      });

      const metadataURI = `https://gateway.pinata.cloud/ipfs/${resMetadata.data.IpfsHash}`;
      setUri(metadataURI);

      // Call the createNFT function on the contract
      const tx = await contract.connect(signer).createNFT(metadataURI);
      await tx.wait();

      alert("NFT created successfully.");
      setFileName("No image selected");
      setFile(null);
      setName('');
      setDescription('');
    } catch (error) {
      console.error("Error creating NFT:", error);
      alert("An error occurred while creating the NFT. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const retrieveFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="top-container">
      <ConnectMetamask/>
      <h2>
        Create NFTs
        </h2> 
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          className="chooseimg"
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="Imagesall">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>
      {uri && (
        <div>
          <p>IPFS URI: <a href={uri} target="_blank" rel="noopener noreferrer">{uri}</a></p>
        </div>
      )}
    </div>
  );
};

export default CreateNFTs;
