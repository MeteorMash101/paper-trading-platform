from django.test import TestCase, Client
from django.urls import reverse
import re
from unittest.mock import patch
from unittest import mock
import pandas as pd

#https://williambert.online/2011/07/how-to-unit-testing-in-django-with-mocking-and-patching/
#class FakeDate(datetime):
#    def __new__(cls, *args, **kwargs):
#        return datetime.__new__(datetime, *args, **kwargs)

class FakeAPI:
    def get_quote_data(ticker):
        stocks = {"FB": {
                    "displayName": "Meta", "shortName": "Meta", "longName": "Meta Inc.",
                    "regularMarketPrice": 100.99, "regularMarketChangePercent": -1.09876,
                    "regularMarketVolume": 1111111},
                "AAPL": {
                    "displayName": "Apple", "shortName": "Apple", "longName": "Apple Inc.",
                    "regularMarketPrice": 150.15, "regularMarketChangePercent": 14.50234,
                    "regularMarketVolume": 1234567},
                "AMZN": {
                    "displayName": "Amazon.com", "shortName": "Amazon", "longName": "Amazon.com, Inc.",
                    "regularMarketPrice": 2000.19, "regularMarketChangePercent": -1.369248,
                    "regularMarketVolume": 1010101},
                "NFLX": {
                    "displayName": "Netflix", "shortName": "Netflix", "longName": "Netflix Inc.",
                    "regularMarketPrice": 190.01, "regularMarketChangePercent": -39.24608,
                    "regularMarketVolume": 33333333},
                "GOOG": {
                    "displayName": "Alphabet", "shortName": "Google", "longName": "Alphabet Inc.",
                    "regularMarketPrice": 2400.24, "regularMarketChangePercent": -12.3456789,
                    "regularMarketVolume": 1246811},
                "MSFT": {
                    "displayName": "Microsoft", "shortName": "Microsoft", "longName": "Microsoft, Inc.",
                    "regularMarketPrice": 265.14, "regularMarketChangePercent": 4.32101,
                    "regularMarketVolume": 2020202},
                "TSLA": {
                    "displayName": "Tesla", "shortName": "Tesla", "longName": "Tesla Inc.",
                    "regularMarketPrice": 888.88, "regularMarketChangePercent": 11.42069,
                    "regularMarketVolume": 12312312},
                "ABNB": {
                    "displayName": "AirBnB", "shortName": "Airbnb", "longName": "Airbnb, Inc.",
                    "regularMarketPrice": 116.11, "regularMarketChangePercent": -1.22222,
                    "regularMarketVolume": 8564732},
                "ZM": {
                    "displayName": "Zoom Communications", "shortName": "Zoom", "longName": "Zoom Communications Inc.",
                    "regularMarketPrice": 100.01, "regularMarketChangePercent": -3.17891,
                    "regularMarketVolume": 1212121},
                "EBAY": {
                    "displayName": "Ebay", "shortName": "E-Bay", "longName": "Ebay Inc.",
                    "regularMarketPrice": 50.24, "regularMarketChangePercent": -1.3456789,
                    "regularMarketVolume": 824681},
                }
        return stocks[ticker]

# Create your tests here.
class SingleStockTestCases(TestCase):
    #Use multiple tickers in case WW3 and some companies don't stay in business.

    @patch('stocks.financeAPI.Stock_info.get_live_price')
    def test_get_live_price(self, livePriceAPI):
        #Setting API call results
        ticker = "VEEV"
        stockPrice = 123.5124
        livePriceAPI.return_value = stockPrice      #In case we need to remove the marketPrice from client

        url = reverse("stocks:livePrice", args = (ticker,))
        data = Client().get(url).json()
        
        expectedResult = {"live_price": f"{stockPrice:0.2f}"}
        self.assertEqual(expectedResult, data)

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

class historicalTestCases(TestCase): 
    def test_historical_1d(self):
        
        url = reverse("stocks:historicalData", args = ("FB",))
        data = Client().get(url, {"dateRange": "1D"}, content_type="application/json").json()["historical_data"]
        #OH BOY D:
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
'''
#These could test the speed with which it gets them, since we'll need it to be fast
class MultipleStockTestCases(TestCase):

    @patch('yahoo_fin.stock_info.get_day_most_active')
    def test_top_stocks(self, mostActive):
        """Make sure that the popular stocks (people recognize them) returns some stocks"""
        mostActive.return_value = pd.DataFrame({
            "Symbol": ["AMD", "AAPL", "TWTR", "AFRM", "F", "SOFI", "PLTR", "NVDA", "NIO", "AMC"], 
            "Name": ["Advanced Micro Devices", "Apple", "Twitter", "Affirm", "Ford", "SoFi Tech", "Palantir", "NVIDIA", "NIO Inc.", "AMC Entertainment"],
            "Price (Intraday)": [95.12, 147.11, 40.72, 23.71, 13.50, 6.75, 8.34, 177.06, 14.31, 11.81],
            "Change": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "% Change": [9.26, 3.19, -9.67, 31.43, 8.52, 19.26, 13.62, 9.47, 9.24, 5.45],
            "Volume": [10.0, 9.0, 8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0],
            "Avg Vol (3 month)": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "Market Cap": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "PE Ratio (TTM)": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        })
        url = reverse("stocks:topStocks")
        data = Client().get(url).json()

        expected = pd.DataFrame({
            "symbol": ["AMD", "AAPL", "TWTR", "AFRM", "F", "SOFI", "PLTR", "NVDA", "NIO", "AMC"], 
            "company_name": ["Advanced Micro Devices", "Apple", "Twitter", "Affirm", "Ford", "SoFi Tech", "Palantir", "NVIDIA", "NIO Inc.", "AMC Entertainment"],
            "price": [95.12, 147.11, 40.72, 23.71, 13.50, 6.75, 8.34, 177.06, 14.31, 11.81],
            "percent_Change": [9.26, 3.19, -9.67, 31.43, -8.52, -19.26, 13.62, 9.47, 9.24, 5.45],
            "change_direction": [True, True, False, True, False, False, True, True, True, True],
            "volume": [10.0, 9.0, 8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0],
        })
        self.assertTrue(data, expected.to_dict("records"))
    
    #@mock.patch('stocks.views.si', FakeAPI)
    @mock.patch('stocks.financeAPI.si', FakeAPI)
    def test_popular_stocks(self):
        """Make sure that the top stocks (most traded) returns some stocks"""
        popular = ["FB", "AAPL", "AMZN", "NFLX", "GOOG", "MSFT", "TSLA", "ABNB", "ZM", "EBAY"]
        url = reverse("stocks:popularStocks")
        data = Client().get(url).json()
        expected = []
        
        for stock in popular:
            d = FakeAPI.get_quote_data(stock)
            newD = {}
            newD["company_name"] = d["displayName"]
            newD["symbol"] = stock
            newD["price"] = f'{d["regularMarketPrice"]}'
            newD["percent_change"] = f"{d['regularMarketChangePercent']:.2f}"
            newD["change_direction"] = d["regularMarketChangePercent"] > 0
            expected.append(newD)
        self.assertEqual(sorted(expected, key = lambda x: x["company_name"]), sorted(data, key = lambda x: x["company_name"]))
           
        

