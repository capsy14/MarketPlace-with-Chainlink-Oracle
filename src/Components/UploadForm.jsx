import React, { useState } from 'react';
import axios from 'axios';
import { useContract } from '../Context/ContractContext'; 

const UploadForm = () => {
  const { address } = useContract();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [uri, setUri] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', file);

    try {
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
      setUri(imgHash);
      console.log(uri);
    } catch (error) {
      setError(error.response.data.error);
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
    <div>
      <h2>Upload Form</h2>
      {error && <p>Error: {error}</p>}
      {uri && <p>URI: {uri}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="file-upload" className="choose">
            Choose Image
          </label>
          <input
            className="chooseimg"
            disabled={!address}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
          />
          <span className="Imagesall">Image: {fileName}</span>
          <button type="submit" className="upload" disabled={!file}>
            Upload File
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
