const remove = require('express').Router();

const database = require('../lib/database');
const sendResponse = require('../utils/sendResponse');

let connection;

function validateEmail(email){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

getUser = async(req) => {
    try {
        const {email} = req.body;
        const [userData] = await connection.query(`SELECT * FROM users where email = '${email}'`);
        // console.log(userData);
        return userData;
    } catch (error) {
        throw error;        
    }
}

removeUserRoleMap = async(userData) => {
    try {
        console.log(userData)
        if(userData.length == 0)
            return userData;
        const userId = userData[0].uid;
        const removedUserRole = await connection.query(`DELETE FROM UserRoleMap where userId = '${userId}'`);
        console.log("line 23", removedUserRole);
        return removedUserRole;
    } catch (error) {
        throw error
    }
}

removeUser = async(req) => {
    try {
        const {email} = req.body;
        const removedUser = await connection.query(`DELETE FROM users where email = '${email}'`);
        console.log(removedUser);
    } catch (error) {
        throw error
    }
}

remove.route('/').delete(async(req, res) => {
    try {
        // console.log("line 10 ", req.body);  
        const {email} = req.body;
        if(!validateEmail(email)){
            return sendResponse(res, 400, { }, 'Invalid email');
        }
          
        connection =  await database.getConnection();
        await connection.beginTransaction();
        const userData = await getUser(req);
        const userRoleData = await removeUserRoleMap(userData);
        if(userRoleData.length == 0)
            return sendResponse(res, 404, { }, 'User not found');

        await removeUser(req);
        // console.log(removedUser);
        connection.commit();
        return sendResponse(res, 200, { }, 'Delete successful');

    } catch (error) {
        console.log(error)
        connection.rollback();
        return sendResponse(res, 500, [], 'failed', 'something went wrong');

    }
})

module.exports = remove;