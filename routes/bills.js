const express = require("express");
const { addBill, getBills, updateBills, newRoundBills } = require("../controllers/bills");
const { updateStatistics } = require("../controllers/statistics");

const router = express.Router();

//POST
router.post("/add-bill", addBill);
router.post("/bills", updateStatistics, newRoundBills,updateBills, getBills);

module.exports = router;