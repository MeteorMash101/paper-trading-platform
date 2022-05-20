from django.test import TestCase, Client
from django.urls import reverse
import re
from unittest.mock import patch
from unittest import mock
import pandas as pd
import numpy as np
import random
from datetime import datetime, date
from dateutil.relativedelta import relativedelta

#https://williambert.online/2011/07/how-to-unit-testing-in-django-with-mocking-and-patching/
class FakeDate(datetime):
    def __new__(cls, *args, **kwargs):
        return datetime.__new__(datetime, *args, **kwargs)

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

    def get_data(ticker, start_date = None, end_date = None, interval="1d"):
        if start_date:
            start_date = datetime.fromisoformat(start_date.strftime("%Y-%m-%d"))
        #Need: 1m, 1d, 1wk, 1mo
        #day will take every 5 minutes
        #week takes every 10 minutes
        #month is every 30 minutes
        #the rest just do every entry
        #1D, 1W, 1Mo
        if interval == "1mo": #all time
            return FakeAPI.allTime(ticker)
        elif interval == "1wk": #5Y
            return FakeAPI.weeklyInterval(ticker, start_date)
        elif interval == "1d": #3m, 6m, 1yr
            return FakeAPI.dailyInterval(ticker, start_date)
        elif interval == "1m": #1D, 1W, 1Mo
            return FakeAPI.minuteInterval(ticker, start_date, end_date)

    def minuteInterval(ticker, start_date, end_date):
        df = pd.DataFrame(columns=["open", "high", "low", "close", "adjclose", "volume", "ticker"])
        rng = random.Random(8)

        day = start_date
        day = day + relativedelta(minutes=810)
        i = 0
        while day < end_date:
            i += 1
            openPrice = 150 + 0.16*i
            FakeAPI.addRow(df, openPrice, day, 1, rng)
            if i % 13 == 0:
                day += relativedelta(days=1)
                day -= relativedelta(minutes=380)
            else:
                day += relativedelta(minutes=30)
        return df

    def dailyInterval(ticker, start_date):
        df = pd.DataFrame(columns=["open", "high", "low", "close", "adjclose", "volume", "ticker"])
        rng = random.Random(8)

        day = start_date
        end_date = datetime.fromisoformat("2022-05-17")
        i = 0
        while day <= end_date:
            openPrice = 150 + 0.16*i
            FakeAPI.addRow(df, openPrice, day, 1, rng)
            day += relativedelta(days=1)
            i += 1
        return df

    def weeklyInterval(ticker, start_date):
        df = pd.DataFrame(columns=["open", "high", "low", "close", "adjclose", "volume", "ticker"])
        rng = random.Random(8)
        day = start_date
        end_date = datetime.fromisoformat("2022-05-17")
        i = 0
        while day <= end_date:
            openPrice = 150 + 4*i
            FakeAPI.addRow(df, openPrice, day, 25, rng)
            day += relativedelta(weeks=1)
            i += 1
        return df
    
    def allTime(ticker):
        df = pd.DataFrame(columns=["open", "high", "low", "close", "adjclose", "volume", "ticker"])
        rng = random.Random(8)
        day = datetime.fromisoformat("2015-02-01")
        end_date = datetime.fromisoformat("2022-05-17")
        i = 0
        while day <= end_date:
            openPrice = 150 + 16*i
            FakeAPI.addRow(df, openPrice, day, 100, rng)
            day += relativedelta(months=1)
            i += 1
        return df

    def addRow(df, openPrice, day, modifier, rng):
        openPrice = openPrice + rng.uniform(-modifier*openPrice/6000, modifier*openPrice/6000)
        changeNoise = rng.uniform(-modifier*openPrice/2500, modifier*openPrice/2500)
        closePrice = openPrice + changeNoise
        floorVal = min(openPrice, closePrice)
        ceilVal = max(openPrice, closePrice)
        rangeNoise = (ceilVal - floorVal)/2
        high = max(ceilVal, ceilVal + rangeNoise)
        low = max(floorVal, floorVal + rangeNoise)
        volumeNoise = rng.randint(-500000, 1000000)
        df.loc[day] = [openPrice, high, low, closePrice, closePrice, 1000000+volumeNoise, "TSLA"]

'''
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
'''

class historicalTestCases(TestCase):
    '''
    elif interval == "1m": #1W, 1Mo
        return FakeAPI.minuteInterval(ticker, start_date, end_date)
    '''
    @mock.patch('stocks.financeAPI.datetime', FakeDate)
    @mock.patch("stocks.financeAPI.si", FakeAPI)
    def test_historical_1D(self):
        
        today = datetime(2022, 5, 17)
        FakeDate.today = classmethod(lambda cls: today)
        url = reverse("stocks:testing", args = ("TSLA",))

        data = Client().get(url, {"dateRange": "1D"}, content_type="application/json").json()["historical_data"]
        apiData = FakeAPI.get_data("TSLA", start_date=(today - relativedelta(days=7)), end_date=today, interval="1m")[::5]
        apiData = apiData[apiData.index.date == date(2022, 5, 16)]
        apiData.index = apiData.index.map(lambda x: x - relativedelta(hours=4))
        expected = self.__changeFormat(apiData)
        self.assertEqual(expected, data)
    
    @mock.patch('stocks.financeAPI.datetime', FakeDate)
    @mock.patch("stocks.financeAPI.si", FakeAPI)
    def test_historical_1W(self):
        
        today = datetime(2022, 5, 17)
        FakeDate.today = classmethod(lambda cls: today)
        url = reverse("stocks:testing", args = ("TSLA",))

        data = Client().get(url, {"dateRange": "1W"}, content_type="application/json").json()["historical_data"]
        apiData = FakeAPI.get_data("TSLA", start_date=(today - relativedelta(days=7)), end_date=today, interval="1m")[::10]
        apiData.index = apiData.index.map(lambda x: x - relativedelta(hours=4))
        expected = self.__changeFormat(apiData)
        self.assertEqual(expected, data)

    @mock.patch('stocks.financeAPI.datetime', FakeDate)
    @mock.patch("stocks.financeAPI.si", FakeAPI)
    def test_historical_1M(self):
        today = datetime(2022, 5, 17)
        FakeDate.today = classmethod(lambda cls: today)
        url = reverse("stocks:testing", args = ("TSLA",))

        data = Client().get(url, {"dateRange": "1M"}, content_type="application/json").json()["historical_data"]

        days = [] #inputs to thread
        days.append( (today - relativedelta(days=29), today - relativedelta(days=24)) )
        days.append( (today - relativedelta(days=23), today - relativedelta(days=18)) )
        days.append( (today - relativedelta(days=17), today - relativedelta(days=12)) )
        days.append( (today - relativedelta(days=11), today - relativedelta(days=6))  )
        days.append( (today - relativedelta(days=5),  today)                      )
        df = FakeAPI.get_data("TSLA", start_date=days[0][0], end_date=days[0][1], interval="1m").iloc[::30,:]
        for start, end in days[1:]:
            apiData = FakeAPI.get_data("TSLA", start_date=start, end_date=end, interval="1m").iloc[::30,:]
            df = pd.concat((df, apiData))
        df.index = df.index.map(lambda x: x - relativedelta(hours=4))
        df = df.sort_index()
        expected = self.__changeFormat(df)
        self.assertEqual(expected, data)
    
    @mock.patch('stocks.financeAPI.datetime', FakeDate)
    @mock.patch("stocks.financeAPI.si", FakeAPI)
    def test_historical_3M(self):
        
        today = datetime(2022, 5, 17)
        FakeDate.today = classmethod(lambda cls: today)
        url = reverse("stocks:testing", args = ("TSLA",))

        data = Client().get(url, {"dateRange": "3M"}, content_type="application/json").json()["historical_data"]
        expected = self.__changeFormat(FakeAPI.get_data("TSLA", start_date=(today - relativedelta(days=90))))
        self.assertEqual(expected, data)

    @mock.patch('stocks.financeAPI.datetime', FakeDate)
    @mock.patch("stocks.financeAPI.si", FakeAPI)
    def test_historical_6M(self):
        
        today = datetime(2022, 5, 17)
        FakeDate.today = classmethod(lambda cls: today)
        url = reverse("stocks:testing", args = ("TSLA",))

        data = Client().get(url, {"dateRange": "6M"}, content_type="application/json").json()["historical_data"]
        expected = self.__changeFormat(FakeAPI.get_data("TSLA", start_date=(today - relativedelta(days=180))))
        self.assertEqual(expected, data)

    @mock.patch('stocks.financeAPI.datetime', FakeDate)
    @mock.patch("stocks.financeAPI.si", FakeAPI)
    def test_historical_1Y(self):
        
        today = datetime(2022, 5, 17)
        FakeDate.today = classmethod(lambda cls: today)
        url = reverse("stocks:testing", args = ("TSLA",))

        data = Client().get(url, {"dateRange": "1Y"}, content_type="application/json").json()["historical_data"]
        expected = self.__changeFormat(FakeAPI.get_data("TSLA", start_date=(today - relativedelta(days=365))))
        self.assertEqual(expected, data)

    @mock.patch('stocks.financeAPI.datetime', FakeDate)
    @mock.patch("stocks.financeAPI.si", FakeAPI)
    def test_historical_5Y(self):
        
        today = datetime(2022, 5, 17)
        FakeDate.today = classmethod(lambda cls: today)
        url = reverse("stocks:testing", args = ("TSLA",))

        data = Client().get(url, {"dateRange": "5Y"}, content_type="application/json").json()["historical_data"]
        expected = self.__changeFormat(FakeAPI.get_data("TSLA", start_date=(today - relativedelta(weeks=260)), interval="1wk"))
        self.assertEqual(expected, data)

    @mock.patch('stocks.financeAPI.datetime', FakeDate)
    @mock.patch("stocks.financeAPI.si", FakeAPI)
    def test_historical_all_time(self):
        
        today = datetime(2022, 5, 17)
        FakeDate.today = classmethod(lambda cls: today)
        url = reverse("stocks:testing", args = ("TSLA",))

        data = Client().get(url, {"dateRange": "ALL TIME"}, content_type="application/json").json()["historical_data"]
        expected = self.__changeFormat(FakeAPI.get_data("TSLA", interval="1mo"))
        self.assertEqual(expected, data)
    
    def __changeFormat(self, df):
        df.reset_index(level=0, inplace=True)
        df["date"] = df["index"].map(lambda a: str(a).split(" ")[0])
        df["time"] = df["index"].map(lambda a: str(a).split(" ")[1])
        df = df.drop(columns = ["ticker", "index"])
        #Add the price change/percent change from the previous entry
        df["dollar_change"] = df.open - df.open.shift(1)
        df["percent_change"] = 100*df["dollar_change"]/df.open.shift(1)
        df.at[0, "dollar_change"] = 0
        df.at[0, "percent_change"] = 0

        #Convert military time to non-military time
        df["time"] = df["time"].apply(lambda x: datetime.strptime(x, '%H:%M:%S').strftime('%I:%M %p'))
        #convert to output
        return df.to_dict("records")

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
    
    @mock.patch('stocks.financeAPI.si', FakeAPI)
    def test_popular_stocks(self):
        """Make sure it handles the data from the API correctly"""
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
'''