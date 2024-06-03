import React from 'react';
import { useContract } from '../Context/ContractContext';

const ConnectMetamask = () => {
  const { address, requestAccount ,connected} = useContract();

  return (
    <div>
      <a className='WalletAddress' onClick={requestAccount}>
      {connected ? (
          <>
            {" "}
            <button className=" text-xs z-20 sm:text-sm">
              Connected to Metamask<br/>
            {address}
            </button>
          </>
        ) : (
          <button onClick={requestAccount}>Connect Wallet</button>
        )}




      </a>
    </div>
  );
};

export default ConnectMetamask;
