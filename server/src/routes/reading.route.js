const express = require("express")
const router = express.Router();
const {createReading, getReadings, updateReading, deleteReading} = require("../controllers/reading");
const authenticate = require("../middleware/auth");

router.post("/upload-reading", authenticate ,createReading)
router.get("/", authenticate, getReadings);
router.put("/:id", authenticate, updateReading);
router.delete("/:id", authenticate, deleteReading);

module.exports = router;

