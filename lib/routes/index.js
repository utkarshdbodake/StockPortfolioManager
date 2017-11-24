'use strict'

const routes = require('express').Router()
const Handler = require('./../handler')
const Validator = require('./../validator')

routes.get('/ping', Handler.getPong)

routes.get('/user', Validator.getUsersSchema, (rer, res) => res.send('hello user'))

module.exports = routes
