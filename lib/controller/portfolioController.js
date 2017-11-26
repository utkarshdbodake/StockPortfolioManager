'use strict'

const _ = require('lodash')
const Constants = require('./../constants')
const TradesDao = require('./../dao/tradesDao')
const Service = require('./../service')
const PortfolioHelper = require('./../helper/portfolioHelper')

/**
 * Gets the portfolio.
 *
 * @param {String} portfolioId
 * @return {Promise<String|Object>}
 */
const getPortfolio = async function (portfolioId) {

  const trades = await TradesDao.getTrades(portfolioId)

  if (_.isEmpty(trades)) {
    return 'No trades performed yet!'
  }

  const portfolio = {}

  for (const trade of trades) {

    portfolio[trade.stock] = portfolio[trade.stock] || []
    portfolio[trade.stock].push({
      id: trade._id,
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
    return 'No trades performed yet!'
  }

  const holdings = PortfolioHelper.getMetaHoldingsObject(trades)

  return PortfolioHelper.normalizeMetaHoldingsObject(holdings)
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
    return 'No trades performed yet!'
  }

  let totalValue = 0
  let totalCurrentMarketValue = 0
  const stockNameToQuantityMap = {}

  /*
    Create a map of stockNameToQuantity, eg:
    {
      APPL: 50,
      GOOG: 100
    }
   */
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
