// useOwnedNFTs.jsx

import { gql, useQuery } from "@apollo/client";
import { useContract } from "../Context/ContractContext";
import { GetListedNFTs, GetListedNFTsVariables } from "./__generated__/GetListedNFTs";
import { ethers } from "ethers";

const useListedNFTs = () => {
  const { address: account } = useContract(); 

  const { data } = useQuery<GetListedNFTs, GetListedNFTsVariables>(
    GET_LISTED_NFTS,
    { variables: {  currentAddress: account ?? "" }, skip: !account }
  );
  const listedNFTs = data?.nfts || []; // Ensuring a default empty array if data is not available

  return { listedNFTs };
};

const parseRawNFT = (raw) => {
  return {
    id: raw.id,
    owner: raw.price === "0" ? raw.to : raw.from,
    price: raw.price === "0" ? "0" : ethers.utils.formatEther(raw.price),
    tokenURI: raw.tokenURI,
  };
};


const GET_LISTED_NFTS = gql`
  query GetListedNFTs($currentAddress: String!) {
    nfts(where: { to:"0x4a7Bcb9bB3674E4d3759b813edd911Af9c84FAbb"   from_not: $currentAddress}) {
      id
      from
      to
      tokenURI
      price
    }
  }
`;

export default useListedNFTs;
