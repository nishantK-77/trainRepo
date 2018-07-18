const database = require('../lib/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var userManagement = {};

sendResponse = (res, status, data, message) => {
    res.status(status).json({
        status,    
        data,
        message,
    });
}; 

insertIntoUsers = async(req) => {
  try {
    const { uid, name, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData = {
      uid, name,
      password: encryptedPassword,
    };
    
    const newUser = await database.query('INSERT INTO users SET ? ', userData);
    // console.log("newUser ===>", JSON.stringify(newUser));
    return newUser;
    
  } catch (error) {
    throw error;
  }
}

insertIntoUserRolesMap = async(req) => {
  try {
    const {uid, roleId} = req.body;
    const userRoleData = {
      uid, 
      userId: uid,
      insertIntoUserRolesMap
    };
  } catch (error) {
    throw error;
  }
}

userManagement.register = async(req, res) => {
    try {
        const data = await insertIntoUsers(req);
        const data2 = await insertIntoUserRolesMap(req);
        const token = jwt.sign(responseData, "SOME_KEY", { expiresIn: "1d" });
        res.header('x-auth', token);
        
        return sendResponse(res, 200, { token }, 'Registration successful');
    
      
      } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
          return sendResponse(res, 409, [], 'email/username already exist');
        }
        return sendResponse(res, 500, [], 'failed', 'something went wrong');
      }
};

userManagement.login = async (req, res) => {
    const { uid, password } = req.body;

    try {
      const result = await database.query(`SELECT uid, password, name FROM users where uid = '${uid}'`);
      console.log('result===>>', result[0]);
      if (result[0].length === 0) {
        return sendResponse(res, 404, [], 'User not found');
      }
      const passwordFromDb = result[0][0].password;
      
      const isPasswordValid = await bcrypt.compare(password, passwordFromDb);
      
      if (!isPasswordValid) {
        return sendResponse(res, 401, [], 'Invalid Password');
      }

      const userDetailForToken = {
        userId: result[0][0].uid,
        name: result[0][0].name,
      };
      
      const token = jwt.sign(userDetailForToken,
        "SOME_KEY", { expiresIn: "1d" },
      );

      res.header('x-auth', token);
      return sendResponse(res, 200, { token }, 'Login successful');
    } catch (err) {
      console.error(err);
      return sendResponse(res, 500, [], 'something went wrong');
    }
  };

module.exports = userManagement;