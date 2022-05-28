# SOURCE: https://www.django-rest-framework.org/tutorial/3-class-based-views/
# Create your views here.
#from this import d
from accounts.models import Account
from accounts.serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stocks.financeAPI import Stock_info as si
from datetime import datetime
from accounts.utils.historicalPortfolioValueLoader import PortfolioValue
from accounts.utils.transactionHandler import Transaction
from accounts.utils.balanceHandler import Balance
from accounts.utils.userStockHandler import UserStocks
from accounts.utils.stockListsHandler import StockLists

from django.contrib.auth.models import User # we are extending Django's User

from django.conf import settings
from social_django.utils import psa
from decimal import Decimal

@psa()
def exchange_token(request, backend):
    """
    Exchange an OAuth2 access token for one for this site.
    This simply defers the entire OAuth2 process to the front end.
    The front end becomes responsible for handling the entirety of the
    OAuth2 process; we just step in at the end and use the access token
    to populate some user identity.
    The URL at which this view lives must include a backend field, like:
        url(API_ROOT + r'social/(?P<backend>[^/]+)/$', exchange_token),
    Using that example, you could call this endpoint using i.e.
        POST API_ROOT + 'social/facebook/'
        POST API_ROOT + 'social/google-oauth2/'
    Note that those endpoint examples are verbatim according to the
    PSA backends which we configured in settings.py. If you wish to enable
    other social authentication backends, they'll get their own endpoints
    automatically according to PSA.
    ## Request format
    Requests must include the following field
    - `access_token`: The OAuth2 access token provided by the provider
    """
    token = request.query_params.get('token', None)
    serializer = AuthSerializer(data={"access_token": token})
    if serializer.is_valid(raise_exception=True):
        # set up non-field errors key
        # http://www.django-rest-framework.org/api-guide/exceptions/#exception-handling-in-rest-framework-views
        try:
            nfe = settings.NON_FIELD_ERRORS_KEY
        except AttributeError:
            nfe = 'non_field_errors'

        try:
            print("AUTHENTICATING USER")
            user = request.backend.do_auth(serializer.validated_data['access_token'])
            print("SUCCESS")
            return {
                    "result": {
                        "token": "valid",
                        "detail": "Succesfully retreived user"
                    },
                    "data": {
                        "name": user.first_name + " " + user.last_name, 
                        "email": user.email, "google_user_id": user.username
                    }
            }
        except BaseException as e:
            print("FAILED")
            # An HTTPError bubbled up from the request to the social auth provider.
            # This happens, at least in Google's case, every time you send a malformed
            # or incorrect access key.
            return {
                'result': {
                    'token': 'invalid',
                    'detail': str(e),
                }
            }

def get_object(email, *args, **kwargs):
    #pk = kwargs.get('goog_id')
    pk = email
    try:
        return Account.objects.get(pk=pk)
    except Account.DoesNotExist:
        return None

def getDataFromToken(request):
    data = exchange_token(request, "google-oauth2")
    if data["result"]["token"] == "invalid":
        return (False, Response(None, status=status.HTTP_401_UNAUTHORIZED))
    return (True, data["data"])


class AccountList(APIView):
    """
    List all accounts, or create a new Account.
    """
    def get(self, request):
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AccountReset(APIView):

    def get(self, request, goog_id):
        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data

        account = get_object(data["email"])
        account.start_date = datetime.today().strftime("%Y-%m-%d")
        account.portfolio_value_history = {"data": {}}
        account.transaction_history = {"history": []}
        account.ownedStocks = {}
        account.balance = 100000
        account.save()
        serializer = AccountSerializer(account)#, data=request.data)
        return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)
        #if serializer.is_valid():
        #    serializer.save() # saves to DB
        #    return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)
        #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountDetail(APIView):
    """
    Create, retrieve, update or delete a Account instance.
    """
    def post(self, request, *args, **kwargs):
        # EDIT: need way to add User's pk to req. data to map this Account -> User.
        # tried: User.objects.get(email=request.data['email']), request.data['email'].split('@')[0]
        # request.data['user'] = ?
        # print("UPDATED REQ. DATA", request.data)
        (valid, data) = getDataFromToken(request)
        if not valid:
            return data
        serializer = AccountSerializer(data=data)
        if serializer.is_valid():
            serializer.save() # saves to DB
            self.__initializeUser(data["email"])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def __initializeUser(self, email):
        user = get_object(email)
        user.watchList = {"stocks": []}
        user.transaction_history = {"history": []}
        user.portfolio_value_history = {"data": {}}
        user.start_date = datetime.today().strftime("%Y-%m-%d")
        user.save()

    def get(self, request, goog_id):

        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data

        accountObj = get_object(data["email"])
        if accountObj != None: # account exists
            serializer = AccountSerializer(accountObj)
            PortfolioValue.load(accountObj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else: # account doesn't exist, create new
            return Response(None, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, goog_id):
        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data

        account = get_object(data["email"])
        serializer = AccountSerializer(account, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, goog_id):
        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data

        account = get_object(data["email"])
        account.delete()
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

class AccountTransactionHistory(APIView):

    def get(self, request, goog_id):
        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data

        account = get_object(data["email"])
        history = account.transaction_history["history"][::-1]
        serializer = TransactionHistorySerializer({"transaction_history":history})
        return Response(serializer.data, status=status.HTTP_200_OK)

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
        (valid, data) = getDataFromToken(request)
        if not valid:
            return data

        account = get_object(data["email"])
        if account == None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)

        data = request.query_params.get('info', None)
        if data == "stock_list_detailed":            #Returns list of all their transactions with stocks they currently own.
            serializer = StockListSerializer({"stock_list":account.ownedStocks})
            return Response(serializer.data)
        # EDIT: need this for new stuff on frontend.
        elif data == "stocks_symbols": # Returns a list of just the symbols for user owned stocks.
            serializer = StockSymbolsSerializer({"stock_symbols":account.ownedStocks.keys()})
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif data == "num_of_ticker_stocks":        #returns the amount of the stock they have for the given ticker
            symbol = request.query_params.get('symbol', None)
            numOfStock = UserStocks.countNumberOfSharesOwned(account.ownedStocks, symbol)
            serializer = StockNumSerializer({"quantity_owned":numOfStock})
            return Response(serializer.data)
        elif data == "portfolio_value":             #returns just the portfolio value
            stock_value = UserStocks.calculateCurrentPortfolioValue(account.ownedStocks)
            portfolio_change = UserStocks.calculatePortfolioChange(account.ownedStocks, stock_value)
            portfolio_value = Decimal.from_float(stock_value) + account.balance
            serializer = PortfolioValueSerializer({"portfolio_value": portfolio_value, "percent_change": portfolio_change, "change_direction": portfolio_change > 0})
            return Response(serializer.data)
        elif data == "stock_list_display":          #returns each stock they own with how much they own, price, %change, and changeDir
            stockList = StockLists.ownedStocks(account.ownedStocks)
            serializer = StockListSerializer({"stock_list":stockList})
            return Response(serializer.data)
        elif data == "buying_power_history":
            history = Balance.buildBuyingPowerHistory(account)
            serializer = TransactionHistorySerializer({"transaction_history":history})
            return Response(serializer.data)
        else:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

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
        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data
        
        account = get_object(data["email"])
        if account == None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        valid = False
        if data["action"] == "buy":
            valid = Transaction.buy(data, account)
        elif data["action"] == "sell": # EDIT: this might accept nulls, try dif. err checking here
            valid = Transaction.sell(data, account)
        if not valid:
             return Response(None, status=status.HTTP_400_BAD_REQUEST)            #idk which error to put
        account.save()
        serializer = StockListSerializer({"stock_list":account.ownedStocks})
        return Response(serializer.data, status=status.HTTP_200_OK)

    

class AccountWatchList(APIView):
    def get(self, request, goog_id):
        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data

        account = get_object(data["email"])
        data = request.query_params.get('info', None)
        
        if account == None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        
        if data == "stocks": # Returns a list of just the symbols for watch list stocks
            serializer = StockListSerializer({"stock_list":account.watchList["stocks"]})
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif data == "detailed_stocks": # Returns list with each stock's price, percent change, and change direction
            detailedList = StockLists.watchList(account.watchList)
            serializer = StockListSerializer({"stock_list":detailedList})
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif data == "check_stock":
            serializer = BoolSerializer({"isPresent": request.query_params.get('symbol', None) in account.watchList["stocks"]})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


    #Acts as a switch. Simply make a put request with the "symbol" of the data being the 
    #Ticker you wish to toggle. If the ticker is in the list it is removed, if it is 
    #not in the list it is added. So if there is say a start symbol next to stocks,
    #clicking it will add it, but clicking it again will remove it.
    def put(self, request, goog_id):
        
        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data
        
        account = get_object(data["email"])
        print("WE HERE NOW")
        if account == None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        symbol = request.data["symbol"]
        self.__toggleStockInWatchList(symbol, account)
        account.save()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

    #Adds a stock into the watch list if not present, otherwise removes it
    def __toggleStockInWatchList(self, symbol, account):
        watched = self.__getWatchList(account)
        try:
            watched.pop(watched.index(symbol.upper()))
        except ValueError: #If the stock is not being watched, add it to the watch list
            watched.append(symbol.upper())
    
    #If the watch list hasn't been set up, set it up and then return the set
    def __getWatchList(self, account):
        if account.watchList == {} or account.watchList is None:
            account.watchList["stocks"] = []
        return account.watchList["stocks"]

class AccountStockIndustries(APIView):

    def get(self, request, goog_id):
        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data

        account = get_object(data["email"])
        if account != None:
            symbols = list(account.ownedStocks.keys())
            industries = si.get_industries(symbols)
            diversity = self.__accumulate(industries)
            serializer = IndustryDiversitySerializer({"industry_makeup":diversity})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
    
    def __accumulate(self, industries):
        counts = {}
        for industry in industries.values():
            if industry in counts.keys():
                counts[industry] += 1
            else:
                counts[industry] = 1
        return counts

class AccountHistoricPV(APIView):
    
    def get(self, request, goog_id):
        (valid, data) =  getDataFromToken(request)
        if not valid:
            return data

        account = get_object(data["email"])
        
        if account != None:
            balanceHistory = Balance.buildBuyingPowerHistory(account)
            Balance.addBalance(account.portfolio_value_history["data"], balanceHistory["data"])
            data = self.convertToListOfDicts(account.portfolio_value_history["data"])
            serializer = HistoricPortfolioValueSerializer({"pv":data})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(None, status=status.HTTP_404_NOT_FOUND)

    #converts the portfolio value history into a format that frontend likes
    def convertToListOfDicts(self, data):
        returnList = []
        keys = sorted(data)
        prevVal = data[keys[0]]
        for key in sorted(data):
            returnList.append({
                "date": key, 
                "value": data[key], 
                "value_change": data[key] - prevVal, 
                "percent_change": 100*(data[key] - prevVal)/prevVal
            })
            prevVal = data[key]
        return returnList

   
