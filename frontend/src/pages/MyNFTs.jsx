import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import NFTCard from "../components/NFTCard";

const MyNFT = ({ account }) => {
  const [myNfts, setMyNfts] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const nftsRef = ref(db, "nfts/");
    onValue(nftsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allNfts = Object.values(data);
        const owned = allNfts.filter((nft) => nft.owner.toLowerCase() === account.toLowerCase());
        setMyNfts(owned);
      }
    });
  }, [account]);

  return (
    <div className="page-container">
      <h2>My NFTs</h2>
      <div className="nft-grid">
        {myNfts.map((nft, idx) => (
          <NFTCard key={idx} nft={nft} isMyNFT />
        ))}
      </div>
    </div>
  );
};

export default MyNFT;
