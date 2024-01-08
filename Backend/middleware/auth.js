const jwt = require('jsonwebtoken');
const SECRET_KEY = 'idjqwidjiqjiqdjiqwjd';

module.exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Access denied. Token not provided.");
  }


  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token.");
    }
    console.log("Decoded token: ", decoded);
    req.seller = decoded;
    next();
  });
};
