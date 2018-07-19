const remove = require('express').Router();

const database = require('../lib/database');
const sendResponse = require('../utils/sendResponse');

let connection;

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

remove.route('/').post(async(req, res) => {
    try {
        // console.log("line 10 ", req.body);  
        connection =  await database.getConnection();
        await connection.beginTransaction();
        const userData = await getUser(req);
        await removeUserRoleMap(userData)
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