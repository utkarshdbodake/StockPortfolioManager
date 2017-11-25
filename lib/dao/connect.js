'use strict'

const mongoose = require('mongoose')
const Constants = require('./../constants')

/**
 * Initialize by connecting to MongoDB.
 *
 * @return {Promise.<void>}
 */
const init = async function () {

  const connectionURI = `mongodb://localhost/${Constants.MONGO.DATABASE.NAME}`
  const options = { useMongoClient: true }

  await mongoose.connect(connectionURI, options)

  // Use native promises for mongoose.
  mongoose.Promise = global.Promise
}

/**
 * Gets the Mongo client instance.
 *
 * @return {Object}
 */
const getClient = function () {

  return mongoose
}

module.exports = {
  init,
  getClient
}
