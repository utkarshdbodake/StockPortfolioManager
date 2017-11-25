'use strict'

const Constants = {

  SERVER: {
    PORT: process.env.SERVER_PORT || 3000
  },

  MONGO: {
    DATABASE: {
      NAME: 'stock_portfolio'
    }
  },

  TRADE: {
    TYPE: {
      BUY: 'buy',
      SELL: 'sell'
    }
  }
}

module.exports = Constants
