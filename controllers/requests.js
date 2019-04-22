const express = require('express');
const models = require('../models');

const router = express.Router();
const { Requests } = models;

const AUTH_CONTROLLER = {
  registerRoute() {
    router.get('/', this.unauthorized); // no authorization to access beyond this point.
    // router.get('/requests', this.index);
    router.post('/', this.create);

    return router;
  },

  unauthorized(req, res) {
    // res.status(401).json({ message: req.flash('You are not authorized to access beyond this point.') });
  },

  create(req, res) {
    const BreakException = {};
    Requests.create({
      is_matched: false,
      request_user_id: req.body.request_user_id,
      location: req.body.location,

    })
      .then((item) => {
        // res.status(201).json({
        //   message: 'We are trying to match you with a mate, please wait for a second...',
        //   itemObject: item,
        // });

        // res.status(201).json({
        //   message: 'second',
        // });
        console.log('___________________________');
        console.log(item);
        console.log('___________________________');
        const curr = item.dataValues;
        console.log('___________________________');
        console.log(curr);

        let userHere;
        let matchedUser = 0;
        Requests.findAll().then((users) => {
          if (Object.keys(users).length === 1) {
            res.status(500).json({ message: 'you are the only one' });
          }
          console.log('!!!!!!!!!!!!!!!');
          // console.log(users);
          users.forEach((each) => {
            console.log('reading each');
            if (each.dataValues.request_user_id !== curr.request_user_id && each.dataValues.location === curr.location) {
              userHere = each;
              matchedUser = userHere.dataValues.request_user_id;
              models.Matches.create({
                user1_id: curr.request_user_id,
                user2_id: matchedUser,
              }).then(()=>{
                console.log("done matching");
                res.status(201).json({
                  message: 'match found',
                  userMatched: matchedUser,
                });
              }).catch((err)=>{
                console.log(err);
              });
              
              console.log('done each');
              throw BreakException;
            }
          });
          // res.status(201).json({
          //   message: 'match found',
          //   user_matched: userHere,
          // });
        }).catch((err)=>{
          console.log(err);
        });
      })
      .catch((err) => {
        if (err == BreakException) {
          res.status(201).json({
            message: 'match found',
            // user_matched: userHere,
          });
        } else {
          res.status(500).json({ message: err });
        }
      });
  },


};

module.exports = AUTH_CONTROLLER.registerRoute();
