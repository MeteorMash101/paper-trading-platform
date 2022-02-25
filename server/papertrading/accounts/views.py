# SOURCE: https://www.django-rest-framework.org/tutorial/3-class-based-views/
# Create your views here.
from accounts.models import Account
from accounts.serializers import AccountSerializer, StockListSerializer, StockNumSerializer, PortfolioValueSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stocks.financeAPI import stock_info as si
from datetime import date

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
        # request.data['user'] = User.objects.get(email=request.data['email'])
        # request.data['user'] = request.data['email'].split('@')[0]
        # print("UPDATED REQ. DATA", request.data)
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
        if AccountObj != None: # account exists
            serializer = AccountSerializer(AccountObj)
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

class AccountBalance(APIView):
    """
    Update an Account's buying power.
    """
    def put(self, request, pk):
        Account = self.get_object(pk)
        print("AMOUNT SENT IN BP PUT: ", request.data['amount'], type(request.data['amount']))
        serializer = AccountSerializer(Account, data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data)
        return Response(None)

class AccountStocksOwned(APIView):

    '''
    When making a get request, the data only needs one field "info". It may also need "symbol" depending on what you want
    info options:
    stock_list_detailed     includes every transaction for stocks currently owned with date purchased and purchase price
    num_of_ticker_stocks    the amount of shares they own of the stock. Must specify "symbol" in the request
    portfolio_value         The total value of the users portfolio
    stock_list_display      A list of every stock the user owns, its quantity, current price, change %, and change direction
{
"info": "stock_list_display",
"symbol": "aapl"
}
    Examples: 
    curl -d "{"info":"stock_list_display"}" -H "Content-Type: application/json" -X GET http://127.0.0.1:8000/accounts/[ACCOUNT_GOOG_ID]/getStocks

    curl -d "{"info":"num_of_ticker_stocks", "symbol": "tsla"}" -H "Content-Type: application/json" -X GET http://127.0.0.1:8000/accounts/[ACCOUNT_GOOG_ID]/getStocks


    '''
    def get(self, request, goog_id):
        data = request.data
        account = self.get_object(goog_id)
        if account != None:
            if data["info"] == "stock_list_detailed":            #Returns list of all their transactions with stocks they currently own.
                serializer = StockListSerializer({"stock_list":account.ownedStocks})
                return Response(serializer.data)
            elif data["info"] == "num_of_ticker_stocks":        #returns the amount of the stock they have for the given ticker
                numOfStock = self.countStock(account.ownedStocks, data["symbol"])
                serializer = StockNumSerializer({"quantity_owned":numOfStock})
                return Response(serializer.data)
            elif data["info"] == "portfolio_value":             #returns just the portfolio value
                portfolio_value = self.calculateValue(account.ownedStocks)
                serializer = PortfolioValueSerializer({"portfolio_value":portfolio_value})
                return Response(serializer.data)
            elif data["info"] == "stock_list_display":          #returns each stock they own with how much they own, price, %change, and changeDir
                stockList = self.ownedStocksForDisplay(account.ownedStocks)
                serializer = StockListSerializer({"stock_list":stockList})
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
        print("STOCK OWNED PUT")
        account = self.get_object(goog_id)
        if account == None:
            print("Account not found, sending None...")
            return Response(None)

        data = request.data
        if account.ownedStocks == None:
            account.ownedStocks = {}
        owned = account.ownedStocks
        if data["action"] == "buy":
            valid = self.purchaseStock(data, owned)
        else:
            valid = self.sellStock(data, owned)
        if not valid:
             return Response(None, status=status.HTTP_400_BAD_REQUEST)            #idk which error to put
        account.save()
        serializer = StockListSerializer({"stock_list":owned})
        return Response(serializer.data)

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
            quantity += order["quantity"]
        return quantity

    #Adds the purchase of the stock to the list
    def purchaseStock(self, data, owned):
        if data["stock"].lower() in owned.keys():
                owned[data["stock"].lower()].append({
                    "quantity": data["quantity"],
                    "datePurchased": date.today().strftime("%Y-%m-%d"),
                    "purchasePrice": si.get_live_price(data["stock"])}) #Convert to getting from server
        else:
            owned[data["stock"].lower()] = [{
                "quantity": data["quantity"],
                "datePurchased": date.today().strftime("%Y-%m-%d"),
                "purchasePrice": si.get_live_price(data["stock"])
            }]
        return True
    
    #Sells the given amount of stock
    #enough stock being owned is checked for in the client
    def sellStock(self, data, owned):
        if data["stock"].lower() not in owned.keys():
            return False
        stockPurchases = owned[data["stock"].lower()]
        if len(stockPurchases) == 0:
            return False
        toSell = data["quantity"]
        while toSell > 0:
            if toSell >= stockPurchases[0]["quantity"]:
                toSell -= stockPurchases[0]["quantity"]
                stockPurchases.pop(0)
            else:
                stockPurchases[0]["quantity"] -= toSell
                toSell = 0
        return True
    
    #For displaying owned stocks on the home page, this returns the JSON for it
    def ownedStocksForDisplay(self, owned):
        print(owned)
        stocks = []
        price_and_percent = si.get_price_and_change_for_list(owned.keys())
        for symbol in owned.keys():
            totOwned = 0
            for purchase in owned[symbol]:
                totOwned += purchase["quantity"]
            price = price_and_percent[symbol]["price"]
            percent_change = price_and_percent[symbol]["percent_change"]
            stocks.append({
                "symbol": symbol,
                "shares": totOwned,
                "price": price,
                "percent_change": percent_change,
                "changedir": percent_change > 0
            })
        return stocks