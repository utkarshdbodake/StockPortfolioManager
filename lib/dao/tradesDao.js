'use strict'

const TradesModel = require('./model/trades')

/**
 * Add the trade object to the database.
 *
 * @param {Trade} tradeObj
 * @return {Promise}
 */
const addTrade = async function (tradeObj) {

  const tradesModel = TradesModel.getModel()
  const trade = new tradesModel(tradeObj)
  return await trade.save()
}

/**
 * Updates the trade object in the database.
 * Note: Archived records are not updated.
 *
 * @param {String} portfolioId
 * @param {String} tradeId
 * @param {Number} quantity
 * @param {Number} price
 * @return {Promise}
 */
const updateTrade = async function (portfolioId, tradeId, quantity, price) {

  const tradesModel = TradesModel.getModel()
  const query = { portfolioId, _id: tradeId, isArchived: false }
  const update = { $set: {} }

  if (quantity) {
    update.$set.quantity = quantity
  }

  if (price) {
    update.$set.price = price
  }

  return await tradesModel.update(query, update)
}

/**
 * Archives the trade object in the database.
 *
 * @param {String} portfolioId
 * @param {String} tradeId
 * @return {Promise}
 */
const deleteTrade = async function (portfolioId, tradeId) {

  const tradesModel = TradesModel.getModel()
  const query = { portfolioId, _id: tradeId }
  const update = {
    $set: { isArchived: true }
  }

  return await tradesModel.update(query, update)
}

/**
 * Gets the trade list of the given stock.
 *
 * @param {String} portfolioId
 * @param {String} stock
 * @return {Promise<Trade[]>}
 */
const getTradesOfStock = async function (portfolioId, stock) {

  const tradesModel = TradesModel.getModel()
  const query = { portfolioId, stock, isArchived: false }

  return await tradesModel.find(query)
}

/**
 * Gets the trade list of a portfolio.
 *
 * @param {String} portfolioId
 * @return {Promise<Trade[]>}
 */
const getTrades = async function (portfolioId) {

  const tradesModel = TradesModel.getModel()
  const query = { portfolioId, isArchived: false }

  return await tradesModel.find(query)
}

module.exports = {
  addTrade,
  updateTrade,
  deleteTrade,
  getTradesOfStock,
  getTrades
}
