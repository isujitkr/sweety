require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    DATABASEURL: process.env.DATABASE_URL,
    JWTSECRET: process.env.JWT_SECRET
};