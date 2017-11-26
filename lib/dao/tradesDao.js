'use strict'

const TradesModel = require('./model/trades')

/**
 * Add the trade object to the database.
 *
 * @param {Trade} tradeObj
 * @return {Promise}
 */
const addTrade = function (tradeObj) {

  const TradesModel1 = TradesModel.getModel()
  const trade = new TradesModel1(tradeObj)
  return trade.save()
}

/**
 * Updates the trade object in the database.
 * Note: Archived records are not updated.
 *
 * @param {String} tradeId
 * @param {Number} quantity
 * @param {Number} price
 * @return {Promise}
 */
const updateTrade = function (tradeId, quantity, price) {

  const tradesModel = TradesModel.getModel()
  const query = { _id: tradeId, isArchived: false }
  const update = { $set: {} }

  if (quantity) {
    update.$set.quantity = quantity
  }

  if (price) {
    update.$set.price = price
  }

  return tradesModel.update(query, update)
}

/**
 * Archives the trade object in the database.
 *
 * @param {String} tradeId
 * @return {Promise}
 */
const archiveTrade = function (tradeId) {

  const tradesModel = TradesModel.getModel()
  const query = { _id: tradeId }
  const update = {
    $set: { isArchived: true }
  }

  return tradesModel.update(query, update)
}

/**
 * Deletes the trade object in the database.
 *
 * @param {String} tradeId
 * @return {Promise}
 */
const deleteTrade = function (tradeId) {

  const tradesModel = TradesModel.getModel()
  const query = { _id: tradeId }

  return tradesModel.deleteOne(query)
}

/**
 * Gets the trade list of the given stock.
 *
 * @param {String} portfolioId
 * @param {String} stock
 * @return {Promise<Trade[]>}
 */
const getTradesOfStock = function (portfolioId, stock) {

  const tradesModel = TradesModel.getModel()
  const query = { portfolioId, stock, isArchived: false }

  return tradesModel.find(query)
}

/**
 * Gets the trade list of a portfolio.
 *
 * @param {String} portfolioId
 * @return {Promise<Trade[]>}
 */
const getTrades = function (portfolioId) {

  const tradesModel = TradesModel.getModel()
  const query = { portfolioId, isArchived: false }

  return tradesModel.find(query)
}

module.exports = {
  addTrade,
  updateTrade,
  archiveTrade,
  deleteTrade,
  getTradesOfStock,
  getTrades
}
