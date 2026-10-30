const express = require("express")
const router = express.Router();
const {createReading} = require("../controllers/reading");
const authenticate = require("../middleware/auth");

router.post("/upload-reading", authenticate ,createReading)

module.exports = router;

