// src/pages/MintNFT.js
import React, { useState } from "react";
import { ethers } from "ethers";
import { uploadToFirebase } from "../utils/firebase";
import NFTJson from "../contracts/NFT.json";
import MarketplaceJson from "../contracts/NFTMarketplace.json";

const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS;
const MARKETPLACE_ADDRESS = process.env.REACT_APP_MARKETPLACE_ADDRESS;

function MintNFT() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // in ETH
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    try {
      if (!file || !name || !description) {
        alert("All fields are required!");
        return;
      }

      setLoading(true);

      // Upload to Firebase
      const metadata = { name, description };
      const { imageURL } = await uploadToFirebase(file, metadata);

      // Connect Wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Mint NFT
      const nftContract = new ethers.Contract(NFT_ADDRESS, NFTJson.abi, signer);
      const tx = await nftContract.mintNFT(imageURL);
      await tx.wait();
      const tokenId = await nftContract.getCurrentTokenId() - 1;

      // List NFT
      const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceJson.abi, signer);
      const listingPrice = price ? ethers.parseEther(price) : ethers.parseEther("0.005");

      const approvalTx = await nftContract.approve(MARKETPLACE_ADDRESS, tokenId);
      await approvalTx.wait();

      const listTx = await marketplaceContract.listNFT(NFT_ADDRESS, tokenId, listingPrice);
      await listTx.wait();

      alert("NFT minted and listed!");
      setFile(null);
      setName("");
      setDescription("");
      setPrice("");
    } catch (err) {
      console.error("Minting error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mint-container">
      <h2>Mint Your NFT</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Price in ETH (optional)" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Minting..." : "Mint & List NFT"}
      </button>
    </div>
  );
}

export default MintNFT;
