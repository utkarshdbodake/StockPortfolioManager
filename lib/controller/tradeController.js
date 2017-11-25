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

    const avaialbleStocksQuantity = await _getAvailableStocksQuantity(trade.portfolioId, trade.stock)

    if (avaialbleStocksQuantity < trade.quantity) {

      return Promise.reject(
        ErrorUtil.constructError(`Currently available ${avaialbleStocksQuantity} stocks of ${trade.stock}`, Errors.TRADE.INSUFFICIENT_STOCK_QUANTITY)
      )
    }
  }

  return await TradesDao.addTrade(trade)
}

/**
 * Updates the trade.
 *
 * @param {String} portfolioId
 * @param {String} tradeId
 * @param {Number} quantity
 * @param {Number} price
 * @return {Promise.<void>}
 */
const updateTrade = async function (portfolioId, tradeId, quantity, price) {

  return await TradesDao.updateTrade(portfolioId, tradeId, quantity, price)
}

/**
 * Archives the trade object in the database.
 *
 * @param {String} portfolioId
 * @param {String} tradeId
 * @return {Promise}
 */
const deleteTrade = async function (portfolioId, tradeId) {

  return await TradesDao.deleteTrade(portfolioId, tradeId)
}

module.exports = {
  addTrade,
  updateTrade,
  deleteTrade
}
