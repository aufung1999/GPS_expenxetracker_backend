const express = require("express");
const { getStatistics, getDateExpenses } = require("../controllers/statistics");

const router = express.Router();

//POST
router.post("/statistics", getStatistics);
router.post("/date-statistics", getDateExpenses);


module.exports = router;
