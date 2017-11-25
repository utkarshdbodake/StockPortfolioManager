'use strict'

const routes = require('express').Router()
const Handler = require('./../handler')

routes.get('/ping', Handler.getPong)

module.exports = routes
