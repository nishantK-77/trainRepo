const database = require('../lib/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const { uid, name, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData = {
      uid, name,
      password: encryptedPassword,
    };
    
    console.log("newUser ===>", userData);
    let connection = await database.getConnection();
    await connection.beginTransaction();
    const newUser = await connection.query('INSERT INTO users SET ? ', userData);
    const commit = await connection.commit();
    connection.release();
    console.log(commit);
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

transactions.register = async(req, res) => {
    let connection = await database.getConnection();
    try {
        // const userData = {
        //     uid: "AB12",
        //     name: "ASDFG",
        //     password: "123456"
        // };
        const { uid, name, password, roleId } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);
        const userData = {
          uid, name,
          password: encryptedPassword,
        };

        console.log("newUser ===>", userData);
        const userRoleData = {
            uid: "UR8",
            userId: userData.uid,
            roleId: roleId,
        }
        
        console.log("line 73 ", userRoleData);
        await connection.beginTransaction();
        await connection.query('INSERT INTO users SET ? ', userData);
        await connection.query('INSERT INTO UserRoleMap SET ?', userRoleData);
        await connection.commit();
        connection.release();
        
        // const result = await insertIntoUsers(req);
        console.log("line 57 ", result);

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