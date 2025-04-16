const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const filePath = path.join(__dirname, "../nfts.csv");

function initializeCSV() {
  if (!fs.existsSync(filePath)) {
    const writer = createCsvWriter({
      path: filePath,
      header: [
        { id: "tokenId", title: "tokenId" },
        { id: "owner", title: "owner" },
        { id: "available", title: "available" },
        { id: "buyer", title: "buyer" },
        { id: "price", title: "price" },
      ],
    });
    writer.writeRecords([]);
  }
}

function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

async function writeCSV(data) {
  const writer = createCsvWriter({
    path: filePath,
    header: [
      { id: "tokenId", title: "tokenId" },
      { id: "owner", title: "owner" },
      { id: "available", title: "available" },
      { id: "buyer", title: "buyer" },
      { id: "price", title: "price" },
    ],
  });
  await writer.writeRecords(data);
}

module.exports = {
  initializeCSV,
  readCSV,
  writeCSV,
};
