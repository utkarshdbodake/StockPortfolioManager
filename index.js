'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Constants = require('./lib/constants')
const Routes = require('./lib/routes')
const PortfolioRoutes = require('./lib/routes/portfolioRoutes')
const TradeRoutes = require('./lib/routes/tradeRoutes')
const MongoConnection = require('./lib/dao/connect')

/**
 * Initialize the server.
 *
 * - Connect to mongo.
 * - Load the routes & start listening to mentioned Port.
 *
 * @return {Promise.<void>}
 * @private
 */
const _init = async function () {

  await MongoConnection.init()

  // Parse various different custom JSON types as JSON
  app.use(bodyParser.json({ type: 'application/json' }))

  // Connect all our routes to our application.
  app.use('/', Routes)
  app.use('/', PortfolioRoutes)
  app.use('/', TradeRoutes)

  // Turn on the server.
  app.listen(Constants.SERVER.PORT, () => console.log(`App listening on port ${Constants.SERVER.PORT}`))
}

try {
  _init()
} catch (err) {
  console.log(`Something went wrong while starting up the server. Exiting.\nError: ${JSON.stringify(err)}`)

  // Note: If something goes wrong while starting up the server (like mongo connection failure),
  // then server startup is terminated explicitly.
  process.exit(1)
}
