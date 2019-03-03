const express = require('express');
const models = require('../models');
const router = express.Router();

const User = models.Users;

const TEST_CONTROLLER = {
    registerRoute(){
        router.get('/', this.test);
        return router;
    },

    test(req, res){
        res.json({ test: req.session });
    },




};

module.exports = TEST_CONTROLLER.registerRoute();