const jwt = require("jsonwebtoken");
const User = require("./userSchema");

const Authentication = (req, resp, next) => {
  const token = req.cookies.jwtoken;
  if (token) {
    try {
      const result = jwt.verify(token, 'hello world');
      req.userId = result._id;
      console.log(999);
    } catch (error) {
      console.error("Error verifying token:", error.message);
      // Handle token verification error if needed
    }
  } else {
    req.userId = 'false';
  }
  next();
};

module.exports = Authentication;
