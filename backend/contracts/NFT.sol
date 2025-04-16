// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFT {
    string public name = "Marketplace NFT";
    string public symbol = "MNFT";

    uint256 public totalSupply = 0;

    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) public approved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    address public marketplace;

    constructor(address _marketplace) {
        marketplace = _marketplace;
    }

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed from, address indexed to, uint256 indexed tokenId);

    function mint(string memory uri) public returns (uint256) {
        uint256 tokenId = totalSupply;
        ownerOf[tokenId] = msg.sender;
        balanceOf[msg.sender]++;
        _tokenURIs[tokenId] = uri;

        emit Transfer(address(0), msg.sender, tokenId);

        totalSupply++;
        return tokenId;
    }


    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function approve(address to, uint256 tokenId) public {
        require(msg.sender == ownerOf[tokenId], "Only owner can approve");
        approved[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved_) public {
        isApprovedForAll[msg.sender][operator] = approved_;
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(
            msg.sender == ownerOf[tokenId] ||
            approved[tokenId] == msg.sender ||
            isApprovedForAll[ownerOf[tokenId]][msg.sender],
            "Not authorized"
        );

        ownerOf[tokenId] = to;
        balanceOf[from]--;
        balanceOf[to]++;
        delete approved[tokenId];

        emit Transfer(from, to, tokenId);
    }
}
