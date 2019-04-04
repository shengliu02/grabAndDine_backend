const express = require('express');

const router = express.Router();
const test = require('./test');
const auth = require('./auth');
const request = require('./requests');
const channel = require('./channels');

router.use('/test', test);
router.use('/auth', auth);
router.use('/request', request);
router.use('/channel', channel);

module.exports = router;
