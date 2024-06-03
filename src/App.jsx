import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConnectMetamask from './Components/ConnectMetamask'; // Update extension to .jsx
import UploadForm from './Components/UploadForm';
import FileUpload from './Components/FileUpload';
import OwnedNFTs from './Components/OwnedNFTs';
import ListedOwnedNFTs from './Components/ListedOwnedNFTs';
import ListNFT from './Components/ListNFTs';
import Navbar from './Components/Navbar';

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<ListNFT/>}/>
        <Route path='/createNFT' element={<FileUpload/>}/>
        <Route path='/OwnedNFT' element={<OwnedNFTs/>}/>
        <Route path='/Listed&OwnedNFT' element={<ListedOwnedNFTs/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
