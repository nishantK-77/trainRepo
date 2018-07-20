const express = require('express');
const router = express.Router();
const register = require('./register');
const login = require('./login');
const remove = require('./remove');
const update = require('./update');
const {checkAuth, checkAdmin} = require('../middlewares');

router.use('/login', login);
router.use('/register', checkAuth, checkAdmin, register);
router.use('/remove', checkAuth, checkAdmin, remove);
router.use('/update', checkAuth, checkAdmin, update);


module.exports = router;