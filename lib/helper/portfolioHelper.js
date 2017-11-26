'use strict'

const Constants = require('./../constants')

/**
 Form meta holdings map of structure:
 {
   APPL: {
     quantity: [10, 20, -30, 50],
     price: [300, 200, 400]
   },
   GOOG: {
     quantity: [50, -20, -30],
     price: [300]
   }
 }

 Note: In quantity list positive integer represents `buy`, while negative integer represents `sell`.
 In price list, all integers are of `buy` prices.

 * @param {Trade[]} trades
 * @return {Object}
 */
const getMetaHoldingsObject = function (trades) {

  const holdings = {}

  for (const trade of trades) {

    holdings[trade.stock] = holdings[trade.stock] || {
      quantity: [],
      price: []
    }

    if (trade.type === Constants.TRADE.TYPE.BUY) {
      holdings[trade.stock].quantity.push(trade.quantity)
      holdings[trade.stock].price.push(trade.price)
    } else {
      holdings[trade.stock].quantity.push(0 - trade.quantity)
    }
  }

  return holdings
}

/**
 * Normalizes the meta holdings map:
 {
   APPL: {
     quantity: [10, 20, -30, 50],
     price: [300, 200, 400]
   },
   GOOG: {
     quantity: [50, -20, -30],
     price: [300]
   }
 }

 into expected holdings structure:
 {
   APPL: {
     quantity: 50,
     price: 300
   }
 }

 * @param {Object} holdings
 * @return {Holding[]}
 */
const normalizeMetaHoldingsObject = function (holdings) {

  for (const key in holdings) {

    holdings[key].quantity = holdings[key].quantity.reduce((total, quantity) => total + quantity, 0)

    if (holdings[key].quantity <= 0) {
      delete holdings[key]
      continue
    }

    holdings[key].price = holdings[key].price.reduce((total, price) => total + price, 0) / holdings[key].price.length
  }

  return holdings
}

module.exports = {
  getMetaHoldingsObject,
  normalizeMetaHoldingsObject
}
