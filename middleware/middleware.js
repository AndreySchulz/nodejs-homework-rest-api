const { verifyToken } = require("../token");
const { findById } = require("../servicess/users");

const userMiddleware = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.substring(7);
      const tokenData = await verifyToken(token);
      const userData = await findById(tokenData.id);
      if (userData && userData.token === token) {
        req.user = userData;
        next();
        return;
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  res
    .status(401)
    .json({
      message: "Not authorized",
    })
    .end();
};

module.exports = userMiddleware;
