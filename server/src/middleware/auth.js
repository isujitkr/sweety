const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../config');

const extractToken = (req) => {
  if(req.cookies?.["access-token"]){
    return req.cookies["access-token"];
  }

  return null;
};

const authenticate = (req, res, next) => {  
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided, Please login first' });
  }

  try {
    const decoded = jwt.verify(token, JWTSECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authenticate