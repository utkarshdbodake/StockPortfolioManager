'use strict'

const TradesDao = require('./../dao/tradesDao')

/**
 * Returns string which is used to check if server is up & running.
 */
const getPong = () => 'Server is up & running!'


const getPortfolio = async function (portfolioId) {

  return await TradesDao.getPortfolio(portfolioId)
}

/**
 * Adds the trade.
 *
 * @param {Trade} trade
 * @return {Promise.<void>}
 */
const addTrade = async function (trade) {

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
  getPong,
  getPortfolio,
  addTrade,
  updateTrade,
  deleteTrade
}
