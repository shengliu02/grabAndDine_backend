const express = require('express');
const router = express.Router();
const test = require('./test');
const auth = require('./auth');

router.use('/test', test);
router.use('/auth', auth);
module.exports = router;
