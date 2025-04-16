import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MintNFT from "./pages/MintNFT";
import MyNFT from "./pages/MyNFTs";
import NFTMarketplaceJSON from "./contracts/NFTMarketplace.json";
import NFTJSON from "./contracts/NFT.json";
import "./App.css";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const marketplaceAddress = process.env.REACT_APP_MARKETPLACE_ADDRESS;

  const connectWallet = async () => {
    if (window.ethereum) {
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      await tempProvider.send("eth_requestAccounts", []);
      const tempSigner = await tempProvider.getSigner();
      const address = await tempSigner.getAddress();
      setProvider(tempProvider);
      setSigner(tempSigner);
      setAccount(address);
    } else {
      alert("Install MetaMask");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <Router>
      <Navbar account={account} connectWallet={connectWallet} />
      <Routes>
        <Route path="/" element={<Home provider={provider} signer={signer} marketplaceAddress={marketplaceAddress} />} />
        <Route path="/mint" element={<MintNFT provider={provider} signer={signer} account={account} marketplaceAddress={marketplaceAddress} />} />
        <Route path="/my-nfts" element={<MyNFT account={account} />} />
      </Routes>
    </Router>
  );
};

export default App;
