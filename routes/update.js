const update = require('express').Router();
const bcrypt = require('bcrypt');

const database = require('../lib/database');
const sendResponse = require('../utils/sendResponse');

let connection;

updateUserRoleMap = async(req) => {
    try {
        const {email} = req.body;
        const [userData] = await connection.query(`SELECT * FROM users where email = '${email}'`);
        // console.log(userData);
        return userData;
    } catch (error) {
        throw error;        
    }
}

update.route('/').patch(async(req, res) => {
    try {
        console.log("line 10 ", req.body);
        connection =  await database.getConnection();
        
        await connection.beginTransaction();
        const { name, email, password, roleId } = req.body;
        const updateValues = []; // to store update values, if any

        if (!name && !email && !password && !roleId) {
          return sendResponse(res, 200, [], 'provide some fields');
        }   

        if (name) {
            updateValues.push(`name = '${name}'`);
        }

        if (email) {
            updateValues.push(`email = '${email}' `);
        }

        if (password) {
            const encryptedPassword = await bcrypt.hash(password, 10);
            updateValues.push(`password = '${encryptedPassword}' `);
        }

        if (roleId) {
            // updateValues.push(`roleId = '${roleId}' `);
            console.log(`SELECT * FROM users where email = '${email}'`)
            const [userData] = await connection.query(`SELECT * FROM users where email = '${email}'`);
            // console.log(userData[0]);
            await connection.query(`UPDATE UserRoleMap SET roleId = '${roleId}' WHERE userId = ${userData[0].uid}` );
        }
        
        if (updateValues.length) {
            const updateQuery = `UPDATE users SET ${updateValues.join()} WHERE email = '${email}'`;
            console.log(updateQuery);
            // return false;
            await connection.query(updateQuery, email);
        }
        connection.commit();
        
        return sendResponse(res, 200, { }, 'Update successful');

    } catch (error) {
        console.log(error)
        connection.rollback();
        return sendResponse(res, 500, [], 'failed', 'something went wrong');

    }
})

module.exports = update;