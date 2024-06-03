import React from "react";

import { gql, useQuery } from "@apollo/client";
import { useContract } from "../Context/ContractContext";
import { GetListedOwnedNFTs, GetListedOwnedNFTsVariables } from "./__generated__/GetListedOwnedNFTs";
import { ethers } from "ethers";

const useListedOwnedNFTs = () => {
  const { address: account } = useContract(); 

  const { data } = useQuery<GetListedOwnedNFTs, GetListedOwnedNFTsVariables>(
    GET_LISTED_OWNED_NFTS,
    { variables: { owner: account ?? "" }, skip: !account }
  );
  const ownedListedNFTs = data?.nfts || []; // Ensuring a default empty array if data is not available

  return { ownedListedNFTs };
};

const parseRawNFT = (raw) => {
  return {
    id: raw.id,
    owner: raw.price === "0" ? raw.to : raw.from,
    price: raw.price === "0" ? "0" : ethers.utils.formatEther(raw.price),
    tokenURI: raw.tokenURI,
  };
};


const GET_LISTED_OWNED_NFTS = gql`
  query GetListedOwnedNFTs($owner: String!) {
    nfts(where: { to:"0x4a7Bcb9bB3674E4d3759b813edd911Af9c84FAbb"   from: $owner}) {
      id
      from
      to
      tokenURI
      price
    }
  }
`;

export default useListedOwnedNFTs;
