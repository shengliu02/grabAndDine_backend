const express = require('express');
const models = require('../models');
const router = express.Router();
const Requests = models.Requests;

const AUTH_CONTROLLER = {
    registerRoute(){
        router.get('/', this.unauthorized); // no authorization to access beyond this point.
        //router.get('/requests', this.index);
        router.post('/', this.create);

        return router;
    },

    unauthorized(req,res){
        res.status(401).json({'message': req.flash('You are not authorized to access beyond this point.')});
    },

    create(req,res){
        Requests.create({
            is_matched: false,
            request_user_id: req.body.request_user_id,
            location: req.body.location,

        })
            .then((item)=>{
                res.status(201).json({
                    message: `We are trying to match you with a mate, please wait for a second...`
                });
            })
            .catch((err) => {
                res.status(500).json({message: err});
            })

    },


};

module.exports = AUTH_CONTROLLER.registerRoute();