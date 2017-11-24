'use strict'

const joi = require('express-joi').Joi
const expressJoi = require('express-joi')

// Use the Joi object to create a few schemas for your routes.
const getUsersSchema = {
  limit: joi.types.Number().integer()
}

module.exports = {
  getUsersSchema: expressJoi.joiValidate(getUsersSchema)
}
