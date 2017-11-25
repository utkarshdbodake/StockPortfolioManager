'use strict'

const Constants = {

  BASE_URL: `/portfolio`,

  SERVER: {
    PORT: process.env.SERVER_PORT || 3000
  },

  MONGO: {
    DATABASE: {
      NAME: 'stock_portfolio',
      CONNECTION_URI: process.env.MONGO_CONNECTION_URI || `mongodb://localhost/stock_portfolio`
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
