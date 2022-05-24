from django.test import TestCase, Client
from django.urls import reverse
from accounts.models import Account
from datetime import datetime, date
from unittest.mock import patch, MagicMock
from unittest import mock
import pandas as pd

from accounts.utils.historicalPortfolioValueLoader import PortfolioValue
import time

#Essentially we can't mock library methods so we give them a child and mock their child 
#cuz children can't stand up for themselves
#https://williambert.online/2011/07/how-to-unit-testing-in-django-with-mocking-and-patching/
class FakeDate(datetime):
    def __new__(cls, *args, **kwargs):
        return datetime.__new__(datetime, *args, **kwargs)

class FakeAPI:
    def get_live_price(symbol):
        data = {"aapl": 151.64999389648438, "goog": 2513.12345678910112, "fb": 225.12345678911111, "veev": 160.12345678922222,
                "tsla": 1013.12345678933333, "nflx": 150.12345678944444, "baba": 91.12345678955555, "twlo": 101.12345678966666}
        return data[symbol]
    
    def get_data(symbol, start_date, end_date):
        dates = ["2022-05-10", "2022-05-11", "2022-05-12", "2022-05-13", "2022-05-16", "2022-05-17"]
        #Only the close value is different
        data = {"aapl": pd.DataFrame({"open": [169.123456, 163.123456, 156.123456, 167.123456, 171.123456, 888.188888], 
                                      "high": [171.123456, 168.123456, 165.123456, 173.123456, 172.123456, 999.199999], 
                                      "low": [158.123456, 157.123456, 156.123456, 166.123456, 162.123456, 777.177777], 
                                      "close": [148.987654, 150.987654, 143.987654, 145.987654, 149.987654, 989.189898], 
                                      "adjclose": [164.123456, 160.123456, 164.123457, 172.123456, 162.123456, 898.198989], 
                                      "volume": [1111111, 1222222, 1333333, 1444444, 1555555, 1666666], 
                                      "ticker": ["AAPL"]}, index=dates),
                "goog": pd.DataFrame({"open": [169.123456, 163.123456, 156.123456, 167.123456, 171.123456, 888.288888], 
                                      "high": [171.123456, 168.123456, 165.123456, 173.123456, 172.123456, 999.299999], 
                                      "low": [158.123456, 157.123456, 156.123456, 166.123456, 162.123456, 777.277777], 
                                      "close": [2328.010101, 2345.010101, 2367.010101, 2455.010101, 2498.010101, 989.289898], 
                                      "adjclose": [164.123456, 160.123456, 164.123457, 172.123456, 162.123456, 898.298989], 
                                      "volume": [1111111, 1222222, 1333333, 1444444, 1555555, 2666666], 
                                      "ticker": ["GOOG"]}, index=dates),
                "fb"  : pd.DataFrame({"open": [169.123456, 163.123456, 156.123456, 167.123456, 171.123456, 888.388888], 
                                      "high": [171.123456, 168.123456, 165.123456, 173.123456, 172.123456, 999.399999], 
                                      "low": [158.123456, 157.123456, 156.123456, 166.123456, 162.123456, 777.377777], 
                                      "close": [201.343434, 213.343434, 207.343434, 220.343434, 224.343434, 989.389898], 
                                      "adjclose": [164.123456, 160.123456, 164.123457, 172.123456, 162.123456, 898.398989], 
                                      "volume": [1111111, 1222222, 1333333, 1444444, 1555555, 3666666], 
                                      "ticker": ["FB"]}, index=dates),
                "veev": pd.DataFrame({"open": [169.123456, 163.123456, 156.123456, 167.123456, 171.123456, 888.488888], 
                                      "high": [171.123456, 168.123456, 165.123456, 173.123456, 172.123456, 999.499999], 
                                      "low": [158.123456, 157.123456, 156.123456, 166.123456, 162.123456, 777.477777], 
                                      "close": [164.123456, 160.123456, 164.123456, 172.123456, 162.123456, 989.489898], 
                                      "adjclose": [164.123456, 160.123456, 164.123457, 172.123456, 162.123456, 898.498989], 
                                      "volume": [1111111, 1222222, 1333333, 1444444, 1555555, 4666666], 
                                      "ticker": ["VEEV"]}, index=dates),
                "tsla": pd.DataFrame({"open": [169.123456, 163.123456, 156.123456, 167.123456, 171.123456, 888.588888], 
                                      "high": [171.123456, 168.123456, 165.123456, 173.123456, 172.123456, 999.599999], 
                                      "low": [158.123456, 157.123456, 156.123456, 166.123456, 162.123456, 777.577777], 
                                      "close": [756.555555, 700.555555, 649.555555, 843.555555, 950.555555, 989.589898], 
                                      "adjclose": [164.123456, 160.123456, 164.123457, 172.123456, 162.123456, 898.598989], 
                                      "volume": [1111111, 1222222, 1333333, 1444444, 1555555, 5666666], 
                                      "ticker": ["TSLA"]}, index=dates),
                "nflx": pd.DataFrame({"open": [169.123456, 163.123456, 156.123456, 167.123456, 171.123456, 888.688888], 
                                      "high": [171.123456, 168.123456, 165.123456, 173.123456, 172.123456, 999.699999], 
                                      "low": [158.123456, 157.123456, 156.123456, 166.123456, 162.123456, 777.677777], 
                                      "close": [189.666666, 187.666666, 180.666666, 170.666666, 160.666666, 989.689898], 
                                      "adjclose": [164.123456, 160.123456, 164.123457, 172.123456, 162.123456, 898.698989], 
                                      "volume": [1111111, 1222222, 1333333, 1444444, 1555555, 6666666], 
                                      "ticker": ["NFLX"]}, index=dates),
                "baba": pd.DataFrame({"open": [169.123456, 163.123456, 156.123456, 167.123456, 171.123456, 888.788888], 
                                      "high": [171.123456, 168.123456, 165.123456, 173.123456, 172.123456, 999.799999], 
                                      "low": [158.123456, 157.123456, 156.123456, 166.123456, 162.123456, 777.777777], 
                                      "close": [90.777777, 91.777777, 90.777777, 91.777777, 90.777777, 989.789898], 
                                      "adjclose": [164.123456, 160.123456, 164.123457, 172.123456, 162.123456, 898.798989], 
                                      "volume": [1111111, 1222222, 1333333, 1444444, 1555555, 7666666], 
                                      "ticker": ["BABA"]}, index=dates),
                "twlo": pd.DataFrame({"open": [169.123456, 163.123456, 156.123456, 167.123456, 171.123456, 888.888888], 
                                      "high": [171.123456, 168.123456, 165.123456, 173.123456, 172.123456, 999.899999], 
                                      "low": [158.123456, 157.123456, 156.123456, 166.123456, 162.123456, 777.877777], 
                                      "close": [101.888888, 102.888888, 104.888888, 99.888888, 102.888888, 989.889898], 
                                      "adjclose": [164.123456, 160.123456, 164.123457, 172.123456, 162.123456, 898.898989], 
                                      "volume": [1111111, 1222222, 1333333, 1444444, 1555555, 8666666], 
                                      "ticker": ["TWLO"]}, index=dates),
                }
        try:
            return data[symbol].loc[[start_date.strftime("%Y-%m-%d")]]
        except:
            raise KeyError

    def portfolioHistory(account):
        PortfolioValue.build(account)

def createTestUser():
    user = Account.objects.create(name = "Will", email = "test@gmail.com", 
        google_user_id = "test", watchList = {"stocks": []}, transaction_history = {"history": []},
        portfolio_value_history = {"data": {}}, start_date = "2022-05-10")
    user.save()

def getTestUser():
        return Account.objects.filter(google_user_id = "test")[0]


class StockListTestCases(TestCase):

    #Always uses the test user with id "test"
    def buyOrSellStock(self, action, symbol, quantity, price = None):
        url = reverse("accounts:ownedStockList", args=("test", ))
        if price == None:   #If price isn't given cuz like if we change it idk seems smart
            return Client().put(url, {"action": action, "stock": symbol, "quantity":quantity}, content_type="application/json")
        else:
            return Client().put(url, {"action": action, "stock": symbol, "quantity":quantity, "marketPrice": price}, content_type="application/json")
    
    ###########################################################################
    #Testing the buy functionality
    ###########################################################################
    #A single purchase to make sure it is initializing the structure correctly
    @patch('stocks.financeAPI.Stock_info.get_live_price')
    @mock.patch('accounts.utils.transactionHandler.datetime', FakeDate)
    def test_buy_share_not_owned_raw_data(self, livePriceAPI):
        """Test buying a user's first stock"""
        createTestUser()
        #Setting API call results
        stockPrice = 123.50
        FakeDate.today = classmethod(lambda cls: datetime(2022, 2, 15))
        livePriceAPI.return_value = stockPrice      #In case we need to remove the marketPrice from client

        self.buyOrSellStock("buy", "dis", 1, stockPrice)
        user = getTestUser()
        expectedResult = {"dis": [{"quantity": 1, "date": "2022-02-15", "price": stockPrice}]}
        self.assertEqual(expectedResult, user.ownedStocks)

    @patch('stocks.financeAPI.Stock_info.get_live_price')
    @mock.patch('accounts.utils.transactionHandler.datetime', FakeDate)
    def test_buy_share_transaction_history(self, livePriceAPI):
        createTestUser()
        stockPrice = 123.50
        FakeDate.today = classmethod(lambda cls: datetime(2022, 2, 15))
        livePriceAPI.return_value = stockPrice      #In case we need to remove the marketPrice from client

        self.buyOrSellStock("buy", "DIS", 1, stockPrice)
        user = getTestUser()
        #Get the data from the server
        expectedResult = [{"type": "buy", "stock": "dis", "quantity": 1, "date": "2022-02-15", "stockPrice": stockPrice}]
        self.assertEqual(expectedResult, user.transaction_history["history"])
    
    #A single purchase to see how balance changes
    @patch('stocks.financeAPI.Stock_info.get_live_price')
    def test_valid_balance_after_purchase(self, livePriceAPI):
        """Making sure the balance is within one cent of what it should be"""
        createTestUser()
        (stockPrice, quantity) = (123.55, 2)
        livePriceAPI.return_value = stockPrice

        self.buyOrSellStock("buy", "dis", 2, stockPrice)
        user = getTestUser()
        self.assertEqual(float(user.balance) + stockPrice*quantity, 5000.00)

    #Buy the same stock back to back
    @patch('stocks.financeAPI.Stock_info.get_live_price')
    @mock.patch('accounts.utils.transactionHandler.datetime', FakeDate)
    def test_buy_share_some_owned_raw_data(self, livePriceAPI):
        """Checking that multiple separate purchases of the same stock are put in the list correctly"""
        createTestUser()
        (price1, price2) = (123.50, 123.77)
        livePriceAPI.side_effect = [price1, price2] #this sets the return_values for each successive call, so first call returns 123.50
        FakeDate.today = classmethod(lambda cls: datetime(2022, 2, 15))

        self.buyOrSellStock("buy", "dis", 3, price1)
        self.buyOrSellStock("buy", "dis", 2, price2)
        user = getTestUser()
        expectedResult = {"dis": [{"quantity": 3, "date": "2022-02-15", "price": price1},
                                  {"quantity": 2, "date": "2022-02-15", "price": price2}]}
        self.assertEqual(expectedResult, user.ownedStocks)

    ###########################################################################
    #Testing the sell functionality
    ###########################################################################
    @patch('stocks.financeAPI.Stock_info.get_live_price')
    def test_sell_one_share_one_owned(self, livePriceAPI):
        createTestUser()
        (buyPrice, sellPrice) = (123.50, 123.77)
        livePriceAPI.side_effect = [buyPrice, sellPrice]

        self.buyOrSellStock("buy", "dis", 3, buyPrice)
        self.buyOrSellStock("sell", "dis", 3, sellPrice)
        user = getTestUser()
        self.assertTrue(user.ownedStocks == {})
        self.assertEqual(5000+3*(123.77-123.50), float(user.balance))

    @patch('stocks.financeAPI.Stock_info.get_live_price')
    @mock.patch('accounts.utils.transactionHandler.datetime', FakeDate)
    def test_sell_shares_single_purchase(self, livePriceAPI):
        createTestUser()
        (buyPrice, sellPrice) = (123.50, 123.77)
        livePriceAPI.side_effect = [buyPrice, sellPrice] #this sets the return_values for each successive call, so first call returns 123.50
        FakeDate.today = classmethod(lambda cls: datetime(2022, 2, 15))

        self.buyOrSellStock("buy", "dis", 3, buyPrice)
        self.buyOrSellStock("sell", "dis", 2, sellPrice)
        user = getTestUser()
        expected = {"dis": [{"quantity": 1, "date": "2022-02-15", "price": buyPrice}]}
        self.assertEqual(expected, user.ownedStocks)
    
    @patch('stocks.financeAPI.Stock_info.get_live_price')
    @mock.patch('accounts.utils.transactionHandler.datetime', FakeDate)
    def test_sell_shares_multiple_purchase(self, livePriceAPI):
        createTestUser()
        (buy1, buy2, buy3, sell) = (1, 2, 3, 4)
        livePriceAPI.side_effect = [buy1, buy2, buy3, sell]
        FakeDate.today = classmethod(lambda cls: datetime(2022, 2, 15))
        self.buyOrSellStock("buy", "dis", 3, buy1)
        self.buyOrSellStock("buy", "dis", 5, buy2)
        self.buyOrSellStock("buy", "dis", 2, buy3)
        self.buyOrSellStock("sell", "dis", 4, sell)

        user = getTestUser()
        expected = {"dis": [{"quantity": 4, "date": "2022-02-15", "price": buy2},
                            {"quantity": 2, "date": "2022-02-15", "price": buy3}]}
        self.assertEqual(expected, user.ownedStocks)

    ###########################################################################
    #Testing the count functionality
    ###########################################################################
    def test_number_of_shares_none_owned(self):
        """Checking that it returns 0 when the stock doesn't exist"""
        createTestUser()
        url = reverse("accounts:ownedStockList", args=("test", ))
        data = Client().get(url, data = {"info": "num_of_ticker_stocks", "symbol":"dis"}, content_type="application/json").json()
        self.assertEqual(data["quantity_owned"], 0)

    def test_number_of_shares_one_owned(self):
        """It should work with just one purchase of one stock"""
        #Create Fake User Data
        createTestUser()
        user = getTestUser()
        user.ownedStocks = {"dis": [{"quantity": 9, "date": "2022-02-25", "price": 103.41}]}
        user.save()

        #Test
        url = reverse("accounts:ownedStockList", args=("test", ))
        data = Client().get(url, data = {"info": "num_of_ticker_stocks", "symbol":"dis"}, content_type="application/json").json()
        self.assertEqual(data["quantity_owned"], 9)

    def test_number_of_shares_many_owned(self):
        """Checking that it can account for multiple purchases and with other stocks present"""
        #Create Fake User Data
        createTestUser()
        user = getTestUser()
        user.ownedStocks = {"dis": [{"quantity": 9, "date": "2022-02-25", "price": 103.41},
                                    {"quantity": 4, "date": "2022-02-27", "price": 105.29}],
                            "f": [{"quantity": 7, "date": "2022-02-26", "price": 14.41}]}
        user.save()

        #Test
        url = reverse("accounts:ownedStockList", args=("test", ))
        data = Client().get(url, data = {"info": "num_of_ticker_stocks", "symbol":"dis"}, content_type="application/json").json()
        self.assertEqual(data["quantity_owned"], 13)
    
    ###########################################################################
    #Testing the display stock list functionality
    ###########################################################################
    def test_stock_list_when_none_owned(self):
        createTestUser()

        url = reverse("accounts:ownedStockList", args=("test", ))
        data = Client().get(url, data = {"info": "stock_list_display"}, content_type="application/json").json()
        self.assertTrue(len(data["stock_list"]) == 0)
    
    @patch('stocks.financeAPI.Stock_info.get_price_and_change_for_list')
    def test_stock_list_when_one_owned(self, priceAndChangeAPI):
        #Set up the fake API call
        stockPrice = 14.39
        percentChange = 3.33173
        priceAndChangeAPI.return_value = {"dis": {
            "symbol": "dis",
            "company_name": "Walt Disney Company (The)",
            "price": stockPrice,
            "percent_change": percentChange,
            "change_direction": percentChange > 0,
            "volume": 12345678
        }}

        #Create fake user data
        createTestUser()
        user = getTestUser()
        user.ownedStocks = {"dis": [{"quantity": 6, "date": "2022-02-27", "price": 123.41}]}
        user.save()

        #Test
        url = reverse("accounts:ownedStockList", args=("test", ))
        data = Client().get(url, data = {"info": "stock_list_display"}, content_type="application/json").json()
        expectedValue = [{"symbol": "dis", "shares": 6, "price": stockPrice, "percent_change": percentChange, "change_direction": percentChange > 0}]
        self.assertTrue(expectedValue, data["stock_list"])
    
    @patch('stocks.financeAPI.Stock_info.get_price_and_change_for_list')
    def test_stock_list_when_many_owned(self, priceAndChangeAPI):
        #Set up the fake API call
        priceAndChangeAPI.return_value = {"dis" : {"symbol": "dis", "company_name": "Walt Disney Company (The)", "price": 100.00,
                                "percent_change": 4.3471178, "change_direction": True, "volume": 12345678},
                                          "f"   : {"symbol": "f", "company_name": "Ford Motor Company", "price": 13.89,
                                "percent_change": -1.8472619, "change_direction": False, "volume": 12345678},
                                          "goog": {"symbol": "goog", "company_name": "Alphabet", "price": 2657.91,
                                "percent_change": -0.8277492, "change_direction": False, "volume": 12345678},}

        #Create Fake User Data
        createTestUser()
        user = getTestUser()
        user.ownedStocks = {"dis" : [{"quantity": 6, "date": "2022-02-25", "price": 103.41},
                                     {"quantity": 3, "date": "2022-02-27", "price": 105.29}],
                            "f"   : [{"quantity": 7, "date": "2022-02-26", "price": 14.41}],
                            "goog": [{"quantity": 1, "date": "2022-02-28", "price": 2684.99}]}
        user.save()
        
        #Test
        url = reverse("accounts:ownedStockList", args=("test", ))
        data = Client().get(url, data = {"info": "stock_list_display"}, content_type="application/json").json()
        expected = [{"symbol": "dis" , "shares": 9, "price": 100.00,  "percent_change": 4.3471178, "change_direction": True},
                    {"symbol": "f"   , "shares": 7, "price": 13.89,   "percent_change": -1.8472619, "change_direction": False},
                    {"symbol": "goog", "shares": 1, "price": 2657.91, "percent_change": -0.8277492, "change_direction": False}]
        
        self.assertEqual(expected, data["stock_list"])
    
    ###########################################################################
    #Testing the portfolio current value functionality
    ###########################################################################
    def test_portfolio_value_no_stocks(self):
        createTestUser()
        url = reverse("accounts:ownedStockList", args=("test", ))
        data = Client().get(url, data = {"info": "portfolio_value"}, content_type="application/json").json()
        expected = {"portfolio_value": "0.00", "percent_change": '0.00', "change_direction": False}
        self.assertEqual(data, expected)
    
    @patch('stocks.financeAPI.Stock_info.get_price_and_change_for_list')
    def test_portfolio_value_one_share(self, livePriceAPI):
        #Set up the fake API
        stockPrice = 2684.99
        returnVal = {'goog': {'symbol': 'goog', 'company_name': 'Alphabet, Inc.', 'price': stockPrice, 'percent_change': -3.354842, 'change_direction': False, 'volume': 56792887}}
        livePriceAPI.return_value = returnVal

        #Create Fake User Data
        createTestUser()
        user = getTestUser()
        buyPrice = 2500.70
        user.ownedStocks = {"goog": [{"quantity": 1, "date": "2022-02-28", "price": buyPrice}]}
        user.save()

        #Test
        url = reverse("accounts:ownedStockList", args=("test", ))
        pv = Client().get(url, data = {"info": "portfolio_value"}, content_type="application/json").json()
        expected = {"portfolio_value": str(stockPrice), "percent_change": str(round(100*(stockPrice - buyPrice)/buyPrice, 2)), 'change_direction': (stockPrice - buyPrice)/stockPrice > 0}
        self.assertEqual(pv, expected)
    
    #@patch('stocks.financeAPI.Stock_info.get_live_price')
    @patch('stocks.financeAPI.Stock_info.get_price_and_change_for_list')
    def test_portfolio_value_many_stocks(self, livePriceAPI):
        #Set up the fake API call
        livePriceAPI.return_value = {
            'dis': {'symbol': 'dis', 'company_name': 'Disney', 'price': 107.99, 'percent_change': -3.354842, 'change_direction': False, 'volume': 56792887},
            'goog': {'symbol': 'goog', 'company_name': 'Google', 'price': 2574.29, 'percent_change': -1.32052, 'change_direction': False, 'volume': 86108911},
            'f': {'symbol': 'f', 'company_name': 'Ford', 'price': 14.29, 'percent_change': 2.68168, 'change_direction': True, 'volume': 23637863}
        }

        #Create fake User Data
        createTestUser()
        user = getTestUser()
        user.ownedStocks = {"dis" : [{"quantity": 6, "date": "2022-02-25", "price": 103.41},
                                     {"quantity": 3, "date": "2022-02-27", "price": 105.29}],
                            "f"   : [{"quantity": 7, "date": "2022-02-26", "price": 14.41}],
                            "goog": [{"quantity": 1, "date": "2022-02-28", "price": 2684.99}]}
        user.save()

        url = reverse("accounts:ownedStockList", args=("test", ))
        pv = Client().get(url, data = {"info": "portfolio_value"}, content_type="application/json").json()
        expectedPrice = 107.99*9 + 14.29*7 + 2574.29*1
        buyPrice = 103.41*6 + 105.29*3 + 14.41*7 + 2684.99*1
        pvChange = round(100*(expectedPrice - buyPrice)/buyPrice, 2)
        expected = {"portfolio_value": str(expectedPrice), "percent_change": str(pvChange), 'change_direction': pvChange > 0}
        self.assertEqual(pv, expected)
    
    @mock.patch('accounts.utils.historicalPortfolioValueLoader.si', FakeAPI)
    @mock.patch('accounts.utils.historicalPortfolioValueLoader.date', FakeDate)
    @mock.patch('accounts.utils.historicalPortfolioValueLoader.PortfolioValue.load', FakeAPI.portfolioHistory)
    def test_portfolio_value_history_generation_from_start_date(self):
        """When a user first generates their portfolio value history"""
        createTestUser()
        FakeDate.today = classmethod(lambda cls: datetime(2022, 5, 17)) #from 5/10

        user = getTestUser()
        user.transaction_history["history"] = [
            {"type": "buy", "stock": "tsla", "quantity": 10, "date": "2022-05-11", "stockPrice": 730.98},
            {"type": "buy", "stock": "goog", "quantity": 6, "date": "2022-05-11", "stockPrice": 2340.82},
            {"type": "buy", "stock": "aapl", "quantity": 10, "date": "2022-05-12", "stockPrice": 145.11},
            {"type": "sell", "stock": "tsla", "quantity": 10, "date": "2022-05-13", "stockPrice": 655.01},
            {"type": "buy", "stock": "tsla", "quantity": 20, "date": "2022-05-13", "stockPrice": 840.55},
            {"type": "buy", "stock": "fb", "quantity": 7, "date": "2022-05-16", "stockPrice": 222.22}
        ]
        user.save()
        url = reverse("accounts:details", args=("test",))
        Client().get(url)
        user = getTestUser()
        expected = {'2022-05-10': 0, '2022-05-11': 2107561, '2022-05-12': 2213749, 
                    '2022-05-13': 3306104, '2022-05-14': 3306104, '2022-05-15': 3306104, 
                    '2022-05-16': 3706945, '2022-05-17': 3843357}
        self.assertEqual(expected, user.portfolio_value_history["data"])

    @mock.patch('accounts.utils.historicalPortfolioValueLoader.si', FakeAPI)
    @mock.patch('accounts.utils.historicalPortfolioValueLoader.date', FakeDate)
    @mock.patch('accounts.utils.historicalPortfolioValueLoader.PortfolioValue.load', FakeAPI.portfolioHistory)
    def test_portfolio_value_history_update(self):
        """When a user already has some portfolio value history and it should start from where the data ends"""
        createTestUser()
        FakeDate.today = classmethod(lambda cls: datetime(2022, 5, 17)) #from 5/10

        user = getTestUser()
        user.transaction_history["history"] = [
            {"type": "buy", "stock": "tsla", "quantity": 10, "date": "2022-05-11", "stockPrice": 730.98},
            {"type": "buy", "stock": "goog", "quantity": 6, "date": "2022-05-11", "stockPrice": 2340.82},
            {"type": "buy", "stock": "aapl", "quantity": 10, "date": "2022-05-12", "stockPrice": 145.11},
            {"type": "sell", "stock": "tsla", "quantity": 10, "date": "2022-05-13", "stockPrice": 655.01},
            {"type": "buy", "stock": "tsla", "quantity": 20, "date": "2022-05-13", "stockPrice": 840.55},
            {"type": "buy", "stock": "fb", "quantity": 7, "date": "2022-05-16", "stockPrice": 222.22}
        ]
        user.portfolio_value_history["data"] = {'2022-05-10': 0, '2022-05-11': 2107561, '2022-05-12': 2213749, 
                    '2022-05-13': 3306104, '2022-05-14': 3256104}
        user.save()
        url = reverse("accounts:details", args=("test",))
        Client().get(url)
        user = getTestUser()
        expected = {'2022-05-10': 0, '2022-05-11': 2107561, '2022-05-12': 2213749, 
                    '2022-05-13': 3306104, '2022-05-14': 3306104, '2022-05-15': 3306104, 
                    '2022-05-16': 3706945, '2022-05-17': 3843357}
        self.assertEqual(expected, user.portfolio_value_history["data"])

    @mock.patch('accounts.views.datetime', FakeDate)
    def test_user_performance_api(self):
        """Tests the performance endpoint, which returns a list of the balance + portfolio value for every day the account has been active"""
        createTestUser()
        FakeDate.today = classmethod(lambda cls: datetime(2022, 5, 17)) #from 5/10

        user = getTestUser()
        user.transaction_history["history"] = [
            {"type": "buy", "stock": "tsla", "quantity": 10, "date": "2022-05-11", "stockPrice": 730.98},
            {"type": "buy", "stock": "goog", "quantity": 6, "date": "2022-05-11", "stockPrice": 2340.82},
            {"type": "buy", "stock": "aapl", "quantity": 10, "date": "2022-05-12", "stockPrice": 145.11},
            {"type": "sell", "stock": "tsla", "quantity": 10, "date": "2022-05-13", "stockPrice": 655.01},
            {"type": "buy", "stock": "tsla", "quantity": 20, "date": "2022-05-13", "stockPrice": 840.55},
            {"type": "buy", "stock": "fb", "quantity": 7, "date": "2022-05-16", "stockPrice": 222.22}
        ]
        user.portfolio_value_history["data"] = {
            '2022-05-10': 0, '2022-05-11': 2107561, '2022-05-12': 2213749, 
            '2022-05-13': 3306104, '2022-05-14': 3306104, '2022-05-15': 3306104, 
            '2022-05-16': 3706945, '2022-05-17': 3843357
        }
        user.balance = 65377.74#Assume they started with 100,000
        user.save()

        url = reverse("accounts:pvHistory", args=("test",))
        data = Client().get(url).json()
        expected = [
            {'date': '2022-05-10', 'value': 10000000.0}, 
            {'date': '2022-05-11', 'value': 9972089.0}, 
            {'date': '2022-05-12', 'value': 9933167.0}, 
            {'date': '2022-05-13', 'value': 9999432.0}, 
            {'date': '2022-05-14', 'value': 9999432.0}, 
            {'date': '2022-05-15', 'value': 9999432.0}, 
            {'date': '2022-05-16', 'value': 10244719.0}, 
            {'date': '2022-05-17', 'value': 10381131.0}
        ]
        self.assertEqual(expected, data["pv"])




    ###########################################################################
    #Testing the Raw Stock list return
    ###########################################################################
    def test_raw_stock_list_when_none_owned(self):
        createTestUser()
        url = reverse("accounts:ownedStockList", args=("test", ))
        ownedStocks = Client().get(url, data = {"info": "stock_list_detailed"}, content_type="application/json").json()
        self.assertEqual(ownedStocks, {"stock_list": {}})

    def test_raw_stock_list_many_owned(self):
        #Create fake user data
        createTestUser()
        (price1, price2, price3, price4, price5, price6) = (123.50, 14.81, 2589.99, 14.90, 67.82, 15.00)
        user = getTestUser()
        user.ownedStocks = {"dis" : [{"quantity": 2, "date": "2022-02-01", "price": price1}],
                            "f"   : [{"quantity": 4, "date": "2022-02-02", "price": price2},
                                     {"quantity": 5, "date": "2022-02-04", "price": price4},
                                     {"quantity": 6, "date": "2022-02-06", "price": price6}],
                            "goog": [{"quantity": 1, "date": "2022-02-03", "price": price3}],
                            "amd" : [{"quantity": 7, "date": "2022-02-05", "price": price5}]}
        user.save()        

        #Test
        url = reverse("accounts:ownedStockList", args=("test", ))
        ownedStock = Client().get(url, data = {"info": "stock_list_detailed"}, content_type="application/json").json()
        expected = {"stock_list": {"dis" : [{"quantity": 2, "date": "2022-02-01", "price": price1}],
                                   "f"   : [{"quantity": 4, "date": "2022-02-02", "price": price2},
                                            {"quantity": 5, "date": "2022-02-04", "price": price4},
                                            {"quantity": 6, "date": "2022-02-06", "price": price6}],
                                   "goog": [{"quantity": 1, "date": "2022-02-03", "price": price3}],
                                   "amd" : [{"quantity": 7, "date": "2022-02-05", "price": price5}]}}
        self.assertEqual(ownedStock, expected)



###############################################################################

class WatchListTestCases(TestCase):

    #reverse("accounts:watchList", args=(goog_id, ))
    #put(url, data = {"symbol": ticker})                if stock present it removes it. If it isn't present it adds it
    def test_adding_ticker(self):
        createTestUser()
        ticker = "F"
        url = reverse("accounts:watchList", args=("test", ))
        Client().put(url, data = {"symbol": ticker}, content_type="application/json")

        user = getTestUser()
        expected = {"stocks": ["F"]}
        self.assertEqual(user.watchList, expected)

    def test_removing_ticker(self):
        createTestUser()
        ticker = "F"
        url = reverse("accounts:watchList", args=("test", ))
        Client().put(url, data = {"symbol": ticker}, content_type="application/json")
        Client().put(url, data = {"symbol": ticker}, content_type="application/json")
        
        user = getTestUser()
        expected = {"stocks": []}
        self.assertEqual(user.watchList, expected)

    def test_adding_multiple_tickers(self):
        createTestUser()
        tickers = ["F", "AAPL", "goog", "tsla", "V"]
        url = reverse("accounts:watchList", args=("test", ))
        for ticker in tickers:
            Client().put(url, data = {"symbol": ticker}, content_type="application/json")

        user = getTestUser()
        expected = {"stocks": ["F", "AAPL", "GOOG", "TSLA", "V"]}
        self.assertEqual(user.watchList, expected)

    def test_adding_removing_multiple_tickers(self):
        createTestUser()
        tickers = ["F", "F", "f", "AAPL", "goog", "tsla", "GOOG", "V"]
        url = reverse("accounts:watchList", args=("test", ))
        for ticker in tickers:
            Client().put(url, data = {"symbol": ticker}, content_type="application/json")

        user = getTestUser()
        expected = {"stocks": ["F", "AAPL", "TSLA", "V"]}
        self.assertEqual(user.watchList, expected)


    #reverse("accounts:watchList", args=(goog_id, ))
    #get(url, data = {"info": "check_stock", "symbol": ticker})     returns true if the stock is in the watchlist
    def test_check_if_existing_stock_in_watchlist(self):
        createTestUser()
        user = getTestUser()
        user.watchList = {"stocks": ["F", "V", "GOOG"]}
        user.save()

        url = reverse("accounts:watchList", args=("test", ))
        result = Client().get(url, data = {"info": "check_stock", "symbol": "F"}, content_type="application/json").json()
        self.assertTrue(result["isPresent"])

    def test_check_if_nonexistent_stock_in_watchlist(self):
        createTestUser()
        user = getTestUser()
        user.watchList = {"stocks": ["F", "V", "GOOG"]}
        user.save()

        url = reverse("accounts:watchList", args=("test", ))
        result = Client().get(url, data = {"info": "check_stock", "symbol": "TSLA"}, content_type="application/json").json()
        self.assertTrue(not result["isPresent"])

    #reverse("accounts:watchList", args=(goog_id, ))
    #get(url, data = {"info": "stocks"})                returns all the tickers that the user owns.
    def test_get_all_watched_stocks_when_none(self):
        createTestUser()
        user = getTestUser()
        stockList = []
        user.watchList = {"stocks": stockList}
        user.save()

        url = reverse("accounts:watchList", args=("test", ))
        result = Client().get(url, data = {"info": "stocks"}, content_type="application/json").json()
        self.assertEqual(stockList, result["stock_list"])

    def test_get_all_watched_stocks_when_one(self):
        createTestUser()
        user = getTestUser()
        stockList = ["GOOG"]
        user.watchList = {"stocks": stockList}
        user.save()

        url = reverse("accounts:watchList", args=("test", ))
        result = Client().get(url, data = {"info": "stocks"}, content_type="application/json").json()
        self.assertEqual(stockList, result["stock_list"])

    def test_get_all_watched_stocks_when_many(self):
        createTestUser()
        user = getTestUser()
        stockList = ["F", "V", "GOOG"]
        user.watchList = {"stocks": stockList}
        user.save()

        url = reverse("accounts:watchList", args=("test", ))
        result = Client().get(url, data = {"info": "stocks"}, content_type="application/json").json()
        self.assertEqual(stockList, result["stock_list"])

    #reverse("accounts:watchList", args=(goog_id, ))
    #get(url, data = {"info": "detailed_stocks"})       returns all the watch list stocks with price change and whatnot
    def test_get_detailed_watchlist_stock_info_when_none(self):
        createTestUser()
        user = getTestUser()
        stockList = []
        user.watchList = {"stocks": stockList}
        user.save()

        url = reverse("accounts:watchList", args=("test", ))
        result = Client().get(url, data = {"info": "detailed_stocks"}, content_type="application/json").json()
        self.assertEqual(result["stock_list"], [])
    
    @patch('stocks.financeAPI.Stock_info.get_price_and_change_for_list')
    def test_get_detailed_watchlist_stock_info_when_one(self, priceAndChangeAPI):
        #Set up the fake API call
        stockPrice = 14.39
        percentChange = 3.33173
        priceAndChangeAPI.return_value = {"V": {
            "symbol": "V",
            "company_name": "Visa",
            "price": stockPrice,
            "percent_change": percentChange,
            "change_direction": percentChange > 0,
            "volume": 12345678
        }}

        #Create fake user data
        createTestUser()
        user = getTestUser()
        stockList = ["V"]
        user.watchList = {"stocks": stockList}
        user.save()

        #Test
        url = reverse("accounts:watchList", args=("test", ))
        result = Client().get(url, data = {"info": "detailed_stocks"}, content_type="application/json").json()
        expectedValue = [{"symbol": "v", "price": stockPrice, "percent_change": percentChange, "changedir": percentChange > 0}]
        self.assertTrue(expectedValue, result["stock_list"])
    
    @patch('stocks.financeAPI.Stock_info.get_price_and_change_for_list')
    def test_get_detailed_watchlist_stock_info_when_many(self, priceAndChangeAPI):
        priceAndChangeAPI.return_value = {"V" : {"symbol": "V", "company_name": "Visa", "price": 100.00,
                                "percent_change": 4.3471178, "change_direction": True, "volume": 12345678},
                                          "FB"   : {"symbol": "FB", "company_name": "Meta", "price": 13.89,
                                "percent_change": -1.8472619, "change_direction": False, "volume": 12345678},
                                          "RIVN": {"symbol": "GOOG", "company_name": "Rivian Automotive", "price": 2657.91,
                                "percent_change": -0.8277492, "change_direction": False, "volume": 12345678},}

        #Create Fake User Data
        createTestUser()
        user = getTestUser()
        stockList = ["V", "FB", "RIVN"]
        user.watchList = {"stocks": stockList}
        user.save()
        
        #Test
        url = reverse("accounts:watchList", args=("test", ))
        result = Client().get(url, data = {"info": "detailed_stocks"}, content_type="application/json").json()
        expected = [{"symbol": "V"   , "price": 100.00,  "percent_change": 4.3471178, "changedir": True},
                    {"symbol": "FB"  , "price": 13.89,   "percent_change": -1.8472619, "changedir": False},
                    {"symbol": "RIVN", "price": 2657.91, "percent_change": -0.8277492, "changedir": False}]
        self.assertEqual(expected, result["stock_list"])

###############################################################################
class SimpleStockTestCases(TestCase):

    def test_transaction_history(self):
        createTestUser()
        user = getTestUser()
        expected = [{"type": "buy", "stock": "SOFI", "quantity": 1, "date": "2022-03-02", "stockPrice": 11.710000038146973}, {"type": "sell", "stock": "SOFI", "quantity": 1, "date": "2022-03-02", "stockPrice": 11.713199615478516}][::-1]
        user.transaction_history = {"history": [{"type": "buy", "stock": "SOFI", "quantity": 1, "date": "2022-03-02", "stockPrice": 11.710000038146973}, {"type": "sell", "stock": "SOFI", "quantity": 1, "date": "2022-03-02", "stockPrice": 11.713199615478516}]}  
        user.save()
        #Test
        url = reverse("accounts:transactionHistory", args=("test", ))
        history = Client().get(url).json()["transaction_history"]
        self.assertEqual(history, expected)

    @mock.patch('accounts.views.datetime', FakeDate)
    def test_reset(self):
        FakeDate.today = classmethod(lambda cls: datetime(2022, 5, 28))
        createTestUser()
        user = getTestUser()
        user.balance = 22.13
        user.ownedStocks = {"dis" : [{"quantity": 6, "date": "2022-02-25", "price": 103.41},
                                     {"quantity": 3, "date": "2022-02-27", "price": 105.29}],
                            "f"   : [{"quantity": 7, "date": "2022-02-26", "price": 14.41}],
                            "goog": [{"quantity": 1, "date": "2022-02-28", "price": 2684.99}]}
        wlData = {"stocks": ["NVDA", "F", "PLTR"]}
        user.watchList = wlData
        user.transaction_history = {"history": [
            {"type": "buy", "stock": "dis", "quantity": 6, "date": "2022-05-25", "stockPrice": 103.41},
            {"type": "buy", "stock": "f", "quantity": 30, "date": "2022-05-26", "stockPrice": 14.41},
            {"type": "buy", "stock": "dis", "quantity": 3, "date": "2022-05-27", "stockPrice": 105.29},
            {"type": "sell", "stock": "f", "quantity": 23, "date": "2022-05-27", "stockPrice": 13.67},
            {"type": "buy", "stock": "goog", "quantity": 1, "date": "2022-05-28", "stockPrice": 2684.99},
        ]}
        user.portfolio_value_history = {"data": {"2022-05-25": 177807, "2022-05-26": 181939, "2022-05-27": 183579, "2022-05-28": 183590}}
        user.start_date = "2022-05-25"
        user.save()

        url = reverse("accounts:reset", args=("test", ))
        Client().get(url)
        user = getTestUser()
        self.assertEqual(user.balance, 5000)
        self.assertEqual(user.ownedStocks, {})
        self.assertEqual(user.watchList, wlData)
        self.assertEqual(user.transaction_history, {"history": []})
        self.assertEqual(user.portfolio_value_history, {"data": {}})
        self.assertEqual(user.start_date, "2022-05-28")
    
    @patch('stocks.financeAPI.Stock_info.get_industries')
    def test_stock_diversity(self, industryAPI):
        industryAPI.return_value = {'fb': 'Internet Content & Information', 'goog': 'Internet Content & Information', 'dis': 'Entertainment'}
        createTestUser()
        user = getTestUser()
        user.ownedStocks = {"dis" : [{"quantity": 6, "date": "2022-02-25", "price": 103.41},
                                     {"quantity": 3, "date": "2022-02-27", "price": 105.29}],
                            "fb"   : [{"quantity": 7, "date": "2022-02-26", "price": 240.41}],
                            "goog": [{"quantity": 1, "date": "2022-02-28", "price": 2684.99}]}
        user.save()
        
        url = reverse("accounts:portfolioDiversity", args=("test", ))
        data = Client().get(url).json()
        expected = {'Internet Content & Information': 2, 'Entertainment': 1}
        self.assertEqual(data["industry_makeup"], expected)


###############################################################################
class GeneralAccountTestCases(TestCase):
    
    #post reverse("accounts:create")        #Creates a new user, may need to deal with google oauth D: 
    @mock.patch('accounts.views.datetime', FakeDate)
    def test_create_account(self):
        FakeDate.today = classmethod(lambda cls: datetime(2022, 5, 28))
        url = reverse("accounts:create")
        data = {"name": "will", "email": "wckawamoto@ucdavis.edu", "google_user_id": "test"}
        Client().post(url, data=data, content_type="application/json")
        user = getTestUser()

        self.assertEqual(user.name, data["name"])
        self.assertEqual(user.email, data["email"])
        self.assertEqual(user.google_user_id, data["google_user_id"])
        self.assertEqual(user.balance, 5000)
        self.assertEqual(user.ownedStocks, {})
        self.assertEqual(user.watchList, {"stocks": []})
        self.assertEqual(user.transaction_history, {"history": []})
        self.assertEqual(user.portfolio_value_history, {"data": {}})
        self.assertEqual(user.start_date, "2022-05-28")
       

    def test_create_already_existing_account(self):
        url = reverse("accounts:create")
        data = {"name": "will", "email": "wckawamoto@ucdavis.edu", "google_user_id": "test"}
        response = Client().post(url, data=data, content_type="application/json")
        self.assertEqual(response.status_code, 201) #valid request to create new account
        response = Client().post(url, data=data, content_type="application/json")
        self.assertEqual(response.status_code, 400) #invalid request to create new account

    #get reverse("accounts:allAccounts")     returns all accounts
    def test_see_all_accounts_when_none(self):
        url = reverse("accounts:allAccounts")
        data = Client().get(url).json()
        self.assertTrue(len(data) == 0)

    #Note that balance is stored as a string for some reason
    def test_see_all_accounts_when_one(self):
        userData = {"user": None, "name": "Will", "email": "test@gmail.com", "google_user_id": "test",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-02-01"}
        user = Account.objects.create(name = "Will", email = "test@gmail.com", google_user_id = "test", 
        watchList = {"stocks": []}, transaction_history = {"history": []}, portfolio_value_history = {"data": []},
        start_date = "2022-02-01")
        user.save()
        
        url = reverse("accounts:allAccounts")
        data = Client().get(url).json()
        self.assertTrue(len(data) == 1)
        self.assertEqual(data[0], userData)
    
    def test_see_all_accounts_when_many(self):
        userData = [{"user": None, "name": "Will", "email": "test1@gmail.com", "google_user_id": "test1",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-02-15"},
                    {"user": None, "name": "William", "email": "test2@gmail.com", "google_user_id": "test2",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-02-15"},
                    {"user": None, "name": "Billiam", "email": "test5@gmail.com", "google_user_id": "test5",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-02-17"},
                    {"user": None, "name": "Willy", "email": "test3@gmail.com", "google_user_id": "test3",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-02-26"},
                    {"user": None, "name": "Bill", "email": "test4@gmail.com", "google_user_id": "test4",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-03-01"}]
        #Load data into database
        for acctInfo in userData:
            user = Account.objects.create(name = acctInfo["name"], email = acctInfo["email"], google_user_id = acctInfo["google_user_id"], start_date = acctInfo["start_date"])
            user.save()
        #Make backend call
        url = reverse("accounts:allAccounts")
        data = Client().get(url).json()

        #Sort by emails, which are unique
        data = sorted(data, key=lambda x: x["email"])
        userData = sorted(userData, key=lambda x: x["email"])

        #Make sure everything matches
        self.assertTrue(len(data) == len(userData))
        for index, acct in enumerate(userData):
            self.assertEqual(data[index], acct)
    
    def test_see_existing_account_details(self):
        userData = [{"user": None, "name": "Will", "email": "test1@gmail.com", "google_user_id": "test1",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-02-15"},
                    {"user": None, "name": "William", "email": "test2@gmail.com", "google_user_id": "test2",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-02-15"},
                    {"user": None, "name": "Billiam", "email": "test5@gmail.com", "google_user_id": "test5",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-02-17"},
                    {"user": None, "name": "Willy", "email": "test3@gmail.com", "google_user_id": "test3",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-02-26"},
                    {"user": None, "name": "Bill", "email": "test4@gmail.com", "google_user_id": "test4",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": "2022-03-01"}] 

        userToFind = userData[3]
        #Load data into database
        for acctInfo in userData:
            user = Account.objects.create(
                name = acctInfo["name"], email = acctInfo["email"], google_user_id = acctInfo["google_user_id"], 
                start_date = acctInfo["start_date"], watchList = {"stocks": []}, transaction_history = {"history": []},
                portfolio_value_history = {"data": {}}
            )
            user.save()
        url = reverse("accounts:details", args=(userToFind["google_user_id"], ))
        data = Client().get(url).json()
        self.assertEqual(data, userToFind)

    def test_see_nonexistent_account_details(self):
        userData = [{"user": None, "name": "Will", "email": "test1@gmail.com", "google_user_id": "test1",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "William", "email": "test2@gmail.com", "google_user_id": "test2",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Billiam", "email": "test5@gmail.com", "google_user_id": "test5",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Willy", "email": "test3@gmail.com", "google_user_id": "test3",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Bill", "email": "test4@gmail.com", "google_user_id": "test4",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None}]
        userToFind = userData[3]
        #Load data into database
        for acctInfo in userData:
            user = Account.objects.create(name = acctInfo["name"], email = acctInfo["email"], google_user_id = acctInfo["google_user_id"])
            user.save()
        url = reverse("accounts:details", args=("notPresent", )) #sending a nonexists user id: "notPresent"
        data = Client().get(url)
        self.assertEqual(data.status_code, 404)


'''
print("Name:", user.name)
print("Email:", user.email)
print("goog_id", user.google_user_id)
print("Balance:", type(user.balance))
print("PV:", user.portfolio_value)
print("OwnedStocks:", user.ownedStocks)
print("watchList:", user.watchList)
print("TransactionHistory:", user.transaction_history)
print("PVHistory:", user.portfolio_value_history)
print("StartDate:", user.start_date)
'''