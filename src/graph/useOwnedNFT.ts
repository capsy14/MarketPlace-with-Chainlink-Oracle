// useOwnedNFTs.jsx

import { gql, useQuery } from "@apollo/client";
import { useContract } from "../Context/ContractContext";
import { GetOwnedNFTs, GetOwnedNFTsVariables } from "./__generated__/GetOwnedNFTs";
import { ethers } from "ethers";

const useOwnedNFTs = () => {
  const { address: account } = useContract(); 

  const { data } = useQuery<GetOwnedNFTs, GetOwnedNFTsVariables>(
    GET_OWNED_NFTS,
    { variables: { owner: account ?? "" }, skip: !account }
  );
  const ownedNFTs = data?.nfts || []; // Ensuring a default empty array if data is not available

  return { ownedNFTs };
};

const parseRawNFT = (raw) => {
  return {
    id: raw.id,
    owner: raw.price === "0" ? raw.to : raw.from,
    price: raw.price === "0" ? "0" : ethers.utils.formatEther(raw.price),
    tokenURI: raw.tokenURI,
  };
};


const GET_OWNED_NFTS = gql`
  query GetOwnedNFTs($owner: String!) {
    nfts(where: { to: $owner }) {
      id
      from
      to
      tokenURI
      price
    }
  }
`;

export default useOwnedNFTs;
