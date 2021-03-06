'use strict'

/* eslint-disable */

const should = require('should')
const simple = require('simple-mock')
const rewire = require('rewire')
const TradesFixture = require('./../fixtures/trades')
const TradesModel = require('./../../lib/dao/model/trades')
const TradesDao = require('./../../lib/dao/tradesDao')
const MongoConnection = require('./../../lib/dao/connect')

const trade1 = TradesFixture.getTrades().trade1


describe('tradesDao', function () {

  before(async () => {
    await MongoConnection.init(true)
    await TradesModel.getModel().remove({})
  })

  after(async () => simple.restore())

  afterEach(async () => await TradesModel.getModel().remove({}))

  describe('trade operations', function () {

    it('add trade entity successfully', async function () {

      const response = await TradesDao.addTrade(trade1)

      const trade = await TradesDao.getTrade(response._id)

      trade.portfolioId.should.be.eql(trade1.portfolioId)
      trade.stock.should.be.eql(trade1.stock)
      trade.type.should.be.eql(trade1.type)
      trade.quantity.should.be.eql(trade1.quantity)
      trade.price.should.be.eql(trade1.price)
      should.exist(trade.tradedAt)
    })

    it('update trade entity successfully', async function () {

      const response = await TradesDao.addTrade(trade1)

      await TradesDao.updateTrade(response._id, 1, 1)

      const trade = await TradesDao.getTrade(response._id)

      trade.portfolioId.should.be.eql(trade1.portfolioId)
      trade.stock.should.be.eql(trade1.stock)
      trade.type.should.be.eql(trade1.type)
      trade.quantity.should.be.eql(1)
      trade.price.should.be.eql(1)
      should.exist(trade.tradedAt)
    })

    it('archive trade entity successfully', async function () {

      const response = await TradesDao.addTrade(trade1)

      await TradesDao.archiveTrade(response._id)

      const trade = await TradesDao.getTrade(response._id)

      should.not.exist(trade)
    })
  })
})
