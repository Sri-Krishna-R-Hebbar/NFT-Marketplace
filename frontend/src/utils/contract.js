// src/utils/contract.js
import { ethers } from "ethers";
import NFTABI from "../contracts/NFT.json";
import NFTMarketplaceABI from "../contracts/NFTMarketplace.json";

const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS;
const MARKETPLACE_ADDRESS = process.env.REACT_APP_MARKETPLACE_ADDRESS;

export const getContracts = async () => {
  if (!window.ethereum) throw new Error("Please install MetaMask");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const nftContract = new ethers.Contract(NFT_ADDRESS, NFTABI.abi, signer);
  const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, NFTMarketplaceABI.abi, signer);

  return { nftContract, marketplaceContract, signer };
};

export const getTokenMetadata = async (tokenId) => {
  const { nftContract } = await getContracts();
  const tokenURI = await nftContract.tokenURI(tokenId);
  const metadata = JSON.parse(atob(tokenURI.replace("data:application/json;base64,", "")));
  return metadata;
};
