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
    // res.status(401).json({
    //   message: req.flash('You are not authorized to access beyond this point.')
    // });
  },

  create(req, res) {
    Requests.create({
      is_matched: false,
      request_user_id: req.body.request_user_id,
      location: req.body.location,
    })
      .then((item) => {
        const curr = item.dataValues;
        let userHere;
        let matchedUser = 0;
        let hasResponded = false;
        Requests.findAll().then((users) => {
          if (Object.keys(users).length === 1) {
            hasResponded = true;
            res.status(201).json({
              message: 'you are the only one',
              request_id: curr.request_id,
              match_id: null,
              status: 0,
            });
          } else {
            users.forEach((each) => {
              if (each.dataValues.request_user_id !== curr.request_user_id
              && each.dataValues.is_matched === false
              && each.dataValues.location === curr.location
              && !hasResponded) {
                hasResponded = true;
                userHere = each;
                matchedUser = userHere.dataValues.request_user_id;

                Requests.update({
                  is_matched: true,
                }, {
                  where: {
                    request_id: userHere.dataValues.request_id,
                  },
                }).then(() => {
                  Requests.update({
                    is_matched: true,
                  }, {
                    where: {
                      request_id: curr.request_id,
                    },
                  }).then(() => {
                    models.Matches.create({
                      user1_id: curr.request_user_id,
                      user2_id: matchedUser,
                    }).then((match) => {
                      res.status(201).json({
                        message: 'Match found !',
                        userMatched: matchedUser,
                        match_id: match.dataValues.match_id,
                        status: 1,
                        request_id: curr.request_id,
                      });
                    }).catch((err) => {
                      res.status(500).json({ message: err });
                    });
                  }).catch();
                }).catch();
              }
            });
          }
          if (!hasResponded) {
            res.status(201).json({
              message: 'No match currently available',
              request_id: curr.request_id,
              match_id: null,
              status: 2,
            });
          }
        }).catch((err) => {
          res.status(500).json({ message: err });
        });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  },

  // check(req, res){
  //   Matches.get({

  //   })
  // }
};

module.exports = AUTH_CONTROLLER.registerRoute();
