'use strict'

const routes = require('express').Router()
const Constants = require('./../constants')
const TradeHandler = require('./../handler/tradeHandler')
const Validator = require('./../validator')

routes.post(`${Constants.BASE_URL}/trade`, Validator.addTradeSchema, TradeHandler.addTrade)

routes.put(`${Constants.BASE_URL}/trade`, Validator.updateTradeSchema, TradeHandler.updateTrade)

routes.delete(`${Constants.BASE_URL}/trade/:tradeId`, TradeHandler.archiveTrade)

module.exports = routes
