'use strict'

/* eslint-disable */

const should = require('should')
const simple = require('simple-mock')
const rewire = require('rewire')
const TradesFixture = require('./../fixtures/trades')
const PortfolioController = require('./../../lib/controller/portfolioController')
const TradesModel = require('./../../lib/dao/model/trades')
const TradesDao = require('./../../lib/dao/tradesDao')
const MongoConnection = require('./../../lib/dao/connect')
const Service = require('./../../lib/service')

const trades = TradesFixture.getTrades()

describe('portfolioController', function () {

  before(async () => {
    await MongoConnection.init(true)
    await TradesModel.getModel().remove({})
  })

  after(async () => simple.restore())

  afterEach(async () => await TradesModel.getModel().remove({}))

  describe('getPortfolio()', function () {

    it('empty portfolio', async function () {

      const response = await PortfolioController.getPortfolio('no-such-portfolio-id-exists')
      response.should.eql('No trades performed yet!')
    })

    it('successfully get the portfolio', async function () {

      const response1 = await TradesDao.addTrade(trades.trade1)
      const response2 = await TradesDao.addTrade(trades.trade2)
      const response3 = await TradesDao.addTrade(trades.trade3)
      const response4 = await TradesDao.addTrade(trades.trade4)
      const response5 = await TradesDao.addTrade(trades.trade5)

      const portfolio = await PortfolioController.getPortfolio(TradesFixture.getPortfolioId())

      const appleStock = TradesFixture.getAppleStock()
      const googleStock = TradesFixture.getGoogleStock()

      portfolio[appleStock][0].id.should.eql(response1._id)
      portfolio[appleStock][0].type.should.eql(trades.trade1.type)
      portfolio[appleStock][0].quantity.should.eql(trades.trade1.quantity)
      portfolio[appleStock][0].price.should.eql(trades.trade1.price)
      portfolio[appleStock][0].tradedAt.should.eql(response1.tradedAt)

      portfolio[appleStock][1].id.should.eql(response2._id)
      portfolio[appleStock][1].type.should.eql(trades.trade2.type)
      portfolio[appleStock][1].quantity.should.eql(trades.trade2.quantity)
      portfolio[appleStock][1].price.should.eql(trades.trade2.price)
      portfolio[appleStock][1].tradedAt.should.eql(response2.tradedAt)

      portfolio[appleStock][2].id.should.eql(response3._id)
      portfolio[appleStock][2].type.should.eql(trades.trade3.type)
      portfolio[appleStock][2].quantity.should.eql(trades.trade3.quantity)
      portfolio[appleStock][2].price.should.eql(trades.trade3.price)
      portfolio[appleStock][2].tradedAt.should.eql(response3.tradedAt)

      portfolio[googleStock][0].id.should.eql(response4._id)
      portfolio[googleStock][0].type.should.eql(trades.trade4.type)
      portfolio[googleStock][0].quantity.should.eql(trades.trade4.quantity)
      portfolio[googleStock][0].price.should.eql(trades.trade4.price)
      portfolio[googleStock][0].tradedAt.should.eql(response4.tradedAt)

      portfolio[googleStock][1].id.should.eql(response5._id)
      portfolio[googleStock][1].type.should.eql(trades.trade5.type)
      portfolio[googleStock][1].quantity.should.eql(trades.trade5.quantity)
      portfolio[googleStock][1].price.should.eql(trades.trade5.price)
      portfolio[googleStock][1].tradedAt.should.eql(response5.tradedAt)
    })
  })

  describe('getHoldings()', function () {

    it('no trades performed yet, so no holdings', async function () {

      const response = await PortfolioController.getPortfolio('no-such-portfolio-id-exists')
      response.should.eql('No trades performed yet!')
    })

    it('successfully gets the holding - 1', async function () {

      await TradesDao.addTrade(trades.trade1)
      await TradesDao.addTrade(trades.trade2)
      await TradesDao.addTrade(trades.trade3)
      await TradesDao.addTrade(trades.trade4)
      await TradesDao.addTrade(trades.trade5)

      const holdings = await PortfolioController.getHoldings(TradesFixture.getPortfolioId())
      const appleStock = TradesFixture.getAppleStock()
      const googleStock = TradesFixture.getGoogleStock()

      holdings[appleStock].quantity.should.eql(150)
      holdings[appleStock].price.should.eql(875)
      holdings[googleStock].quantity.should.eql(100)
      holdings[googleStock].price.should.eql(1000)
    })

    it('successfully gets the holding - empty holdings - 2', async function () {

      const testPortfolioId = TradesFixture.getPortfolioId()
      const appleStock = TradesFixture.getAppleStock()

      await TradesDao.addTrade({
        portfolioId: testPortfolioId,
        stock: appleStock,
        type: 'buy',
        quantity: 10,
        price: 100
      })

      await TradesDao.addTrade({
        portfolioId: testPortfolioId,
        stock: appleStock,
        type: 'sell',
        quantity: 10,
        price: 100
      })

      const holdings = await PortfolioController.getHoldings(TradesFixture.getPortfolioId())

      holdings.should.eql('There are no holdings as of now.')
    })
  })

  describe('getCumulativeReturns()', function () {

    it('no trades performed yet, so no holdings', async function () {

      const response = await PortfolioController.getCumulativeReturns('no-such-portfolio-id-exists')
      response.should.eql('No trades performed yet!')
    })

    it('successfully gets the cumulative returns - 1', async function () {

      simple.mock(Service, 'getCurrentPrice').resolveWith(100)

      await TradesDao.addTrade(trades.trade1)
      await TradesDao.addTrade(trades.trade2)
      await TradesDao.addTrade(trades.trade3)
      await TradesDao.addTrade(trades.trade4)
      await TradesDao.addTrade(trades.trade5)

      const response = await PortfolioController.getCumulativeReturns(TradesFixture.getPortfolioId())

      response.cumulativeReturns.should.eql(-220000)
    })

    it('successfully gets the cumulative returns - 1', async function () {

      simple.mock(Service, 'getCurrentPrice').resolveWith(2000)

      await TradesDao.addTrade(trades.trade1)
      await TradesDao.addTrade(trades.trade2)
      await TradesDao.addTrade(trades.trade3)
      await TradesDao.addTrade(trades.trade4)
      await TradesDao.addTrade(trades.trade5)

      const response = await PortfolioController.getCumulativeReturns(TradesFixture.getPortfolioId())

      response.cumulativeReturns.should.eql(255000)
    })
  })
})
