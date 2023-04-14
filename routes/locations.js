const express = require("express");
const {
  uploadLocation,
  removeLocation,
  getLocations,
  storeExpense,
} = require("../controllers/locations");
const { updateStatistics } = require("../controllers/statistics");

const router = express.Router();

//POST
router.post("/store-location", uploadLocation);
router.post("/remove-location", removeLocation);
router.post("/locations", getLocations);
router.post("/store-expense",updateStatistics, storeExpense);
//GET

module.exports = router;
