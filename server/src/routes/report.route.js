const express = require("express");
const authenticate = require("../middleware/auth");
const { dailyReport, monthToDateReport, monthlyReport } = require("../controllers/report");
const readDate = require("../middleware/readDate");
const router = express.Router();

router.get("/daily", authenticate, readDate, dailyReport);
router.get("/month-to-date", authenticate, readDate, monthToDateReport);
router.get("/monthly", authenticate, readDate, monthlyReport);

module.exports = router;