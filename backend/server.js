// backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

app.get("/nfts", (req, res) => {
  const filePath = path.join(__dirname, "nft_data.csv");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading CSV");
    res.send(data);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
