from yahoo_fin import stock_info as si
import threading
import queue
import pandas as pd
import os
from datetime import datetime, timedelta
from pandas.errors import OutOfBoundsDatetime

class Stock_info:
    
    @staticmethod
    def get_quote_data(ticker):
        return si.get_quote_data(ticker)
    
    @staticmethod
    def get_live_price(ticker):
        return si.get_live_price(ticker)

    @staticmethod
    def get_day_most_active():
        return si.get_day_most_active()
    
    @staticmethod
    def get_earnings_report(ticker):
        fullReport = si.get_earnings(ticker)
        earningsDF = fullReport["quarterly_revenue_earnings"].drop(columns="revenue")
        expectedVsActual = fullReport["quarterly_results"]
        earnings = {"quarterly_earnings": earningsDF.merge(expectedVsActual).to_dict("records")}
        return earnings
    
    @staticmethod
    def get_data(ticker, start_date=None, end_date=None):
        return si.get_data(ticker, start_date, end_date)
    
    # EDIT this one provides data in the front end preferred style
    # So maybe adjust above to do this but for now we just directly switch
    
    @staticmethod
    def get_stock_historical_data(ticker, dayrange):
        #get the data appropriate for the range
        data = Stock_info.__get_data_for_interval(ticker, dayrange)
        #separate date and time
        data.reset_index(level=0, inplace=True)
        data["date"] = data["index"].map(lambda a: str(a).split(" ")[0])
        data["time"] = data["index"].map(lambda a: str(a).split(" ")[1])
        data = data.drop(columns = ["ticker", "index"])
        #Add the price change/percent change from the previous entry
        data["dollar_change"] = data.open - data.open[0]#data.open.shift(1)
        data["percent_change"] = 100*data["dollar_change"]/data.open[0]#data.open.shift(1)
        data["change_direction"] = data.dollar_change > 0
        data.at[0, "dollar_change"] = 0
        data.at[0, "percent_change"] = 0
        #convert to output
        jsonData = {
            "historical_data": data.to_dict("records")
        }
        # print("[financeAPI.py]: curr data:", data, type(data))
        return jsonData

    @staticmethod
    def __get_data_for_interval(ticker, range):
        today = datetime.today()
        if range == "1D": # INTERVAL: 5 mins
            return Stock_info.__get_one_day(ticker)
        elif range == "1W": # INTERVAL: 10 mins
            start_date = today - timedelta(days=7)
            df = Stock_info.__get_data_catch_errors(ticker, start_date, today, "1m").iloc[::10, :]
            df.index = df.index.map(lambda x: x - timedelta(hours=4))
            return df
        elif range == "1M": # INTERVAL: 30 minutes
            return Stock_info.__get_one_month(ticker)
        elif range == "3M": # INTERVAL: 1 day
            start_date = (today - timedelta(days=90))
            return Stock_info.__get_data_catch_errors(ticker, start_date)
        elif range == "6M": # INTERVAL: 1 day
            start_date = (today - timedelta(days=180))
            return Stock_info.__get_data_catch_errors(ticker, start_date)
        elif range == "1Y": # INTERVAL: 1 day
            start_date = (today - timedelta(days=365))
            return Stock_info.__get_data_catch_errors(ticker, start_date)
        elif range == "5Y": # INTERVAL: 1 week
            start_date = (today - timedelta(weeks=260))
            return Stock_info.__get_data_catch_errors(ticker, start_date, interval = "1wk")
        else: # INTERVAL: 1 month
            return Stock_info.__get_data_catch_errors(ticker, interval = "1mo")

    def get_stock_historical_data_for_candle(ticker, dayrange):
        #get the data appropriate for the range
        data = Stock_info.__get_data_for_candle_interval(ticker, dayrange)
        #separate date and time
        data.reset_index(level=0, inplace=True)
        data["date"] = data["index"].map(lambda a: str(a).split(" ")[0])
        data["time"] = data["index"].map(lambda a: str(a).split(" ")[1])
        data = data.drop(columns = ["ticker", "index"])
        #Add the price change/percent change from the previous entry
        data["dollar_change"] = data.open - data.open[0]#data.open.shift(1)
        data["percent_change"] = 100*data["dollar_change"]/data.open[0]#data.open.shift(1)
        data["change_direction"] = data.dollar_change > 0
        data.at[0, "dollar_change"] = 0
        data.at[0, "percent_change"] = 0
        #convert to output
        jsonData = {
            "historical_data": data.to_dict("records")
        }
        # print("[financeAPI.py]: curr data:", data, type(data))
        return jsonData
    
    @staticmethod
    def __get_data_for_candle_interval(ticker, range):
        today = datetime.today()
        if range == "1D": # INTERVAL: 5 mins
            return Stock_info.__get_one_day(ticker)
        elif range == "1W": # INTERVAL: 10 mins
            start_date = today - timedelta(days=7)
            #df = Stock_info.__get_data_catch_errors(ticker, start_date, today, "1m").iloc[::10, :]
            #df.index = df.index.map(lambda x: x - timedelta(hours=4))
            return Stock_info.__get_data_catch_errors(ticker, start_date)
            #return df
        elif range == "1M": # INTERVAL: 30 minutes
            start_date = today - timedelta(days=30)
            return Stock_info.__get_data_catch_errors(ticker, start_date)
            #return Stock_info.__get_one_month(ticker)
        elif range == "3M": # INTERVAL: 1 day
            start_date = (today - timedelta(days=90))
            return Stock_info.__get_data_catch_errors(ticker, start_date)
        elif range == "6M": # INTERVAL: 1 day
            start_date = (today - timedelta(days=180))
            return Stock_info.__get_data_catch_errors(ticker, start_date)
        elif range == "1Y": # INTERVAL: 1 day
            start_date = (today - timedelta(days=365))
            return Stock_info.__get_data_catch_errors(ticker, start_date)
        elif range == "5Y": # INTERVAL: 1 week
            start_date = (today - timedelta(weeks=260))
            return Stock_info.__get_data_catch_errors(ticker, start_date, interval = "1wk")
        else: # INTERVAL: 1 month
            return Stock_info.__get_data_catch_errors(ticker, interval = "1mo")

    @staticmethod
    def __get_one_day(ticker):
        today = datetime.today()
        start_date = today - timedelta(days=7)
        df = Stock_info.__get_data_catch_errors(ticker, start_date = start_date, end_date = today, interval="1m").iloc[::5, :]
        df.index = df.index.map(lambda x: x - timedelta(hours=4))
        result = df.groupby(by=lambda x: (x.month, x.day))
        days = sorted(result.groups.keys(), key= lambda x: x[1])
        curDay = sorted(days, key= lambda x: x[0])[-1]
        returnDF = df.loc[result.groups[curDay]]
        return returnDF

    @staticmethod
    def __get_one_month(ticker):
        today = datetime.today()
        days = [] #inputs to thread
        days.append( (today - timedelta(days=29), today - timedelta(days=24)) )
        days.append( (today - timedelta(days=23), today - timedelta(days=18)) )
        days.append( (today - timedelta(days=17), today - timedelta(days=12)) )
        days.append( (today - timedelta(days=11), today - timedelta(days=6))  )
        days.append( (today - timedelta(days=5),  today)                      )
        q = queue.Queue()
        threads = []
        for period in days:
            t = threading.Thread( 
                target=lambda ticker, start, end, interval: Stock_info.__hist_threading(q, ticker, start, end, interval), 
                args= (ticker, period[0], period[1], "1m"))
            t.start()
            threads.append(t)
        for thread in threads:
            thread.join(10) # n is the number of seconds to wait before joining
        df = q.get().iloc[::30,:]
        while not q.empty():
            #df = df.append(q.get().iloc[::60,:])
            df = pd.concat((df, q.get().iloc[::30,:]))
        df.index = df.index.map(lambda x: x - timedelta(hours=4))
        return df.sort_index()

    @staticmethod
    def __hist_threading(q, ticker, start_date = None, end_date = None, interval = "1d"):
        df = Stock_info.__get_data_catch_errors(ticker, start_date, end_date, interval)
        q.put(df)
    
    @staticmethod
    def __get_data_catch_errors(ticker, start_date = None, end_date = None, interval = "1d"):
        try:
            return si.get_data(ticker, start_date = start_date, end_date = end_date, interval=interval).dropna()
        except OutOfBoundsDatetime:
            return si.get_data(ticker, interval=interval).dropna()
    

    @staticmethod
    def get_stock_historical_data_deprecated(ticker, start_date = None, minute = False):
        '''
        print(
            "[financeAPI.py]: ticker, start_date, minute in get_stock_historical_data(): ", 
            ticker, start_date, minute
        )'''
        if minute:
            today = datetime.today()
            try:
                data = si.get_data(ticker, start_date, interval = "1m")
            except KeyError: #When day changes but doesn't have data yet, use previous day
                today = today - timedelta(days=1)
                data = si.get_data(ticker, start_date, interval = "1m")
        else:
            data = si.get_data(ticker, start_date = start_date)
        data.reset_index(level=0, inplace=True)
        data["date"] = data["index"].map(lambda a: str(a).split(" ")[0])
        data["time"] = data["index"].map(lambda a: str(a).split(" ")[1])
        data = data.drop(columns = ["ticker", "index"])
        data = data.dropna()
        jsonData = {
            "historical_data": data.to_dict("records")
        }
        return jsonData

    @staticmethod
    def __get_company_info(ticker, q):
        try:
            info = si.get_company_info(ticker)
        except:
           info = pd.DataFrame(data={"Value": ["Other", None], }, index = ["industry", "longBusinessSummary"])
        info.loc["symbol"] = ticker
        q.put(info)
        return info

    @staticmethod
    def get_full_stock_stats(ticker):
        try:
            q = queue.Queue()
            t = threading.Thread(target=lambda ticker: Stock_info.__get_company_info(ticker, q), args= (ticker, ))
            t.start()
            data = si.get_quote_data(ticker) #To catch assertion errors
            t.join(10) # n is the number of seconds to wait before joining
            info = q.get()
        except:
            return {
                "symbol": ticker,
                "company_name": None,
                "price": None,
                # "low_today": None,
                "high_today": None,
                "percent_change": None,
                "change_direction": True,
                "ft_week_high": None,
                "ft_week_low": None,
                "volume": None,
                "average_volume": None,
                "pe_ratio": None,
                "market_cap": None,
                "revenue": None,
                "dividend_yield": None,
                "industry": info.loc["industry"][0],
                "summary": info.loc["longBusinessSummary"][0],
            }
        jsonData = {
            "symbol": ticker,
            "company_name": Stock_info.__getName(data, ticker),
            "price": data["regularMarketPrice"],
            "low_today": Stock_info.__getDayLow(data),
            "high_today": Stock_info.__getDayHigh(data),
            "percent_change": data["regularMarketChangePercent"],
            "change_direction": data["regularMarketChangePercent"] > 0,
            "ft_week_high": Stock_info.__ftWeekHigh(data),
            "ft_week_low": Stock_info.__ftWeekLow(data),
            "volume": Stock_info.__getMarketVol(data),
            "average_volume": Stock_info.__getAvgVol(data),
            "pe_ratio": Stock_info.__getPE(data),
            "market_cap": Stock_info.__getMarketCap(data),
            "revenue": 0.00000,
            "dividend_yield": 0.00000,
            "industry": info.loc["industry"][0],
            "summary": info.loc["longBusinessSummary"][0],
        }
        return jsonData
    
    #This is for stocks to get the daily most active
    @staticmethod
    def get_top_stocks():
        result = si.get_day_most_active()[:10]
        result = result.drop(columns=["Change", "Avg Vol (3 month)", "Market Cap", "PE Ratio (TTM)"])
        result.columns = ["symbol", "company_name", "price", "percent_change", "volume"]
        result.sort_values("volume", ascending=False, inplace=True)
        #result.drop(result.tail(90).index, inplace = True)
        result["change_direction"] = result["percent_change"] > 0
        result["volume"] = result["volume"].astype('int32')
        return result.to_dict("records")
    
    @staticmethod
    def get_popular_stocks():
        POPULAR_STOCKS = ["FB", "AAPL", "AMZN", "NFLX", "GOOG", "MSFT", "TSLA", "ABNB", "ZM", "EBAY"]
        return Stock_info.__data_for_list(POPULAR_STOCKS)
    
    @staticmethod
    def __data_for_list(symbols):
        q = queue.Queue()
        threads = []
        for symbol in symbols:
            t = threading.Thread(target=lambda ticker: Stock_info.__queueJSON(q, ticker), args= (symbol,))
            t.start()
            threads.append(t)
        for thread in threads:
            thread.join(10) # n is the number of seconds to wait before joining
        stocks = []
        while not q.empty():
            stocks.append(q.get())
        return stocks

    #This is for the multithreaded functions
    def __queueJSON(q, ticker):
        data = si.get_quote_data(ticker)
        jsonData = {
            "symbol": ticker,
            "company_name": Stock_info.__getName(data, ticker),
            "price": data["regularMarketPrice"],
            "percent_change": data["regularMarketChangePercent"],
            "change_direction": data["regularMarketChangePercent"] > 0,
            "volume": Stock_info.__getMarketVol(data)
        }
        q.put(jsonData)

    #Heyo technical debt called and wants you to pay
    #Either way this is for Accounts when they want the stock list, we really only want price and percent change from this
    @staticmethod
    def get_price_and_change_for_list(symbols):
        data = Stock_info.__data_for_list(symbols)
        stocks = {}
        for entry in data:
            stocks[entry["symbol"]] = entry
        return stocks

    @staticmethod
    def symbolNames():
        os.chdir("stocks")
        names = pd.read_csv("ticker_names.csv")
        os.chdir("..")
        return names.to_dict("records")

    def get_industries(symbols):
        q = queue.Queue()
        threads = []
        for symbol in symbols:
            t = threading.Thread(target=lambda ticker: Stock_info.__get_company_info(ticker, q), args= (symbol,))
            t.start()
            threads.append(t)
        for thread in threads:
            thread.join(10) # n is the number of seconds to wait before joining
        stocks = {}
        while not q.empty():
            stock = q.get()
            stocks[stock.loc["symbol"][0]] = stock.loc["industry"][0]
        return stocks

    @staticmethod
    def __getName(data, ticker):
        if "displayName" in data.keys():
            return data["displayName"]
        elif "shortName" in data.keys():
            return data["shortName"] 
        elif "longName" in data.keys():
            return data["longName"]
        else:
            return ticker
    
    @staticmethod
    def __getPE(data):
        if "trailingPE" in data.keys():
            return data["trailingPE"]
        else:
            return None

    @staticmethod
    def __getDayLow(data):
        if "regularMarketDayLow" in data.keys():
            return data["regularMarketDayLow"]
        else:
            return None
    
    @staticmethod
    def __getMarketVol(data):
        if "regularMarketVolume" in data.keys():
            return data["regularMarketVolume"]
        else:
            return None
    
    @staticmethod
    def __getAvgVol(data):
        if "averageDailyVolume3Month" in data.keys():
            return data["averageDailyVolume3Month"]
        elif "averageDailyVolume10Day" in data.keys():
            return data["averageDailyVolume10Month"]
        else:
            return None
    
    @staticmethod
    def __getMarketCap(data):
        if "marketCap" in data.keys():
            return data["marketCap"]
        else:
            return None
    @staticmethod
    def __getDayHigh(data):
        if "regularMarketDayHigh" in data.keys():
            return data["regularMarketDayHigh"]
        else:
            return None
    
    @staticmethod
    def __ftWeekHigh(data):
        if "fiftyTwoWeekHigh" in data.keys():
            return data["fiftyTwoWeekHigh"]
        else:
            return None
    
    @staticmethod
    def __ftWeekLow(data):
        if "fiftyTwoWeekLow" in data.keys():
            return data["fiftyTwoWeekLow"]
        else:
            return None
'''
try:
    try:    
    except KeyError as e:
        exceptionQ.put((ticker, e.__str__()))
except AssertionError as e:
    exceptionQ.put((ticker, "ASSERTION"))
'''
