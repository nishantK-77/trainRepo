const express = require('express');
const router = express.Router();
const register = require('./register');
const login = require('./login');
const remove = require('./remove');
const update = require('./update');
const {checkAuth} = require('../middlewares');

router.use('/login', login);
router.use('/register', register);
router.use('/remove', checkAuth, remove);
router.use('/update', checkAuth, update);


module.exports = router;