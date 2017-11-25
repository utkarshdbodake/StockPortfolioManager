'use strict'

const Controller = require('./../controller')

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
 * Handler for ping. Used to check if server is up & running.
 * @param {Object} req
 * @param {Object} res
 */
const getPong = function (req, res) {

  const response = Controller.getPong()
  res.status(200).json({ message: response })
}

const getPortfolio = function (req, res) {

  const portfolioId = req.params.portfolioId

  Controller.getPortfolio(portfolioId)
    .then(response => res.status(200).json({
      success: true,
      message: response
    }))
    .catch(e => _handleError('Exception while getting portfolio', e, res))
}

/**
 * Gets the necessary fields and forms the trade object & adds the trade to db.
 *
 * @param {Object} req
 * @param {Object} res
 */
const addTrade = function (req, res) {

  const trade = {
    portfolioId: req.body.portfolioId,
    stock: req.body.stock,
    type: req.body.type,
    quantity: req.body.quantity,
    price: req.body.price
  }

  Controller.addTrade(trade)
    .then(response => res.status(200).json({
      success: true,
      message: response
    }))
    .catch(e => _handleError('Exception while adding trade', e, res))
}

/**
 * Gets the necessary fields $ updates the trade in db.
 *
 * @param {Object} req
 * @param {Object} res
 */
const updateTrade = function (req, res) {

  const portfolioId = req.body.portfolioId
  const tradeId = req.body.tradeId
  const quantity = req.body.quantity
  const price = req.body.price

  if (!quantity && ! price) {
    return res.status(400).json({ success: false, message: `Both quantity & price are missing!` })
  }

  Controller.updateTrade(portfolioId, tradeId, quantity, price)
    .then(response => res.status(200).json({
      success: true,
      message: response
    }))
    .catch(e => {

      if (e.name === 'CastError') {
        res.status(400).json({ success: false, message: `Trade Id: ${tradeId} is not present` })
        return
      }

      res.status(500).json({ success: false })
    })
}

/**
 * Archives the trade object in the database.
 *
 * @param {Object} req
 * @param {Object} res
 */
const deleteTrade = function (req, res) {

  const portfolioId = req.params.portfolioId
  const tradeId = req.params.tradeId

  Controller.deleteTrade(portfolioId, tradeId)
    .then(response => res.status(200).json({
      success: true,
      message: response
    }))
    .catch(e => {

      if (e.name === 'CastError') {
        res.status(400).json({ success: false, message: `Trade id: ${tradeId} is not present under Portfolio id: ${portfolioId}` })
        return
      }

      res.status(500).json({ success: false })
    })
}

module.exports = {
  getPong,
  getPortfolio,
  addTrade,
  updateTrade,
  deleteTrade
}
