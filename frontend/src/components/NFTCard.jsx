import React from "react";

const NFTCard = ({ nft }) => {
  return (
    <div className="border p-4 rounded-xl shadow-md bg-white">
      <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded" />
      <h2 className="text-xl font-semibold mt-2">{nft.name}</h2>
      <p className="text-sm text-gray-600">{nft.description}</p>
      <p className="text-md font-bold mt-2">Price: {nft.price} ETH</p>
      <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Buy
      </button>
    </div>
  );
};

export default NFTCard;
