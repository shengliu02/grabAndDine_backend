const express = require('express');
const models = require('../models');

const router = express.Router();
const { Requests } = models;

const AUTH_CONTROLLER = {
  registerRoute() {
    router.get('/', this.unauthorized); // no authorization to access beyond this point.
    // router.get('/requests', this.index);
    router.post('/', this.create);
    router.get('/check/:id', this.checkRequest);

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
                let matchedUserObject = {};
                models.Users.findOne({
                  where: {
                    user_id: matchedUser,
                  },
                }).then((obj) => {
                  matchedUserObject = obj;
                }).catch();

                Requests.update({
                  is_matched: true,
                  matched_user_id: curr.request_user_id,
                }, {
                  where: {
                    request_id: userHere.dataValues.request_id,
                  },
                }).then(() => {
                  Requests.update({
                    is_matched: true,
                    matched_user_id: matchedUserObject.user_id,
                  }, {
                    where: {
                      request_id: curr.request_id,
                    },
                  }).then(() => {
                    models.Matches.create({
                      user1_id: curr.request_user_id,
                      user2_id: matchedUser,
                    }).then((match) => {
                      Requests.update({
                        match_id_ref: match.dataValues.match_id,
                      }, {
                        where: {
                          request_id: userHere.dataValues.request_id,
                        },
                      }).then(() => {
                        Requests.update({
                          match_id_ref: match.dataValues.match_id,
                        }, {
                          where: {
                            request_id: curr.request_id,
                          },
                        }).catch();
                      }).catch();

                      res.status(201).json({
                        message: 'Match found !',
                        userMatched: matchedUserObject,
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

  checkRequest(req, res) {
    console.log('!!@@@!!!!');
    console.log(req.params.id);
    Requests.findOne({
      where: {
        request_id: req.params.id,
      },
    }).then((match) => {
      console.log('____!!!!!!!!_____');
      console.log(match.dataValues);
      if (match.dataValues.is_matched) {
        models.Users.findOne({
          where: {
            user_id: match.dataValues.matched_user_id,
          },
        }).then((user) => {
          console.log(user);
          console.log('#############');
          console.log(match.dataValues.request_id);
          models.Requests.findOne({
            where: {
              request_id: match.dataValues.request_id,
            },
          }).then((matchObj) => {
            res.status(201).json({
              message: 'Match found !',
              userMatched: user.dataValues,
              match_id: matchObj.dataValues.match_id_ref,
              status: 1,
              request_id: req.params.id,
            });
          }).catch();
        }).catch();
      } else {
        res.status(201).json({
          message: 'No match currently available',
          request_id: req.params.id,
          match_id: null,
          status: 2,
        });
      }
    });
  },
};

module.exports = AUTH_CONTROLLER.registerRoute();
