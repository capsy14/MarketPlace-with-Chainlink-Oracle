import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export default buildModule("MarketPlaceModule", (m) => {
 
  const MarketPlaceLync = m.contract("MarketPlace", ["Kartik","NFTLync"], {
    
  });

  return { MarketPlaceLync };
});