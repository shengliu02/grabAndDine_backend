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
        let isMatched = false;
        Requests.findAll().then((users) => {
          if (Object.keys(users).length === 1) {
            res.status(500).json({ message: 'you are the only one' });
          }
          users.forEach((each) => {
            if (each.dataValues.request_user_id !== curr.request_user_id
              && each.dataValues.is_matched === false
              && each.dataValues.location === curr.location) {
              isMatched = true;
              userHere = each;
              matchedUser = userHere.dataValues.request_user_id;

              Requests.update({
                is_matched: true,
              }, {
                where: {
                  request_id: userHere.dataValues.request_id,
                },
              }).then().catch();

              Requests.update({
                is_matched: true,
              }, {
                where: {
                  request_id: curr.request_id,
                },
              }).then().catch();

              models.Matches.create({
                user1_id: curr.request_user_id,
                user2_id: matchedUser,
              }).then(() => {
                res.status(201).json({
                  message: 'match found',
                  userMatched: matchedUser,
                });
              }).catch((err) => {
                res.status(500).json({ message: err });
              });
            }
          });
          if (!isMatched) {
            res.status(201).json({ message: 'Try again' });
          }
        }).catch((err) => {
          res.status(500).json({ message: err });
        });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  },
};

module.exports = AUTH_CONTROLLER.registerRoute();
