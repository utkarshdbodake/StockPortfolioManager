'use strict'

const joi = require('express-joi').Joi
const expressJoi = require('express-joi')
const Constants = require('./../constants')

// Use the Joi object to create a few schemas for your routes.
const getUsersSchema = {
  limit: joi.types.Number().integer()
}

const addTradeSchema = {
  portfolioId: joi.types.String().required(),
  stock: joi.types.String().alphanum().required(),
  type: joi.types.String().required().valid(
    Constants.TRADE.TYPE.BUY,
    Constants.TRADE.TYPE.SELL
  ),
  quantity: joi.types.Number().integer().required(),
  price: joi.types.Number().required()
}

const updateTradeSchema = {
  portfolioId: joi.types.String().required(),
  tradeId: joi.types.String().required(),
  quantity: joi.types.Number().integer(),
  price: joi.types.Number()
}

const deleteTradeSchema = {
  portfolioId: joi.types.String().required(),
  tradeId: joi.types.String().required()
}

module.exports = {
  getUsersSchema: expressJoi.joiValidate(getUsersSchema),
  addTradeSchema: expressJoi.joiValidate(addTradeSchema),
  updateTradeSchema: expressJoi.joiValidate(updateTradeSchema),
  deleteTradeSchema: expressJoi.joiValidate(deleteTradeSchema)
}
