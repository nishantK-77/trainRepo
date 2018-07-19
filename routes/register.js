const register = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const database = require('../lib/database');
const sendResponse = require('../utils/sendResponse');


let connection;

insertIntoUsers = async(req) => {
  try {
    const { name, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email, 
      password: encryptedPassword,
    };
    
    console.log("newUser ===>", userData);
    const [newUser] = await connection.query('INSERT INTO users SET ? ', userData);
    console.log(newUser);
    return newUser;
  } catch (error) {
    throw error;
  }
}

insertIntoUserRolesMap = async(data) => {
  try {
    const [newUserRole] = await connection.query('INSERT INTO UserRoleMap SET ? ', data);
    console.log(newUserRole);    
  } catch (error) {
    throw error;
  }
}

register.route('/').post(async(req, res) => {
    try {
        connection =  await database.getConnection();
        await connection.beginTransaction();
        const newUser = await insertIntoUsers(req);
        const userRoleData = {
            userId: newUser.insertId,
            roleId: req.body.roleId,
        }
        await insertIntoUserRolesMap(userRoleData);
        await connection.commit();
        const responseData = {
            userId: newUser.insertId,
            email: req.body.email
        }
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
});

module.exports = register;