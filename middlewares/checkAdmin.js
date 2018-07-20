const sendResponse = require('../utils/sendResponse');

const isAdmin = (req, res, next) => {
  
  if (!req.user) {
    return sendResponse(res, 405, [], 'failed');
  }

//   console.log(req.user)
  if (req.user.role !== 'Admin') {
    return sendResponse(res, 400, [], 'user not authorised');
  }
  return next();
};

module.exports = isAdmin;
