import React, { useState } from 'react';
import useNFTMarket from '../hooks/useNFTMarket';

const MyComponent = () => {
  const { createNFT, listNFT, cancelListing, buyNFT } = useNFTMarket();
  const [values, setValues] = useState({ name: '', description: '', image: null });

  const handleCreateNFT = async () => {
    await createNFT(values);
  };

  const handleListNFT = async (tokenID, price) => {
    await listNFT(tokenID, price);
  };

  const handleBuyNFT = async (nft) => {
    await buyNFT(nft);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={values.description}
        onChange={(e) => setValues({ ...values, description: e.target.value })}
      />
      <input
        type="file"
        onChange={(e) => setValues({ ...values, image: e.target.files[0] })}
      />
      <button onClick={handleCreateNFT}>Create NFT</button>
    </div>
  );
};

export default MyComponent;
