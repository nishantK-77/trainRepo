const register = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const database = require('../lib/database');
const sendResponse = require('../utils/sendResponse');
function validateEmail(email){
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

let connection;

insertIntoUsers = async(req) => {
  try {
    
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
        const { name, email, password } = req.body;
        if(!validateEmail(email)){
          return sendResponse(res, 400, { }, 'Invalid email');
        }
        
        if(name.length < 3){
          return sendResponse(res, 400, { }, 'Please provide atleast 3 characters for name');
        }
        
        if(password.length < 3){
          return sendResponse(res, 400, { }, 'Please provide atleast 3 characters for password');
        }
        
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
        
        return sendResponse(res, 201, { token }, 'Registration successful');
        
      } catch (err) {
        console.error(err);
        connection.rollback();
        if (err.code === 'ER_DUP_ENTRY') {
          return sendResponse(res, 409, [], 'email already exist');
        }
        return sendResponse(res, 500, [], 'failed', 'something went wrong');
      }
});

module.exports = register;