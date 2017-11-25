'use strict'

module.exports = {

  TRADE: {
    INSUFFICIENT_STOCK_QUANTITY: {
      CODE: 5001,
      success: false,
      message: `Insufficient quantity of stocks available.`
    }
  },
  STOCK_NOT_PRESENT: {
    CODE: 5002,
    success: false,
    message: `Stock is not available on yahoo finance.`
  }
}
