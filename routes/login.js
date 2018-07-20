const login = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const database = require('../lib/database');
const sendResponse = require('../utils/sendResponse');
function validateEmail(email){
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

login.route('/').post(async (req, res) => {
    const { email, password } = req.body;

    if(!validateEmail(email)){
      return sendResponse(res, 400, { }, 'Invalid email');
    }
    
    if(password.length < 3){
      return sendResponse(res, 400, { }, 'Please provide atleast 3 characters for password');
    }

    try {
      const [result] = await database.query(`select * from users INNER JOIN UserRoleMap on users.uid = UserRoleMap.userId where users.email = '${email}'`);
      console.log('result===>>', result);
      if (result.length === 0) {
          return sendResponse(res, 404, [], 'User not found');
        }
        const passwordFromDb = result[0].password;
        
        const isPasswordValid = await bcrypt.compare(password, passwordFromDb);
        
        if (!isPasswordValid) {
            return sendResponse(res, 401, [], 'Invalid Password');
        }
        const [userRoleData] = await database.query(`select * from UserRoleMap INNER JOIN roles on UserRoleMap.roleId = roles.uid where UserRoleMap.userId = '${result[0].uid}'`);
        
        const userDetailForToken = {
            userId: result[0].email,
            name: result[0].name,
            role: userRoleData[0].name
        };
        
        console.log(userDetailForToken);
        const token = jwt.sign(userDetailForToken,
        "SOME_KEY", { expiresIn: "1d" },
      );

      res.header('x-auth', token);
      return sendResponse(res, 200, { token }, 'Login successful');
    } catch (err) {
      console.error(err);
      return sendResponse(res, 500, [], 'something went wrong');
    }
  });

  module.exports = login;