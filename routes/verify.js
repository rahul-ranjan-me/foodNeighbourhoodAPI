const jwt = require("jsonwebtoken");
const config = require("../config.js");

exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600 * 24 * 30,
  });
};

exports.verifyOrdinaryUser = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        const err = new Error("You are not authenticated!");
        err.status = 401;
        if (err) res.send({ status: "error", description: err });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    const err = new Error("No token provided!");
    err.status = 403;
    if (err) res.send({ status: "error", description: err });
  }
};
