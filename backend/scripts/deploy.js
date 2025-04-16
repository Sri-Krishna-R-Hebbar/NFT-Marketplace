const hre = require("hardhat");

async function main() {
  const Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace deployed at:", marketplace.address);

  const NFT = await hre.ethers.getContractFactory("contracts/NFT.sol:NFT");
  const nft = await NFT.deploy(marketplace.address);
  await nft.deployed();
  console.log("NFT contract deployed at:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
