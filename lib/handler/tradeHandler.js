'use strict'

const Errors = require('./../constants/error')
const TradeController = require('./../controller/tradeController')

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

  TradeController.addTrade(trade)
    .then(response => res.status(200).json({
      success: true,
      message: response
    }))
    .catch(e => {

      if (e.code === Errors.TRADE.INSUFFICIENT_STOCK_QUANTITY.CODE) {
        res.status(500).json(e)
        return
      }

      res.status(500).json({ success: false })
    })
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

  TradeController.updateTrade(portfolioId, tradeId, quantity, price)
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

  TradeController.deleteTrade(portfolioId, tradeId)
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
  addTrade,
  updateTrade,
  deleteTrade
}
