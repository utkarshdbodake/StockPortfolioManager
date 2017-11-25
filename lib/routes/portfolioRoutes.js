'use strict'

const routes = require('express').Router()
const Constants = require('./../constants')
const PortfolioHandler = require('./../handler/portfolioHandler')

routes.get(`${Constants.BASE_URL}/:portfolioId`, PortfolioHandler.getPortfolio)

routes.get(`${Constants.BASE_URL}/:portfolioId/holdings`, PortfolioHandler.getHoldings)

routes.get(`${Constants.BASE_URL}/:portfolioId/returns`, PortfolioHandler.getCumulativeReturns)

module.exports = routes
