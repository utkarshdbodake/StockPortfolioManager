'use strict'

const routes = require('express').Router()
const Handler = require('./../handler')
const Validator = require('./../validator')

const BASE_URL = `/portfolio`

routes.get('/ping', Handler.getPong)

routes.get('/user', Validator.getUsersSchema, (req, res) => res.send('hello user'))

routes.get(`${BASE_URL}/:portfolioId`, Handler.getPortfolio)

routes.post(`${BASE_URL}/trade`, Validator.addTradeSchema, Handler.addTrade)

routes.put(`${BASE_URL}/trade`, Validator.updateTradeSchema, Handler.updateTrade)

routes.delete(`${BASE_URL}/:portfolioId/trade/:tradeId`, Handler.deleteTrade)

module.exports = routes
