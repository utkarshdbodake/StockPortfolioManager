'use strict'

const express = require('express')
const constants = require('./lib/constants')
const routes = require('./lib/routes')
const app = express()

// Connect all our routes to our application.
app.use('/', routes)

// Turn on the server.
app.listen(constants.SERVER.PORT, () => console.log(`App listening on port ${constants.SERVER.PORT}`))
