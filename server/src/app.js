const express = require('express');
const app = express();
const authRoute = require("./routes/auth.route");
const cookieParser = require("cookie-parser")
const readingRoute = require("./routes/reading.route");
const reportRoute = require("./routes/report.route");
const cors = require('cors');
const { FRONTENDURL } = require('./config');

app.use(cors({
    origin: FRONTENDURL,
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute)
app.use("/api/reading", readingRoute)
app.use("/api/reports", reportRoute)

app.get("/", (req, res) =>{
    return res.json({
        message: "Api is Working"
    })
});

module.exports = app;