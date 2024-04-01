var express = require('express');
var router = express.Router();

// router.use('/users',require('./users'));
router.use('/category',require('./category'));
// router.use('/firebase',require('../services/firebase'));
router.use('/drink',require('./drink'));
router.use('/topping',require('./topping'));
module.exports = router;
