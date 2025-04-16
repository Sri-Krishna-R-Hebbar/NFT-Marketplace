// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTMarketplace {
    struct Listing {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool sold;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event Listed(address nftContract, uint256 tokenId, address seller, uint256 price);
    event Bought(address buyer, address nftContract, uint256 tokenId, uint256 price);

    function listNFT(address nftContract, uint256 tokenId, uint256 price) public {
        listings[nftContract][tokenId] = Listing(
            nftContract,
            tokenId,
            msg.sender,
            price,
            false
        );
        emit Listed(nftContract, tokenId, msg.sender, price);
    }

    function buyNFT(address nftContract, uint256 tokenId) public payable {
        Listing storage item = listings[nftContract][tokenId];
        require(!item.sold, "Already sold");
        require(msg.value >= item.price, "Insufficient payment");

        item.sold = true;
        payable(item.seller).transfer(item.price);

        NFT(nftContract).transferFrom(item.seller, msg.sender, tokenId);
        emit Bought(msg.sender, nftContract, tokenId, item.price);
    }
}

interface NFT {
    function transferFrom(address from, address to, uint256 tokenId) external;
}
