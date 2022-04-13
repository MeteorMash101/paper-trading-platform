# SOURCE: https://www.django-rest-framework.org/tutorial/3-class-based-views/
# Create your views here.
from this import d
from accounts.models import Account
from accounts.serializers import AccountSerializer, StockListSerializer, StockNumSerializer, PortfolioValueSerializer, TransactionHistorySerializer, BoolSerializer, HistoricPortfolioValueSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stocks.financeAPI import Stock_info as si
from datetime import datetime, date, timedelta
from decimal import Decimal
from accounts.utils.historicalPortfolioValueLoader import PortfolioValue

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
        pk = self.kwargs.get('goog_id')
        try:
            return Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return None

    def get(self, request, goog_id):
        
        print("IN GET...w/ goog_id:", goog_id)
        AccountObj = self.get_object(goog_id)
        # EDIT: don't understand
        if AccountObj != None: # account exists
            serializer = AccountSerializer(AccountObj)
            PortfolioValue.load(AccountObj)                 #Loads the historical portfolio value
            return Response(serializer.data)
        else: # account doesn't exist, create new
            print("Account not found, sending None...")
            return Response(None)

    def put(self, request, goog_id):
        Account = self.get_object(goog_id)
        serializer = AccountSerializer(Account, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, goog_id):
        Account = self.get_object(goog_id)
        Account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    

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
    curl -d '{"info":"stock_list_display"}' -H "Content-Type: application/json" -X GET http://127.0.0.1:8000/accounts/[ACCOUNT_GOOG_ID]/getStocks

    curl -d '{"info":"num_of_ticker_stocks", "symbol": "tsla"}' -H "Content-Type: application/json" -X GET http://127.0.0.1:8000/accounts/[ACCOUNT_GOOG_ID]/getStocks
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
                symbol = request.query_params.get('symbol', None)
                numOfStock = self.__countStock(account.ownedStocks, symbol)
                serializer = StockNumSerializer({"quantity_owned":numOfStock})
                return Response(serializer.data)
            elif data == "portfolio_value":             #returns just the portfolio value
                portfolio_value = self.__calculateValue(account.ownedStocks)
                portfolio_change = self.__calculatePortfolioChange(account.ownedStocks, portfolio_value)
                serializer = PortfolioValueSerializer({"portfolio_value":portfolio_value, "percent_change": portfolio_change, "change_direction": portfolio_change > 0})
                print("sending PV")
                return Response(serializer.data)
            elif data == "stock_list_display":          #returns each stock they own with how much they own, price, %change, and changeDir
                stockList = self.__ownedStocksForDisplay(account.ownedStocks)
                serializer = StockListSerializer({"stock_list":stockList})
                return Response(serializer.data)
            elif data == "buying_power_history":
                history = self.buildBuyingPowerHistory(account)
                serializer = TransactionHistorySerializer({"transaction_history":history})
                return Response(serializer.data)
            elif data == "transaction_history":
                history = account.transaction_history["history"]
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
        
        owned = account.ownedStocks
        if data["action"] == "buy":
            valid = self.__purchaseStock(data, account)
        else: # EDIT: this might accept nulls, try dif. err checking here
            valid = self.__sellStock(data, account)
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
    def __calculateValue(self, owned):
        value = 0
        for ticker in owned.keys():
            value += si.get_live_price(ticker) * self.__countStock(owned, ticker)
        return value

    #Goes through stock purchases to find how many of a stock the user has
    def __countStock(self, owned, symbol):
        if symbol not in owned.keys():
            return 0

        quantity = 0
        for order in owned[symbol]:
            quantity += int(order["quantity"])
        return quantity

    #Adds the purchase of the stock to the list
    # EDIT: This will likely be changed to accept the price from the frontend
    #       making it really easy to test since we just give it the price
    def __purchaseStock(self, data, account):
        #While we don't send marketPrice from the frontend, just allow for it to be sent
        if "marketPrice" in data.keys():
            price = float(data["marketPrice"])
        else:
            price = si.get_live_price(data["stock"])

        owned = account.ownedStocks
        newPurchase = {
            "quantity": data["quantity"],
            "datePurchased": datetime.today().strftime("%Y-%m-%d"),
            "purchasePrice": price
        }
        if data["stock"].lower() in owned.keys():   #if the user already owns some stock
                owned[data["stock"].lower()].append(newPurchase) #Convert to getting from server
        else:   #create new entry in the dictionary for the stock
            owned[data["stock"].lower()] = [newPurchase]
        self.__recordTransaction(account, "buy", newPurchase, data["stock"])
        account.balance -= Decimal.from_float(float(data["quantity"])*price)
        return True
    
    # EDIT: understnd this a bit mroe
    # EDIT: This will accept the front end value for the stock?
    #Sells the given amount of stock
    #enough stock being owned is checked for in the client
    #Format of a single stock would be:
    '''
    {"aapl": [{"quantity": "2", "datePurchased": "2022-03-04", "purchasePrice": 56.150001525878906},
              {"quantity": "4", "datePurchased": "2022-03-05", "purchasePrice": 57.186511155551367}]}
    '''
    #So selling starts with the top (first) element in the list and removes as much as it can from there.
    #If it removes all the list elements, it will delete the stock name from the dictionary (deleting "aapl").
    def __sellStock(self, data, account):
        owned = account.ownedStocks
        self.__stockPurchasesExist(data["stock"], owned)
        stockPurchases = owned[data["stock"].lower()]
        toSell = int(data["quantity"])
        while toSell > 0:
            if toSell > int(stockPurchases[0]["quantity"]): #If
                toSell -= int(stockPurchases[0]["quantity"])
                stockPurchases.pop(0)
            elif toSell < int(stockPurchases[0]["quantity"]):
                stockPurchases[0]["quantity"] = int(stockPurchases[0]["quantity"]) - toSell
                toSell = 0
            else:
                toSell = 0
                stockPurchases.pop(0)
                if len(stockPurchases) == 0:
                    owned.pop(data["stock"].lower())

        #While we aren't guaranteed to pass marketPrice we'll just provide the option
        #Is this safe? Like it allows people to essentially buy the stock at whatever price they want
        #While it makes no sense for people to want to do this they could for competitions
        if "marketPrice" in data.keys():
            price = float(data["marketPrice"])
        else:
            price = si.get_live_price(data["stock"])

        newSale = {
            "quantity": data["quantity"],
            "datePurchased": datetime.today().strftime("%Y-%m-%d"),
            "purchasePrice": price           
        }
        self.__recordTransaction(account, "sell", newSale, data["stock"])
        account.balance += Decimal.from_float(float(data["quantity"]) * price)
        return True
    
    def __stockPurchasesExist(self, stock, owned):
        if stock.lower() not in owned.keys():
            return False
        if len(owned[stock.lower()]) == 0:
            return False
        return True

    #For displaying owned stocks on the home page, this returns the JSON for it
    def __ownedStocksForDisplay(self, owned):
        stocks = []
        price_and_percent = si.get_price_and_change_for_list(owned.keys())
        for symbol in owned.keys():
            totOwned = 0
            for purchase in owned[symbol]:
                totOwned += int(purchase["quantity"])
            percent_change = price_and_percent[symbol]["percent_change"]
            stocks.append({
                "symbol": symbol,
                "shares": totOwned,
                "price": price_and_percent[symbol]["price"],
                "percent_change": percent_change,
                "change_direction": percent_change > 0
            })
        return stocks

    def __calculatePortfolioChange(self, owned, curVal):
        totalSpent = 0
        for purchases in owned.values():
            for purchase in purchases:
                totalSpent += int(purchase["quantity"]) * float(purchase["purchasePrice"])
        if totalSpent == 0:
            return 0
        percent_change = 100*(curVal - totalSpent) / totalSpent
        return percent_change

    def __recordTransaction(self, account, type, details, symbol):
        if account.transaction_history == {}:
            account.transaction_history["history"] = []
        account.transaction_history["history"].append({
            "type": type,
            "stock": symbol.lower(),
            "quantity": details["quantity"], 
            "date": details["datePurchased"], 
            "stockPrice": details["purchasePrice"]
        })

    # EDIT: need to understand this.
    def buildBuyingPowerHistory(self, account):
        startDate = account.start_date
        if "history" not in account.transaction_history.keys():
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
                    balance += Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
                else:
                    balance -= Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
            else:
                curDate = transaction["date"]
                balanceHistory[curDate] = balance
                if transaction["type"] == "buy":
                    balance += Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
                else:
                    balance -= Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
        if startDate not in balanceHistory.keys():
            balanceHistory[startDate] = balance
        return {"data": balanceHistory}

class AccountWatchList(APIView):

    def get(self, request, goog_id):
        data = request.query_params
        print(data)
        account = self.get_object(goog_id)
        if account != None:
            if data.get('info', None) == "stocks": # Returns a list of just the symbols for watch list stocks
                serializer = StockListSerializer({"stock_list":account.watchList["stocks"]})
                return Response(serializer.data)
            elif data.get('info', None) == "detailed_stocks": # Returns list with each stock's price, percent change, and change direction
                detailedList = self.getWatchListStockInfo(account.watchList)
                serializer = StockListSerializer({"stock_list":detailedList})
                return Response(serializer.data)
            elif data.get('info', None) == "check_stock":
                serializer = BoolSerializer({"isPresent": data.get('symbol', None) in account.watchList["stocks"]})
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
        if account.watchList == {}:
            account.watchList["stocks"] = []
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

class AccountHistoricPV(APIView):
    def get(self, request, goog_id):
        account = self.get_object(goog_id)
        
        if account != None:
            balanceHistory = self.buildBuyingPowerHistory(account)
            performance = self.addBalance(account.portfolio_value_history["data"], balanceHistory["data"])
            data = self.convertToListOfDicts(account.portfolio_value_history["data"])
            
            serializer = HistoricPortfolioValueSerializer({"pv":data})
            return Response(serializer.data)
        else:
            print("Account not found, sending None...")
            return Response(None, status=status.HTTP_404_NOT_FOUND)

    # EDIT duplicate function
    # Returns the account object
    def get_object(self, request, *args, **kwargs):
        print("IN GETOBJ...")
        pk = self.kwargs.get('goog_id')
        try:
            return Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return None

    #converts the portfolio value history into a format that frontend likes
    def convertToListOfDicts(self, data):
        returnList = []
        for key, value in data.items():
            returnList.append({"date": key, "value": value})
        return returnList

    #Adds the balance history to the portfolio value history
    def addBalance(self, pv, balance):
        balance = self.fillBalance(balance, sorted(pv.keys())[-1])

        for key in pv.keys():
            pv[key] = pv[key] + balance[key]*100
        return pv

    #Balance is a sparse dictionary, only made of dates that the balance changed
    #This adds the balance for days inbetween, up until the end date
    def fillBalance(self, balance, endDate):
        for key in balance.keys():
            balance[key] = round(balance[key], 2)
        dates = sorted(balance, key=lambda x: balance[x], reverse=True)
        day = datetime.fromisoformat(dates[0])
        oneDay = timedelta(days=1)
        endDate = datetime.fromisoformat(endDate)
        while day <= endDate:
            dayStr = day.strftime("%Y-%m-%d")
            if dayStr in balance.keys():
                curBalance = balance[dayStr]
            else:
                balance[dayStr] = curBalance
            day += oneDay
        return balance

    # EDIT: need to understand this.
    def buildBuyingPowerHistory(self, account):
        startDate = account.start_date
        if "history" not in account.transaction_history.keys():
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
                    balance += Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
                else:
                    balance -= Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
            else:
                curDate = transaction["date"]
                balanceHistory[curDate] = balance
                if transaction["type"] == "buy":
                    balance += Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
                else:
                    balance -= Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
        if startDate not in balanceHistory.keys():
            balanceHistory[startDate] = balance
        return {"data": balanceHistory}