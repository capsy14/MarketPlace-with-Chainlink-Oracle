/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetListedOwnedNFTs
// ====================================================

export interface GetListedOwnedNFTs_nfts {
  __typename: "NFT";
  id: string;
  from: any;
  to: any;
  tokenURI: string;
  price: any;
}

export interface GetListedOwnedNFTs {
  nfts: GetListedOwnedNFTs_nfts[];
}

export interface GetListedOwnedNFTsVariables {
  owner: string;
}
