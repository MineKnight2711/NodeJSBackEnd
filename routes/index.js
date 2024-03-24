var express = require('express');
var router = express.Router();

// router.use('/users',require('./users'));
router.use('/category',require('./category'));
module.exports = router;
