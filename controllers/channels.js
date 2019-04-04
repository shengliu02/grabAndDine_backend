const express = require('express');
const path = require('path');

const router = express.Router();

const CHANNELS_CONTROLLER = {

  registerRoute() {
    router.get('/', this.index);

    return router;
  },

  index(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));

    // res.sendFile(`${__dirname}/../views/index.html`); <- this code will prompt forbidden error
  },

};

module.exports = CHANNELS_CONTROLLER.registerRoute();
