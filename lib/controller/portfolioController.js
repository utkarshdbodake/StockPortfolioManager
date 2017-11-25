'use strict'

const _ = require('lodash')
const Constants = require('./../constants')
const TradesDao = require('./../dao/tradesDao')
const Service = require('./../service')

/**
 * Get the portfolio.
 *
 * @param {String} portfolioId
 * @return {Promise<String|Object>}
 */
const getPortfolio = async function (portfolioId) {

  const trades = await TradesDao.getTrades(portfolioId)

  if (_.isEmpty(trades)) {
    return "No trades performed yet!"
  }

  const portfolio = {}

  for (const trade of trades) {

    portfolio[trade.stock] = portfolio[trade.stock] || []
    portfolio[trade.stock].push({
      type: trade.type,
      quantity: trade.quantity,
      price: trade.price,
      tradedAt: trade.tradedAt
    })
  }

  return portfolio
}

/**
 * Gets the holdings for given portfolio.
 *
 * @param {String} portfolioId
 * @return {Promise<String|Holding[]>}
 */
const getHoldings = async function (portfolioId) {

  const trades = await TradesDao.getTrades(portfolioId)

  if (_.isEmpty(trades)) {
    return "No trades performed yet!"
  }

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
      holdings[trade.stock].quantity.push(0-trade.quantity)
    }
  }

  for (const key in holdings) {

    holdings[key].quantity = holdings[key].quantity.reduce((total, quantity) => total + quantity, 0)
    holdings[key].price = holdings[key].price.reduce((total, price) => total + price, 0) / holdings[key].price.length
  }

  return holdings
}

/**
 * Gets the cumulative returns for given portfolio.
 *
 * @param {String} portfolioId
 * @return {Promise<Object>}
 */
const getCumulativeReturns = async function (portfolioId) {

  const trades = await TradesDao.getTrades(portfolioId)

  if (_.isEmpty(trades)) {
    return "No trades performed yet!"
  }

  let totalValue = 0
  let totalCurrentMarketValue = 0
  const stockNameToQuantityMap = {}

  for (const trade of trades) {

    stockNameToQuantityMap[trade.stock] = stockNameToQuantityMap[trade.stock] || 0

    if (trade.type === Constants.TRADE.TYPE.BUY) {
      totalValue += trade.quantity * trade.price
      stockNameToQuantityMap[trade.stock] += trade.quantity
    } else {
      totalValue -= trade.quantity * trade.price
      stockNameToQuantityMap[trade.stock] -= trade.quantity
    }
  }

  for (const stockName in stockNameToQuantityMap) {

    const currentPrice = await Service.getCurrentPrice(stockName)
    totalCurrentMarketValue += currentPrice * stockNameToQuantityMap[stockName]
  }

  return { cumulativeReturns: totalCurrentMarketValue - totalValue }
}

module.exports = {
  getPortfolio,
  getHoldings,
  getCumulativeReturns
}
