const database = require('../lib/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let connection;
var transactions = {};

sendResponse = (res, status, data, message) => {
    res.status(status).json({
        status,    
        data,
        message,
    });
}; 

insertIntoUsers = async(req) => {
  try {
    
    const { name, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      password: encryptedPassword,
    };
    
    console.log("newUser ===>", userData);
    const newUser = await connection.query('INSERT INTO users SET ? ', userData);
    // const commit = await connection.commit();
    // connection.release();
    console.log(newUser);
    return newUser;
    
  } catch (error) {
    throw error;
  }
}

insertIntoUserRolesMap = async(data) => {
  try {
    const newUserRole = await connection.query('INSERT INTO UserRoleMap SET ? ', data);
    console.log(newUserRole);    
  } catch (error) {
    throw error;
  }
}

transactions.register = async(req, res) => {
    try {
        connection =  await database.getConnection();
        await connection.beginTransaction();
        const newUser = await insertIntoUsers(req);
        const userRoleData = {
            userId: newUser[0].insertId,
            roleId: req.body.roleId,
        }
        // console.log(userRoleData);
        await insertIntoUserRolesMap(userRoleData);
        // await connection.query('INSERT INTO UserRoleMap SET ?', userRoleData);
        await connection.commit();
        // connection.release();
        
        // const result = await insertIntoUsers(req);
        // console.log("line 57 ", result);

        return false;
        const token = jwt.sign(responseData, "SOME_KEY", { expiresIn: "1d" });
        res.header('x-auth', token);
        
        return sendResponse(res, 200, { token }, 'Registration successful');
      
      } catch (err) {
        console.error(err);
        connection.rollback();
        if (err.code === 'ER_DUP_ENTRY') {
          return sendResponse(res, 409, [], 'email/username already exist');
        }
        return sendResponse(res, 500, [], 'failed', 'something went wrong');
      }
};

// transactions.register();
// console.log(database);
module.exports = transactions;