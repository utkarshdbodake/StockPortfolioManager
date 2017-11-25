'use strict'

const _ = require('lodash')
const yahooFinance = require('yahoo-finance')
const Errors = require('./../constants/error')
const ErrorUtil = require('./../util/error')

/**
 * Gets the current market price of a stock.
 *
 * @param {String} stockName
 * @return {Promise<Number>}
 */
const getCurrentPrice = function(stockName) {

  return yahooFinance.quote({
    symbol: stockName,
    modules: [ 'price' ] // see the docs for the full list
  })
    .then(res => {

      if (_.get(res, 'price.regularMarketPrice') == undefined) {
        return Promise.reject(
          ErrorUtil.constructError(`Stock name: ${stockName}`, Errors.STOCK_NOT_PRESENT)
        )
      }

      return res.price.regularMarketPrice
    })
}

module.exports = {
  getCurrentPrice
}
