const express = require('express');
const router = express.Router();
const test = require('./test');
const auth = require('./auth');
const request = require('./requests');

router.use('/test', test);
router.use('/auth', auth);
router.use('/request', request);

module.exports = router;
