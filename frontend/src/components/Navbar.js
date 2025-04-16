import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ account, connectWallet }) => {
  return (
    <nav className="navbar">
      <h2 className="logo">NFT Marketplace</h2>
      <div className="nav-links">
        <Link to="/">Marketplace</Link>
        <Link to="/mint">Mint NFT</Link>
        <Link to="/my-nfts">My NFTs</Link>
        {account ? (
          <span className="account">{account.slice(0, 6)}...{account.slice(-4)}</span>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
