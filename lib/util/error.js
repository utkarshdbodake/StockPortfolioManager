'use strict'

/**
 * Constructs and returns and the error object.
 *
 * @param {String} [message]
 * @param {Object} ERROR
 * @param {Object} [data]
 * @returns {Error}
 */
const constructError = function (message, ERROR, data) {

  if (message) {
    message = `${ERROR.message}, ${message}`
  } else {
    message = ERROR.message
  }

  const error = new Error()
  error.code = ERROR.CODE
  error.success = false
  error.message = message

  return error
}

module.exports = {
  constructError
}
