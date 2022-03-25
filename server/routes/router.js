const express = require('express');
const route = express.Router();

const services = require('../services/render.js');
const controller = require('../controller/controller.js');


/**
 * @description Root Route
 * @method GET /
 */
route.get('/',services.homeRoutes);

//API
route.post('/api/members',controller.create);
route.get('/api/members',controller.find);

module.exports = route;

