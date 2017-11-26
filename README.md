# Stock Portfolio Manager
A web-server (with HTTP APIs) that manages stock portfolios.

-----
# Steps to run:
1. Install Node.js version ```8.9.1```
2. Install MongoDB Community Server edition version ```3.4.10```.
3. On command line type ```mongod``` and hit enter. (Will run Mongo on its default port ```27017```)
4. Go to root directory of *StockPortfolioManager* project.
5. On command line type ```npm install``` and hit enter.
6. On command line type ```npm start``` and hit enter.
- Yahoo 🎉 our server is up and running on default port ```3000```.
- Go through below docs, to understand the ```Entities``` and supported ```API```'s.
- Optional: You can also run test cases by ```npm test```.
-----
# Entity
- Logically there are 3 entities: `Portfolio, Stock & Trade`. If we were to design our systems in SQL DB, then there would have been 3 tables for each, having 1:n relationship between (Portfolio to Stock) and (Stock to Trade) respectively.
- But as we wanted to store data in NOSQL datastore, we have clubbed these entities into single model as shown below. As we don't want to maintain any explicit relationship between tables in NOSQL.
- Also among all the NOSQL DB's we have chosen MongoDB document data store, bcoz it provides atomicity at the document level & is strongly consistent (providing CP of the CAP theorem).
    ```
    {
        "_id": Mongo ObjectId,
        "portfolioId": String,
        "stock": String,
        "type": String,
        "quantity": Integer,
        "price": Float,
        "tradedAt": Date,
        "isArchived": Boolean
    }
    
    _id             : Uniquesly identifies the trade. No other document can have the same value. Thus integrity is maintained across all the trades.        
    portfolioId     : This field is indexed. Identifies portfolios.
    stock           : This field is indexed. Identifies stocks.
    type            : Enum having value either "buy" or "sell"
    quantity        : Quantity of stocks in the trade.
    price           : Price of stock in the trade.
    tradedAt        : UTC Date of the trade.
    isArchived      : If true, denotes trade is archived
    ```

- As per our use case the queries which would be much more frequent are: Get portfolio, get trades of a stock & get trades. So as a result we are indexing **portfolioId** and **stock**. By default **_id** is indexed by MongoDB.
- Why **id** field is **String** data type instead of **Number** data type for **tradeId and portfolioId**? --> Because in JS (as most of our web clients would be in JS) the Number cannot go beyond *9007199254740991*. So we don't want to limit the number of records in our table by mere **JS language's data type limitation**! That's why all id's are choosen to be of *String* data type.

-----

# API
### GET Portfolio

- API: ```localhost:3000/portfolio/<portfolioId>```
- HTTP method: GET
- Gets the entire portfolio of given portfolioId.
    ```
    Example using cURL

    curl -X GET \
  http://localhost:3000/portfolio/portfolio12345
    ```
    ```
    Success response
    Status code: 200 OK
    
    {
        "success": true,
        "message": {
            "<stock_1>": [
                {
                    "id": "id of the trade",
                    "type": "buy/sell",
                    "quantity": <quantity>,
                    "price": <price>,
                    "tradedAt": "UTC date of the trade"
                },
                ...
            ]
        }
    }
    ```
    ```
    Failure response
    Status code: 200 OK
    
    When portfolio id is not present `or` if there were no trades performed yet.
    {
        "success": false,
        "message": "No trades performed yet!"
    }
    ```

### GET Holdings

- API: ```localhost:3000/portfolio/<portfolioId>/holdings```
- HTTP method: GET
- Gets the holdings of given portfolioId.
    ```
    Example using cURL
    
    curl -X GET \
  http://localhost:3000/portfolio/portfolio12345/holdings
    ```
    ```
    Success response
    Status code: 200 OK
    
    {
        "success": true,
        "message": {
            "<stock>": {
                "quantity": <quantity>,
                "price": <price>
            },
           ...
        }
    }
    ```
    ```
    Failure response 
    Status code: 200 OK
    
    When portfolio id is not present `or` if there were no trades performed yet.
    {
        "success": false,
        "message": "No trades performed yet!"
    }
    
    When current holdings of the portfolio is none after the trades performed.
    {
        "success": false,
        "message": "There are no holdings as of now."
    }
    ```

### GET Cumulative returns

- API: ```localhost:3000/portfolio/<portfolioId>/returns```
- HTTP method: GET
- Gets the cumulative returns of given portfolioId.
- Cumulative return's value can be positive (denoting profit) or negative (denoting loss). 
    ```
    Example using cURL
    
    curl -X GET \
  http://localhost:3000/portfolio/portfolio12345/returns
    ```
    ```
    Success response
    Status code: 200 OK
    
    {
        "success": true,
        "message": {
            "cumulativeReturns": <cumulative return>
        }
    }
    ```

### ADD Trade

- API: ```localhost:3000/portfolio/trade```
- HTTP method: POST
- Adds the trade under given portfolioId.
    ```
    Example using cURL
    
    curl -X POST \
      http://localhost:3000/portfolio/trade \
      -H 'content-type: application/json' \
      -d '{
    	"portfolioId": "portfolio12345",
    	"stock": "GOOG",
    	"type": "buy",
    	"quantity": 100,
    	"price": 100
    }
    ```
    ```
    Success response
    Status code: 200 OK
    
    {
        "success": true,
        "message": <Trade object which was successfully inserted into DB>
    }
    ```
    ```
    Failure response 
    Status code: 200 OK
    
    When user tries to sell a stock, but given quantity exceeds than what he has.
    {
        "code": 5001,
        "success": false,
        "message": "Insufficient quantity of stocks available., Currently available <quantity> stocks of <stock name>"
    }
    ```

### Update Trade

- API: ```localhost:3000/portfolio/trade```
- HTTP method: PUT
- Updates the trade under given tradeId.
    ```
    Example using cURL
    
    curl -X PUT \
      http://localhost:3000/portfolio/trade \
      -H 'content-type: application/json' \
      -d '{
    	"tradeId": "5a1ac11cb990810bdda2cb7d",
    	"quantity": 50,
    	"price": 2003
    }'
    ```
    ```
    Success response
    Status code: 200 OK
    
    If trade was successfully modified.
    {
        "success": true,
        "message": "Trade modified successfully. Records updated: 1"
    }
    
    If trade contents were same.
    {
        "success": true,
        "message": No trade modified as contents were same"
    }
    ```
    ```
    Failure response 
    Status code: 400 OK
    
    If given tradeId is not present in DB.
    {
        "success": false,
        "message": "Trade Id: <tradeID> is not present"
    }
    ```

### Delete Trade

- API: ```localhost:3000/portfolio/trade/<tradeId>```
- HTTP method: DELETE
- Deletes the trade with given tradeId.
    ```
    Example using cURL
    
    curl -X DELETE \
  http://localhost:3000/portfolio/trade/5a1a8926590fbe828d1516a3
    ```
    ```
    Success response
    Status code: 200 OK
    
    If trade was successfully archived.
    {
        "success": true,
        "message": "Trade archived successfully."
    }
    
    If trade was already archived.
    {
        "success": true,
        "message": "Trade is already archived."
    }
    ```
    ```
    Failure response 
    Status code: 400 OK
    
    If given tradeId is not present in DB.
    {
        "success": false,
        "message": "Trade Id: <tradeID> is not present"
    }
    ```
-----
# Test cases

- Run **npm test** from command line at the root directory of the project to run the test cases.
- Test cases are run on seperate **test** database. As we don't want to run test cases on our actual live DB!
