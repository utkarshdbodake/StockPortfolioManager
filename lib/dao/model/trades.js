'use strict'

const mongoose = require('mongoose')
const MongoConnection = require('./../connect')
const Constants = require('./../../constants')
const Schema = mongoose.Schema

const tradeSchema = new Schema({
  portfolioId: {
    type: String,
    required : true,
    index: true
  },
  stock: {
    type: String,
    required : true,
  },
  type: {
    type: String,
    required : true,
    enum: [
      Constants.TRADE.TYPE.BUY,
      Constants.TRADE.TYPE.SELL
    ]
  },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  price: {
    type: Number,
    required: true
  },
  tradedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  isArchived: {
    type: Boolean,
    default: false
  }
})

/**
 * Get trades model.
 *
 * @return {*}
 */
const getModel = function () {

  return MongoConnection.getClient().model('trades', tradeSchema)
}

/**
 * @typedef {Object} Trade
 *
 * @property {String} portfolioId
 * @property {String} stock
 * @property {String} type
 * @property {Number} quantity
 * @property {Number} price
 * @property {Date} [tradedAt]
 * @property {Date} [lastUpdatedAt]
 * @property {Boolean} [isArchived]
 */

module.exports = {
  getModel
}
