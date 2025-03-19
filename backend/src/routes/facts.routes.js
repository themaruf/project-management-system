const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

let factCache = {
  data: null,
  timestamp: null,
};

router.get("/random", async (req, res) => {
  try {
    if (factCache.data && Date.now() - factCache.timestamp < 600000) {
      return res.json(factCache.data);
    }

    const response = await fetch(
      "https://uselessfacts.jsph.pl/api/v2/facts/random"
    );
    const data = await response.json();

    factCache = {
      data: {
        fact: data.text,
        source: data.source,
        updatedAt: new Date(),
      },
      timestamp: Date.now(),
    };

    res.json(factCache.data);
  } catch (error) {
    console.error("Fact API Error:", error);
    res.status(500).json({ message: "Failed to fetch random fact" });
  }
});

module.exports = router;
