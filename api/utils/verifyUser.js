const jwt = require("jsonwebtoken");
const errorHandler = require("./error");
const jwtSecret = process.env.JWT_SECRET;

// Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if(!token) return next(errorHandler(401, 'Unauthorized'));
  const decoded = jwt.verify(token, jwtSecret);
  // console.log(decoded);
  if(!decoded) return next(errorHandler(403, 'Forbidden'));
  req.user = decoded;
  next();
};

module.exports = verifyToken