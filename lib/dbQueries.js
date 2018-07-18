const database = require('./database');

var dbQueries = {};

dbQueries.find = function(data, table, cb){
    database.query(`select uid, name from ${table} where name = "${data.uid}"`, function(err, result){
        if(err)
            return cb(err);
        return cb(null, result);
    });
}

dbQueries.insert = function(data, table, cb){
    // console.log(data, table);
    database.query(`insert into ${table} set ?`, data, function(err, result){
        if(err)
            return cb(err);
        return cb(null, result);
    });
}

module.exports = dbQueries;