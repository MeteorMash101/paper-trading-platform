from django.test import TestCase, Client
from django.urls import reverse
import re
from unittest.mock import patch
import pandas as pd

# Create your tests here.
class SingleStockTestCases(TestCase):
    #Use multiple tickers in case WW3 and some companies don't stay in business.

    @patch('stocks.financeAPI.Stock_info.get_live_price')
    def test_buy_share_not_owned_raw_data(self, livePriceAPI):
        #Setting API call results
        ticker = "VEEV"
        stockPrice = 123.5124
        livePriceAPI.return_value = stockPrice      #In case we need to remove the marketPrice from client

        url = reverse("stocks:livePrice", args = (ticker,))
        data = Client().get(url).json()
        
        expectedResult = {"live_price": f"{stockPrice:0.2f}"}
        self.assertEqual(expectedResult, data)

    #Breaks when API breaks or if structure changes.
    @patch('yahoo_fin.stock_info.get_earnings')
    def test_quarterly_earnings(self, earnings):
        """Checks that we are given 4 quarters worth of data with the appropriate types held in the fields"""
        returnVal = {}
        returnVal["quarterly_results"] = pd.DataFrame({"date": ["2Q2021", "3Q2021", "4Q2021", "1q2022"], 
                                                       "actual": [0.91, 0.94, 0.97, 0.90],
                                                       "estimate": [0.78, 0.87, 0.88, 0.88]})
        returnVal["yearly_revenue_earnings"] = pd.DataFrame({"date": [2019, 2020, 2021, 2022], 
                                            "revenue": [862210000, 1104081000, 1465069000, 1850777000],
                                            "earnings": [229832000, 301118000, 379998000, 427390000]})
        returnVal["quarterly_revenue_earnings"] = pd.DataFrame({"date": ["2Q2021", "3Q2021", "4Q2021", "1q2022"], 
                                            "revenue": [433573000, 455594000, 476111000, 485499000],
                                            "earnings": [115567000, 108858000, 105869000, 97096000]})
        earnings.return_value = returnVal

        ticker = "VEEV"
        url = reverse("stocks:quarterlyEarnings", args = (ticker,))
        data = Client().get(url).json()["quarterly_earnings"]

        expected = returnVal["quarterly_revenue_earnings"].drop(columns="revenue").merge(returnVal["quarterly_results"]).to_dict("records")
        self.assertEqual(data, expected)

    @patch('yahoo_fin.stock_info.get_company_info')
    @patch('yahoo_fin.stock_info.get_quote_data')
    def test_full_stock_details(self, quote_data, companyInfo):
        """Checks the function which provides the details displayed when users click on a stock"""
        quote = {
            "displayName": "Veeva Systems",
            "shortName": "Veeva",
            "longName": "Veeva Systems Inc.",
            "trailingPE": 63.163494,
            "regularMarketDayLow": 165.96,
            "regularMarketPrice": 166.12,
            "regularMarketDayHigh": 172.95,
            "regularMarketVolume": 1535107,
            "averageDailyVolume3Month": 1048473,
            "averageDailyVolume10Day": 1077390,
            "marketCap": 25713381376,
            "fiftyTwoWeekLow": 165.96,
            "fiftyTwoWeekHigh": 343.96,
            "regularMarketChangePercent": -4.99829
        }
        quote_data.return_value = quote
        info = pd.DataFrame({"Value": ["Health Stuff", "Veeva does things"]},
                              index=["industry", "longBusinessSummary"])
        info.index.name = "Breakdown"
        companyInfo.return_value = info
        ticker = "VEEV"
        url = reverse("stocks:stockDetails", args = (ticker,))
        data = Client().get(url).json()

        expected = {"company_name": quote["displayName"],
                    "symbol": ticker,
                    "price": f'{quote["regularMarketPrice"]:.2f}',
                    "percent_change": f'{quote["regularMarketChangePercent"]:.2f}',
                    "change_direction": quote["regularMarketChangePercent"] > 0,
                    "market_cap": f'{quote["marketCap"]:.2f}',
                    "pe_ratio": f'{quote["trailingPE"]:.2f}',
                    "dividend_yield": "0.00",
                    "average_volume": quote["averageDailyVolume3Month"],
                    "volume": quote["regularMarketVolume"],
                    "high_today": f'{quote["regularMarketDayHigh"]:.2f}',
                    "low_today": f'{quote["regularMarketDayLow"]:.2f}',
                    "ft_week_high": f'{quote["fiftyTwoWeekHigh"]:.2f}',
                    "ft_week_low": f'{quote["fiftyTwoWeekLow"]:.2f}',
                    "revenue": "0.00",
                    "industry": info.loc["industry"][0],
                    "summary": info.loc["longBusinessSummary"][0]
        }
        self.assertEqual(data, expected)
'''
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
'''
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

