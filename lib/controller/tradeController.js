'use strict'

const Constants = require('./../constants')
const Errors = require('./../constants/error')
const ErrorUtil = require('./../util/error')
const TradesDao = require('./../dao/tradesDao')

/**
 * Gets the quantity of available stocks of respective portfolio & stock.
 *
 * @param {String} portfolioId
 * @param {String} stock
 * @return {Promise.<number>}
 * @private
 */
const _getAvailableStocksQuantity = async function (portfolioId, stock) {

  const trades = await TradesDao.getTradesOfStock(portfolioId, stock)

  let availableStocksQuantity = 0

  for (const trade of trades) {

    if (trade.type === Constants.TRADE.TYPE.BUY) {
      availableStocksQuantity += trade.quantity
    } else {
      availableStocksQuantity -= trade.quantity
    }
  }

  return availableStocksQuantity
}

/**
 * Adds the trade.
 *
 * @param {Trade} trade
 * @return {Promise.<void>}
 */
const addTrade = async function (trade) {

  if (trade.type === Constants.TRADE.TYPE.SELL) {

    const availableStocksQuantity = await _getAvailableStocksQuantity(trade.portfolioId, trade.stock)

    if (availableStocksQuantity < trade.quantity) {

      return Promise.reject(
        ErrorUtil.constructError(`Currently available ${availableStocksQuantity} stocks of ${trade.stock}`, Errors.TRADE.INSUFFICIENT_STOCK_QUANTITY)
      )
    }
  }

  return TradesDao.addTrade(trade)
}

/**
 * Updates the trade.
 *
 * @param {String} tradeId
 * @param {Number} quantity
 * @param {Number} price
 * @return {Promise.<String>}
 */
const updateTrade = async function (tradeId, quantity, price) {

  const result = await TradesDao.updateTrade(tradeId, quantity, price)

  if (result.nModified === 0) {
    return `No trade modified as contents were same.`
  }

  return `Trade modified successfully. Records updated: ${result.nModified}`
}

/**
 * Archives the trade object in the database.
 *
 * @param {String} tradeId
 * @return {Promise}
 */
const archiveTrade = async function (tradeId) {

  return TradesDao.archiveTrade(tradeId)
}

module.exports = {
  addTrade,
  updateTrade,
  archiveTrade
}
