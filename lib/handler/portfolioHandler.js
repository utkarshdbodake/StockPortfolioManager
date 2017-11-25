'use strict'

const Errors = require('./../constants/error')
const PortfolioController = require('./../controller/portfolioController')

/**
 * Handles the error & sends internal server error as response.
 *
 * @param {String} info
 * @param {Object} exception
 * @param res
 * @private
 */
const _handleError = function (info, exception, res) {

  console.log(`${info} exception: ${JSON.stringify(exception)}`)
  res.status(500).json({ success: false })
}

/**
 * Get the portfolio.
 *
 * @param req
 * @param res
 */
const getPortfolio = function (req, res) {

  const portfolioId = req.params.portfolioId

  PortfolioController.getPortfolio(portfolioId)
    .then(response => res.status(200).json({
      success: true,
      message: response
    }))
    .catch(e => _handleError('Exception while getting portfolio', e, res))
}

/**
 * Get the holdings of given portfolio.
 *
 * @param req
 * @param res
 */
const getHoldings = async function (req, res) {

  const portfolioId = req.params.portfolioId

  PortfolioController.getHoldings(portfolioId)
    .then(response => res.status(200).json({
      success: true,
      message: response
    }))
    .catch(e => _handleError('Exception while getting holdings', e, res))
}

/**
 * Gets the cumulative returns for given portfolio.
 *
 * @param req
 * @param res
 */
const getCumulativeReturns = function (req, res) {

  const portfolioId = req.params.portfolioId

  PortfolioController.getCumulativeReturns(portfolioId)
    .then(response => res.status(200).json({
      success: true,
      message: response
    }))
    .catch(e => {

      if (e.code === Errors.STOCK_NOT_PRESENT.CODE) {
        res.status(400).json(e)
        return
      }

      res.status(500).json({ success: false })
    })
}

module.exports = {
  getPortfolio,
  getHoldings,
  getCumulativeReturns
}
