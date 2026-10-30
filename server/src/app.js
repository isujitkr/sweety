const express = require('express');
const app = express();
const authRoute = require("./routes/auth.route");
const cookieParser = require("cookie-parser")

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute)

app.get("/", (req, res) =>{
    return res.json({
        message: "Api is Working"
    })
});

module.exports = app;