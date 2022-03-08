from django.test import TestCase, Client
from django.urls import reverse
import re

# Create your tests here.
class SingleStockTestCases(TestCase):
    #Use multiple tickers in case WW3 and some companies don't stay in business.
    tickers = ["aapl", "F", "Amzn", "GS", "McD", "WMT"]
    
    #Ok what happens when the API breaks, we should have the function return a broken error code (in views)
    def test_live_price(self):
        """Live Price should be a float, this will only break if the API breaks/changes"""
        #tickers = ["aapl", "F", "Amzn", "GS", "McD", "WMT"]
        count = 0
        for ticker in self.tickers:
            url = reverse("stocks:livePrice", args = (ticker,))
            data = Client().get(url).json()
            livePrice = float(data["live_price"])
            count += (type(livePrice) is float)
        self.assertTrue(count > 0)

    #Only breaks when the API breaks. Or inherent structure changes (e.g. missing field)
    def test_historical_data(self):
        """Tests full historical data with daily resolution"""
        fields = set(['date', 'open', 'high', 'low', 'close', 'adjclose', 'volume'])
        count = 0
        for ticker in self.tickers:
            url = reverse("stocks:historicalData", args = (ticker,))
            data = Client().get(url).json()["historical_data"]
            count += (type(data) == list) * (type(data[0]) == dict) * (fields.intersection(set(data[0].keys())) == fields)
        self.assertTrue(count > 0)

    #Breaks when API breaks or if structure changes.
    def test_quarterly_earnings(self):
        """Checks that we are given 4 quarters worth of data with the appropriate types held in the fields"""
        fields = set(["date", "earnings"])
        count = 0
        for ticker in self.tickers:
            url = reverse("stocks:quarterlyEarnings", args = (ticker,))
            data = Client().get(url).json()["quarterly_earnings"]
            count += (type(data)==list) * (type(data[0])==dict) * (len(data)==4)*(
                        (fields.intersection(set(data[0].keys())) == fields) * (type(data[0]["earnings"]) == int)*(
                            re.match("^[1-4]Q2\d{3}$", data[0]["date"]) != None
                            )
                        )
        self.assertTrue(count > 0)
    
    #Breaks with the API, or when we can no longer get all the details we expect (probably not even necessary though)
    def test_full_stock_details(self):
        """Checks the function which provides the details displayed when users click on a stock"""

        fields = set(['company_name', 'symbol', 'price', 'percent_change', 'change_direction', 
                      'market_cap', 'pe_ratio', 'dividend_yield', 'average_volume', 'volume', 
                      'high_today', 'low_today', 'ft_week_high', 'ft_week_low', 'revenue'])
        count = 0
        for ticker in self.tickers:
            url = reverse("stocks:stockDetails", args = (ticker,))
            data = Client().get(url).json()
            count += (type(data) == dict) * (fields.intersection(set(data.keys())) == fields)
        self.assertTrue(count > 0)

#These could test the speed with which it gets them, since we'll need it to be fast
class MultipleStockTestCases(TestCase):

    #I'm not even sure what to test but it at least returns one company
    def test_popular_stocks(self):
        """Make sure that the popular stocks (people recognize them) returns some stocks"""
        url = reverse("stocks:popularStocks")
        data = Client().get(url).json()
        count = 0
        for stockDictionary in data:
            count += (type(stockDictionary)==dict)
        self.assertTrue(count > 0)
    
    #Not sure what to test either lol
    def test_top_stocks(self):
        """Make sure that the top stocks (most traded) returns some stocks"""
        url = reverse("stocks:topStocks")
        data = Client().get(url).json()
        count = 0
        for stockDictionary in data:
            count += (type(stockDictionary)==dict)
        self.assertTrue(count > 0)

