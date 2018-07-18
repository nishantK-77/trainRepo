const express = require('express');
const router = express.Router();
const userManagement = require('./userManagement');
const transactions = require('./transactions');

router.post('/register', function(req, res){
    transactions.register(req, res);
})

router.post('/login', function(req, res){
    userManagement.login(req, res);
})


module.exports = router;