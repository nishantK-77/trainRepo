const database = require('../lib/database');
const fs = require('fs');
const json2csv = require('json2csv').parse;

 
const fields = ['orgId', 'name', 'mobile', 'testType', 'testCount'];

var userManagement = {};

sendResponse = (res, status, data, message) => {
    res.status(status).json({
        status,    
        data,
        message,
    });
}; 

getTestsData = async(req) => {
    try {
        const query1 = 'SELECT type, createdBy, count(*) AS testCount FROM tests GROUP BY createdBy, type ';
        const testsData = await database.query(query1);
        return testsData;
    } catch (error) {
        throw error;        
    }
} 

getTutorsData = async(data) => {
    try {
        let responseDataType1 = [];
        let x = 0;
        let responseDataType2 = [];
        let y = 0;
        
        let tutorsData;
        for(let i=0; i<data.length; i++){
            const query2 = `SELECT tutors.userId, users.orgId, users.name, users.mobile FROM tutors INNER JOIN users ON users.id = tutors.userId WHERE users.id = ${data[i].createdBy}`;
            tutorsData = await database.query(query2);
            tutorsData = tutorsData[0];
            if(data[i].type == 1){
                responseDataType1[x++] = {orgId : tutorsData[0].orgId, name : tutorsData[0].name, mobile : tutorsData[0].mobile, testType : 1, testCount : data[i].testCount}
            } else{
                responseDataType2[y++] = {orgId : tutorsData[0].orgId, name : tutorsData[0].name, mobile : tutorsData[0].mobile, testType : 2, testCount : data[i].testCount}
            }

        }
        const csv1 = json2csv(responseDataType1);
        const csv2 = json2csv(responseDataType2);
        
        fs.writeFile('testCountType1_'+ new Date().toDateString()+'.csv', csv1);
        fs.writeFile('testCountType2_'+ new Date().toDateString()+'.csv', csv2);
    } catch (error) {
        throw error
    }
}

userManagement.getData = async(req, res) => {
    try {
        const testsData = await getTestsData(req);
        const tutorsData = await getTutorsData(testsData[0]);
      } catch (err) {
        console.error(err);
        return sendResponse(res, 500, [], 'failed', 'something went wrong');
      }
};

userManagement.getData();

module.exports = userManagement;