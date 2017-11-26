'use strict'

/* eslint-disable */

const should = require('should')
const simple = require('simple-mock')
const rewire = require('rewire')
const TradesFixture = require('./../fixtures/trades')
const TradesController = require('./../../lib/controller/tradeController')
const TradesModel = require('./../../lib/dao/model/trades')
const TradesDao = require('./../../lib/dao/tradesDao')
const MongoConnection = require('./../../lib/dao/connect')
const Error = require('./../../lib/constants/error')

const trade1 = TradesFixture.getTrades().trade1
const trade2 = TradesFixture.getTrades().trade2


describe('tradesController', function () {

  before(async () => {
    await MongoConnection.init(true)
    await TradesModel.getModel().remove({})
  })

  after(async () => simple.restore())

  afterEach(async () => await TradesModel.getModel().remove({}))

  describe('trade operations', function () {

    it('buy trade entity successfully', async function () {

      const response = await TradesController.addTrade(trade1)

      const trade = await TradesDao.getTrade(response._id)

      trade.portfolioId.should.be.eql(trade1.portfolioId)
      trade.stock.should.be.eql(trade1.stock)
      trade.type.should.be.eql(trade1.type)
      trade.quantity.should.be.eql(trade1.quantity)
      trade.price.should.be.eql(trade1.price)
      should.exist(trade.tradedAt)
    })

    it('cannot sell due to insufficient stock quantity', function (done) {

      TradesController.addTrade(trade2)
        .catch(err => {
          err.code.should.eql(Error.TRADE.INSUFFICIENT_STOCK_QUANTITY.CODE)
          done()
        })
    })
  })
})
