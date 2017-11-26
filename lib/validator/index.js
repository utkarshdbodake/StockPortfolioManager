'use strict'

const joi = require('express-joi').Joi
const expressJoi = require('express-joi')
const Constants = require('./../constants')

const addTradeSchema = {
  portfolioId: joi.types.String().required(),
  stock: joi.types.String().alphanum().required(),
  type: joi.types.String().required().valid(
    Constants.TRADE.TYPE.BUY,
    Constants.TRADE.TYPE.SELL
  ),
  quantity: joi.types.Number().integer().required().min(1),
  price: joi.types.Number().required().min(1)
}

const updateTradeSchema = {
  tradeId: joi.types.String().required(),
  quantity: joi.types.Number().integer().min(1),
  price: joi.types.Number().min(1)
}

module.exports = {
  addTradeSchema: expressJoi.joiValidate(addTradeSchema),
  updateTradeSchema: expressJoi.joiValidate(updateTradeSchema)
}
