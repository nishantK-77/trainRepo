const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/sendResponse');

const checkAuth = async (req, res, next) => {
  const token = req.header('x-auth');

  if (!token || typeof token === undefined) {
    return sendResponse(res, 401, [], 'invalid token');
  }

  try {
    const decode = await jwt.verify(token, "SOME_KEY");
    // console.log("decode ====> ", decode);
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    if (err.name === 'TokenExpiredError') {
      return sendResponse(res, 401, [], 'Token Expired');
    }
    
    if (err.name === 'JsonWebTokenError') {
      return sendResponse(res, 401, [], 'Invalid Token');
    }
    return sendResponse(res, 500, [], 'Something went wrong');
  }
};

module.exports = checkAuth;
