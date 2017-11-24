'use strict'

const Controller = require('./../controller')

/**
 * Handler for ping. Used to check if server is up & running.
 * @param {Object} req
 * @param {Object} res
 */
const getPong = function (req, res) {

  const response = Controller.getPong()
  res.status(200).json({ message: response })
}

module.exports = {
  getPong
}
