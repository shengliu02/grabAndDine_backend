const express = require('express');
const models = require('../models');
const router = express.Router();
const Users = models.Users;
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const AUTH_CONTROLLER = {
    registerRoute(){
        router.get('/', this.unauthorized); // no authorization to access beyond this point.
        //router.get('/requests', this.index);
        router.put('/bios/:id', this.biosUpdate);
        router.put('/gender/:id', this.genderUpdate);
        return router;
    },

    unauthorized(req,res){
        res.status(401).json({'message': req.flash('You are not authorized to access beyond this point.')});
    },

    biosUpdate(req,res){
        if(req.body.authKey === process.env[config.API_KEY]){ // remove the API KEYS!!!

            if(req.params.id === undefined){
                res.status(400).json( {message : 'Inputs are invalid! Please make sure all information are completed correctly. ' });
            } else{
                Users.update({
                    bios: req.body.bios
                }, {
                    where : {
                        user_id : req.params.id
                    },
                }).then((user) => {
                    res.status(200).json( { message : "Your information has been updated." });

                }).catch((err) => {
                    res.status(500).json( {message : "Unknown error occurred! Please try again later." });
                    console.log(err);
                });

            }


        } else{
            res.status(401).json({message: "Authentication error! You can not access!"});
        }

    },

    genderUpdate(req,res){
        if(req.body.authKey === process.env[config.API_KEY]){ // remove the API KEYS!!!

            if(req.params.id === undefined){
                res.status(400).json( {message : 'Inputs are invalid! Please make sure all information are completed correctly. ' });
            } else{
                Users.update({
                    gender: req.body.gender
                }, {
                    where : {
                        user_id : req.params.id
                    },
                }).then((user) => {
                    res.status(200).json( { message : "Your information has been updated." });

                }).catch((err) => {
                    res.status(500).json( {message : "Unknown error occurred! Please try again later." });
                    console.log(err);
                });

            }


        } else{
            res.status(401).json({message: "Authentication error! You can not access!"});
        }

    },


};

module.exports = AUTH_CONTROLLER.registerRoute();