import React, { useEffect, useState } from "react";
import { getTokenMetadata } from "../utils/contract";
import NFTCard from "../components/NFTCard";
import Papa from "papaparse";

const Home = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const res = await fetch("http://localhost:5000/nfts"); // backend route
        const text = await res.text();

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            const filtered = results.data.filter((item) => item.available === "yes");
            const detailedNFTs = await Promise.all(
              filtered.map(async (item) => {
                const meta = await getTokenMetadata(item.tokenId);
                return {
                  tokenId: item.tokenId,
                  price: item.price,
                  ...meta,
                };
              })
            );
            setNfts(detailedNFTs);
          },
        });
      } catch (err) {
        console.error("Failed to fetch NFT data:", err);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <NFTCard key={nft.tokenId} nft={nft} />
      ))}
    </div>
  );
};

export default Home;
