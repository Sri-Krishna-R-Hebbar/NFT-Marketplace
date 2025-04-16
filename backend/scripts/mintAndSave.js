const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { initializeCSV, readCSV, writeCSV } = require("../utils/csv");
require("dotenv").config();

async function main() {
  initializeCSV(); // create file if not present

  const [deployer] = await hre.ethers.getSigners();
  const nftContractAddress = process.env.NFT_CONTRACT;
  const marketplaceContractAddress = process.env.MARKETPLACE_CONTRACT;

  const NFT = await hre.ethers.getContractAt("contracts/NFT.sol:NFT", nftContractAddress);
  const Marketplace = await hre.ethers.getContractAt("contracts/NFTMarketplace.sol:NFTMarketplace", marketplaceContractAddress);


  // === Sample data ===
  const name = "Legendary Lion";
  const description = "A rare NFT from the wild.";
  const imagePath = path.join(__dirname, "../assets/lion.png"); // put a sample image in /assets
  const priceInEth = "0.01"; // in ETH

  const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

  const metadata = {
    name,
    description,
    image: `data:image/png;base64,${imageBase64}`,
  };

  const jsonMetadata = JSON.stringify(metadata);
  const metadataBase64 = Buffer.from(jsonMetadata).toString("base64");
  const tokenURI = `data:application/json;base64,${metadataBase64}`;

  // === 1. Mint NFT ===
  const mintTx = await NFT.mint(tokenURI);
  const mintReceipt = await mintTx.wait();
  const tokenId = mintReceipt.events[0].args.tokenId.toString();
  console.log(`Minted NFT with tokenId: ${tokenId}`);

  // === 2. Approve marketplace & list ===
  await NFT.approve(marketplaceContractAddress, tokenId);
  const priceInWei = hre.ethers.utils.parseEther(priceInEth);
  const listTx = await Marketplace.listNFT(nftContractAddress, tokenId, priceInWei);
  await listTx.wait();
  console.log(`Listed NFT for ${priceInEth} ETH`);

  // === 3. Save to CSV ===
  const allNFTs = await readCSV();
  allNFTs.push({
    tokenId,
    owner: deployer.address,
    available: "yes",
    buyer: "",
    price: priceInEth,
  });
  await writeCSV(allNFTs);
  console.log("NFT info saved to CSV ✅");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
