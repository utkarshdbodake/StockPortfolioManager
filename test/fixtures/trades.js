'use strict'

const _ = require('lodash')

const testPortfolioId = 'testPortfolioId'
const appleStock = 'AAPL'
const googleStock = 'GOOG'

const trades = {
  trade1: {
    portfolioId: testPortfolioId,
    stock: appleStock,
    type: 'buy',
    quantity: 100,
    price: 900
  },
  trade2: {
    portfolioId: testPortfolioId,
    stock: appleStock,
    type: 'sell',
    quantity: 50,
    price: 1000
  },
  trade3: {
    portfolioId: testPortfolioId,
    stock: appleStock,
    type: 'buy',
    quantity: 100,
    price: 850
  },
  trade4: {
    portfolioId: testPortfolioId,
    stock: googleStock,
    type: 'buy',
    quantity: 200,
    price: 1000
  },
  trade5: {
    portfolioId: testPortfolioId,
    stock: googleStock,
    type: 'sell',
    quantity: 100,
    price: 800
  }
}

module.exports = {
  getPortfolioId: () => _.cloneDeep(testPortfolioId),
  getAppleStock: () => _.cloneDeep(appleStock),
  getGoogleStock: () => _.cloneDeep(googleStock),
  getTrades: () => _.cloneDeep(trades)
}
