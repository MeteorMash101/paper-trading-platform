# SOURCE: https://www.django-rest-framework.org/tutorial/3-class-based-views/
# Create your views here.
from accounts.models import Account
from accounts.serializers import AccountSerializer, StockListSerializer, StockNumSerializer, PortfolioValueSerializer, TransactionHistorySerializer, BoolSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stocks.financeAPI import stock_info as si
from datetime import datetime, date, timedelta
from decimal import Decimal

from django.contrib.auth.models import User # we are extending Django's User

class AccountList(APIView):
    """
    List all accounts, or create a new Account.
    """
    def get(self, request):
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

class AccountDetail(APIView):
    """
    Create, retrieve, update or delete a Account instance.
    """
    def post(self, request, *args, **kwargs):
        print("IN POST AccountDetail...w/ data:", request.data)
        # EDIT: need way to add User's pk to req. data to map this Account -> User.
        # tried: User.objects.get(email=request.data['email']), request.data['email'].split('@')[0]
        # request.data['user'] = ?
        # print("UPDATED REQ. DATA", request.data)
        request.data["start_date"] = datetime.today().strftime("%Y-%m-%d")
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # saves to DB
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("ERROR: ",serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get_object(self, request, *args, **kwargs):
        print("IN GETOBJ...")
        pk = self.kwargs.get('pk')
        try:
            return Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return None

    def get(self, request, pk):
        
        print("IN GET...w/ pk:", pk)
        AccountObj = self.get_object(pk)
        # EDIT: don't understand
        if AccountObj != None: # account exists
            serializer = AccountSerializer(AccountObj)
            # self.loadPortfolioValueHistory(AccountObj)
            return Response(serializer.data)
        else: # account doesn't exist, create new
            print("Account not found, sending None...")
            return Response(None)

    def put(self, request, pk):
        Account = self.get_object(pk)
        serializer = AccountSerializer(Account, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        Account = self.get_object(pk)
        Account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # EDIT: how are these called?
    '''
    With the exception of the current day, all portfolio value data points are end of day values
    Every log in loads all the days between that login and the previous one.
    Should be called on log in
    '''
    def loadPortfolioValueHistory(self, account):
        if account.portfolio_value_history == None:
            account.portfolio_value_history = {"data":{}}
        if len(account.portfolio_value_history["data"].keys()) == 0:
            startDate = date.fromisoformat(account.start_date)
        else:
            startDate = date.fromisoformat(sorted(list(account.portfolio_value_history["data"].keys()))[-1])
        self.fillDatabase(account.portfolio_value_history["data"], startDate, account.transaction_history["history"])
        account.save()


    def curOwnedStockGen(self, transaction_history, start_date):
        nextDay = timedelta(days=1)
        if len(transaction_history) == 0:
            curDay = start_date
            while True:
                yield (curDay, {})
                curDay += nextDay
        history = transaction_history.copy()
        nextDay = timedelta(days=1)
        currentlyOwned = {}
        curDay = date.fromisoformat(history[0]["date"])
        while len(history) > 0:
            transaction = history[0]
            while date.fromisoformat(transaction["date"]) == curDay:
                history.pop(0)
                self.updateCurOwned(currentlyOwned, transaction["type"], transaction["stock"], transaction["quantity"])
                if len(history) == 0:
                    break
                transaction = history[0]
            yield (curDay, currentlyOwned)
            curDay += nextDay
        while True:
            yield (curDay, currentlyOwned)
            curDay += nextDay

    def updateCurOwned(self, currentlyOwned, transactionType, symbol, quantity):
        if transactionType == "sell":
            currentlyOwned[symbol] -= quantity
        else:
            if symbol in currentlyOwned:
                currentlyOwned[symbol] += quantity
            else:
                currentlyOwned[symbol] = quantity
            
    def portfolioValueGen(self, start_date, history):
        daysStocks = self.curOwnedStockGen(history, start_date)
        nextDay = timedelta(days=1)
        day = start_date
        (curDay, owned) = next(daysStocks)
        prevVal = 0
        while curDay < start_date:       #If the history starts before the day we want
            (curDay, owned) = next(daysStocks)
        if curDay > start_date:          #If the history starts after the day we want
            while curDay > day:
                yield (day, 0)
                day += nextDay
        while curDay < date.today():     #actually calculating in line with history
            try:
                prevVal = self.valueOf(owned, curDay)
                yield (curDay, prevVal)
            except KeyError:
                yield(curDay, prevVal)
            (curDay, owned) = next(daysStocks)
        yield(curDay, self.curValueOf(owned))

    def valueOf(self, stocks, curDay):
        totPrice = 0
        invalid = True
        lastOpenMarket = curDay
        stockKeys = list(stocks.keys())
        if len(stockKeys) == 0:
            return 0
        while invalid:
            try:
                totPrice += stocks[stockKeys[0]] * si.get_data(stockKeys[0], start_date=lastOpenMarket.strftime("%Y-%m-%d"), end_date=(lastOpenMarket+timedelta(days=1)).strftime("%Y-%m-%d")).iloc[-1]["close"]
                invalid = False
            except:
                print(lastOpenMarket)
                lastOpenMarket -= timedelta(days=1)
                
        if len(stockKeys) == 1:
            return totPrice
        for symbol, quantity in list(stocks.items())[1:]:
            totPrice += quantity * si.get_data(symbol, start_date=lastOpenMarket.strftime("%Y-%m-%d"), end_date=(lastOpenMarket+timedelta(days=1)).strftime("%Y-%m-%d")).iloc[-1]["close"]
        return totPrice

    def curValueOf(self, stocks):
        totPrice = 0
        for symbol, quantity in stocks.items():
            totPrice += quantity*si.get_live_price(symbol)
        return totPrice
            
    def fillDatabase(self, d, starting: date, history):
        dailyPortfolioValue = self.portfolioValueGen(starting, history)
        (day, value) = next(dailyPortfolioValue)
        while day < date.today():
            d[day.strftime("%Y-%m-%d")] = int(value*100)
            (day, value) = next(dailyPortfolioValue)
        d[day.strftime("%Y-%m-%d")] = int(value*100)
    

# class AccountBalance(APIView):
#     """
#     Update an Account's buying power.
#     """
#     def put(self, request, pk):
#         Account = self.get_object(pk)
#         print("AMOUNT SENT IN BP PUT: ", request.data['amount'], type(request.data['amount']))
#         serializer = AccountSerializer(Account, data=request.data)
#         # if serializer.is_valid():
#         #     serializer.save()
#         #     return Response(serializer.data)
#         return Response(None)

class AccountStocksOwned(APIView):
    '''
    When making a get request, the data only needs one field "info". It may also need "symbol" depending on what you want
    info options:
    stock_list_detailed     includes every transaction for stocks currently owned with date purchased and purchase price
    num_of_ticker_stocks    the amount of shares they own of the stock. Must specify "symbol" in the request
    portfolio_value         The total value of the users portfolio
    stock_list_display      A list of every stock the user owns, its quantity, current price, change %, and change direction

    Examples: 
    curl -d "{"info":"stock_list_display"}" -H "Content-Type: application/json" -X GET http://127.0.0.1:8000/accounts/[ACCOUNT_GOOG_ID]/getStocks

    curl -d "{"info":"num_of_ticker_stocks", "symbol": "tsla"}" -H "Content-Type: application/json" -X GET http://127.0.0.1:8000/accounts/[ACCOUNT_GOOG_ID]/getStocks
    '''
    def get(self, request, goog_id):
        # data = request.data
        data = request.query_params.get('info', None)
        print("IN GET...w/ data", data)
        account = self.get_object(goog_id)
        if account != None:
            if data == "stock_list_detailed":            #Returns list of all their transactions with stocks they currently own.
                serializer = StockListSerializer({"stock_list":account.ownedStocks})
                return Response(serializer.data)
            elif data == "num_of_ticker_stocks":        #returns the amount of the stock they have for the given ticker
                numOfStock = self.countStock(account.ownedStocks, data["symbol"])
                serializer = StockNumSerializer({"quantity_owned":numOfStock})
                return Response(serializer.data)
            elif data == "portfolio_value":             #returns just the portfolio value
                portfolio_value = self.calculateValue(account.ownedStocks)
                portfolio_change = self.calculatePortfolioChange(account.ownedStocks, portfolio_value)
                serializer = PortfolioValueSerializer({"portfolio_value":portfolio_value, "percent_change": portfolio_change, "change_direction": portfolio_change > 0})
                print("sending PV")
                return Response(serializer.data)
            elif data == "stock_list_display":          #returns each stock they own with how much they own, price, %change, and changeDir
                stockList = self.ownedStocksForDisplay(account.ownedStocks)
                serializer = StockListSerializer({"stock_list":stockList})
                return Response(serializer.data)
            elif data == "buying_power_history":
                history = self.builBuyingPowerHistory(account)
                serializer = TransactionHistorySerializer({"transaction_history":history})
                return Response(serializer.data)
            else:
                return Response(None)
        else:
            print("Account not found, sending None...")
            return Response(None)

    '''
    Buys and sells stock and updates user list accordingly
    Requires data to have "action" set to either "buy" or "sell", the "stock" to be the symbol for the stock the user
    wishes to buy, and the "quantity" that they want of that stock.

    example:
    curl -d {"action":"buy", "stock":"tsla", "quantity":100} -H "Content-Type: application/json" -X PUT http://127.0.0.1:8000/accounts/[ACCOUNT_GOOG_ID]/getStocks

    ----This needs to be updated to work with the client sending the price
    ----This may need to include updating the balance
    '''
    def put(self, request, goog_id):
        account = self.get_object(goog_id)
        if account == None:
            print("Account not found, sending None...")
            return Response(None)

        data = request.data
        if account.ownedStocks == None:
            account.ownedStocks = {} # EDIT: can we set this to default in model?
        owned = account.ownedStocks
        if data["action"] == "buy":
            valid = self.purchaseStock(data, account)
        else: # EDIT: this might accept nulls, try dif. err checking here
            valid = self.sellStock(data, account)
        if not valid:
             return Response(None, status=status.HTTP_400_BAD_REQUEST)            #idk which error to put
        account.save()
        serializer = StockListSerializer({"stock_list":owned})
        return Response(serializer.data)

    # EDIT: duplicate
    #Returns the account object
    def get_object(self, request, *args, **kwargs):
        print("IN GETOBJ...")
        pk = self.kwargs.get('goog_id')
        try:
            return Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return None

    #This gets the portfolio value for the user
    def calculateValue(self, owned):
        value = 0
        for ticker in owned.keys():
            value += si.get_live_price(ticker) * self.countStock(owned, ticker)
        return value

    #Goes through stock purchases to find how many of a stock the user has
    def countStock(self, owned, symbol):
        if symbol not in owned.keys():
            return 0

        quantity = 0
        for order in owned[symbol]:
            quantity += int(order["quantity"])
        return quantity

    #Adds the purchase of the stock to the list
    def purchaseStock(self, data, account):
        print("HERE DATA IN PS:, ", data)
        owned = account.ownedStocks
        newPurchase = {
            "quantity": data["quantity"],
            "datePurchased": datetime.today().strftime("%Y-%m-%d"),
            "purchasePrice": si.get_live_price(data["stock"])
        }
        if data["stock"].lower() in owned.keys():   #if the user already owns some stock
                owned[data["stock"].lower()].append(newPurchase) #Convert to getting from server
        else:   #create new entry in the dictionary for the stock
            owned[data["stock"].lower()] = [newPurchase]
        self.recordTransaction(account, "buy", newPurchase, data["stock"])
        account.balance -= Decimal.from_float(float(data["quantity"])*si.get_live_price(data["stock"])) # EDIT: live price here cud be dif!, use same.
        return True
    
    # EDIT: understnd this  ab it mroe
    #Sells the given amount of stock
    #enough stock being owned is checked for in the client
    def sellStock(self, data, account):
        owned = account.ownedStocks
        if data["stock"].lower() not in owned.keys():
            return False
        stockPurchases = owned[data["stock"].lower()]
        if len(stockPurchases) == 0:
            return False
        toSell = int(data["quantity"])
        while toSell > 0:
            if toSell >= int(stockPurchases[0]["quantity"]):
                toSell -= int(stockPurchases[0]["quantity"])
                stockPurchases.pop(0)
            else:
                stockPurchases[0]["quantity"] = str(int(stockPurchases[0]["quantity"]) - toSell)
                toSell = 0

        newSale = {
            "quantity": data["quantity"],
            "datePurchased": datetime.today().strftime("%Y-%m-%d"),
            "purchasePrice": si.get_live_price(data["stock"])
        }
        self.recordTransaction(account, "sell", newSale, data["stock"])
        account.balance += Decimal.from_float(float(data["quantity"]) * si.get_live_price(data["stock"]))
        return True
    
    #For displaying owned stocks on the home page, this returns the JSON for it
    def ownedStocksForDisplay(self, owned):
        stocks = []
        price_and_percent = si.get_price_and_change_for_list(owned.keys())
        for symbol in owned.keys():
            totOwned = 0
            for purchase in owned[symbol]:
                totOwned += int(purchase["quantity"])
            price = price_and_percent[symbol]["price"]
            percent_change = price_and_percent[symbol]["percent_change"]
            stocks.append({
                "symbol": symbol,
                "shares": totOwned,
                "price": price,
                "percent_change": percent_change,
                "change_direction": percent_change > 0
            })
        return stocks

    def calculatePortfolioChange(self, owned, curVal):
        totalSpent = 0
        for purchases in owned.values():
            for purchase in purchases:
                totalSpent += int(purchase["quantity"]) * float(purchase["purchasePrice"])
        percent_change = 100*(curVal - totalSpent) / totalSpent
        return percent_change

    def recordTransaction(self, account, type, details, symbol):
        if account.transaction_history == None:
            account.transaction_history = {"history":[]}
        history = account.transaction_history
        # if "history" not in history.keys():
        #     history["history"] = []
        history["history"].append({
            "type": type,
            "stock": symbol,
            "quantity": details["quantity"], 
            "date": details["datePurchased"], 
            "stockPrice": details["purchasePrice"]
        })

    # EDIT: need to understand this.
    def builBuyingPowerHistory(self, account):
        startDate = account.start_date
        if account.transaction_history == None or "history" not in account.transaction_history.keys():
            return {"data": {datetime.today().strftime("%Y-%m-%d"): account.balance}}
        history = account.transaction_history["history"]
        if len(history) == 0:
            return {"data": {datetime.today().strftime("%Y-%m-%d"): account.balance}}

        balance = account.balance
        balanceHistory = {datetime.today().strftime("%Y-%m-%d"): account.balance}
        curDate = datetime.today().strftime("%Y-%m-%d")
        for transaction in history[::-1]:
            if transaction["date"] == curDate:
                if transaction["type"] == "buy":
                    balance += Decimal.from_float(transaction["quantity"]*transaction["stockPrice"])
                else:
                    balance -= Decimal.from_float(transaction["quantity"]*transaction["stockPrice"])
            else:
                curDate = transaction["date"]
                balanceHistory[curDate] = balance
                if transaction["type"] == "buy":
                    balance += Decimal.from_float(transaction["quantity"]*transaction["stockPrice"])
                else:
                    balance -= Decimal.from_float(transaction["quantity"]*transaction["stockPrice"])
        if startDate not in balanceHistory.keys():
            balanceHistory[startDate] = balance
        return {"data": balanceHistory}

class AccountWatchList(APIView):

    def get(self, request, goog_id):
        data = request.data
        print(data)
        account = self.get_object(goog_id)
        if account != None:
            if data["info"] == "stocks":            #Returns a list of just the symbols for watch list stocks
                serializer = StockListSerializer({"stock_list":account.watchList["stocks"]})
                return Response(serializer.data)
            elif data["info"] == "detailed_stocks":        #returns list with each stock's price, percent change, and change direction
                detailedList = self.getWatchListStockInfo(account.watchList)
                serializer = StockListSerializer({"stock_list":detailedList})
                return Response(serializer.data)
            elif data["info"] == "check_stock":
                serializer = BoolSerializer({"isPresent": data["symbol"] in account.watchList["stocks"]})
                return Response(serializer.data)
            else:
                return Response(None)
        else:
            print("Account not found, sending None...")
            return Response(None)
        

    #Acts as a switch. Simply make a put request with the "symbol" of the data being the 
    #Ticker you wish to toggle. If the ticker is in the list it is removed, if it is 
    #not in the list it is added. So if there is say a start symbol next to stocks,
    #clicking it will add it, but clicking it again will remove it.
    def put(self, request, goog_id):
        account = self.get_object(goog_id)
        if account == None:
            print("Account not found, sending None...")
            return Response(None)

        data = request.data
        if account.watchList == None:
            account.watchList = {"stocks": []}
        watched = account.watchList["stocks"]
        try:
            watched.pop(watched.index(data["symbol"]))
        except ValueError: #If the stock is not being watched, add it to the watch list
            watched.append(data["symbol"])
        account.save()
        return Response(None)

    #Returns the account object
    def get_object(self, request, *args, **kwargs):
        print("IN GETOBJ...")
        pk = self.kwargs.get('goog_id')
        try:
            return Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return None

    #For displaying owned stocks on the home page, this returns the JSON for it
    def getWatchListStockInfo(self, watchList):
        if "stocks" not in watchList.keys():
            return []
        watchList = watchList["stocks"]
        stocks = []
        price_and_percent = si.get_price_and_change_for_list(watchList)
        for symbol in watchList:
            price = price_and_percent[symbol]["price"]
            percent_change = price_and_percent[symbol]["percent_change"]
            stocks.append({
                "symbol": symbol,
                "price": price,
                "percent_change": percent_change,
                "changedir": percent_change > 0
            })
        return stocks
