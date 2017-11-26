'use strict'

const Constants = {

  BASE_URL: `/portfolio`,

  SERVER: {
    PORT: process.env.PORT || 3000
  },

  MONGO: {
    DATABASE: {
      NAME: 'stock_portfolio',
      CONNECTION_URI: process.env.MONGODB_URI || `mongodb://localhost/stock_portfolio`,
      TEST_CONNECTION_URI: `mongodb://localhost/test_stock_portfolio`
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
