from yahoo_fin import stock_info as si
import threading
import queue

class stock_info:
    
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
    def getEarningsReport(ticker):
        fullReport = si.get_earnings(ticker)
        earningsDF = fullReport["quarterly_revenue_earnings"].drop(columns="revenue")
        earnings = {"quarterly_earnings": earningsDF.to_dict("records")}
        return earnings

    @staticmethod
    def get_stock_historical_data(ticker):
        data = si.get_data(ticker)
        data.reset_index(level=0, inplace=True)
        data.rename(columns={"index": "date"}, inplace = True)
        data["date"] = data["date"].map(lambda a: str(a).split(" ")[0])
        data = data.drop(columns = ["ticker"])
        jsonData = {
            "historical_data": data.to_dict("records")
        }
        return jsonData

    @staticmethod
    def get_full_stock_stats(ticker):
        try:
            data = si.get_quote_data(ticker) #To catch assertion errors
            live_price = si.get_live_price(ticker) #to catch keyerrors with the key "timestamp" (these can't be sold anyways)
        except:
            return {
                "symbol": ticker,
                "company_name": None,
                "price": None,
                "low_today": None,
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
                "dividend_yield": None
            }
        jsonData = {
            "symbol": ticker,
            "company_name": stock_info.__getName(data, ticker),
            "price": live_price,
            "low_today": stock_info.__getMarketLow(data),
            "high_today": stock_info.__getDayHigh(data),
            "percent_change": data["regularMarketChangePercent"],
            "change_direction": data["regularMarketChangePercent"] > 0,
            "ft_week_high": stock_info.__ftWeekHigh(data),
            "ft_week_low": stock_info.__ftWeekLow(data),
            "volume": stock_info.__getMarketVol(data),
            "average_volume": stock_info.__getAvgVol(data),
            "pe_ratio": stock_info.__getPE(data),
            "market_cap": stock_info.__getMarketCap(data),
            "revenue": 0.00000,
            "dividend_yield": 0.00000
        }
        return jsonData
    
    #This is for stocks to get the daily most active
    @staticmethod
    def get_top_stocks():
        symbols = si.get_day_most_active()["Symbol"].to_list()
        print("----------------------", symbols)
        q = queue.Queue()
        threads = []
        for symbol in symbols[:10]:
            t = threading.Thread(target=lambda ticker: stock_info.__queueJSON(q, ticker), args= (symbol,))
            t.start()
            threads.append(t)
        for thread in threads:
            thread.join(2) # n is the number of seconds to wait before joining
        stocks = []
        while not q.empty():
            stocks.append(q.get())
        return sorted(stocks, key = lambda x: x["volume"], reverse=True)

    #This is for the multithreaded functions
    def __queueJSON(q, ticker):
        data = si.get_quote_data(ticker)
        jsonData = {
            "symbol": ticker,
            "company_name": stock_info.__getName(data, ticker),
            "price": si.get_live_price(ticker),
            "percent_change": data["regularMarketChangePercent"],
            "change_direction": data["regularMarketChangePercent"] > 0,
            "volume": stock_info.__getMarketVol(data)
        }
        q.put(jsonData)

    #Heyo technical debt called and wants you to pay
    #Either way this is for Accounts when they want the stock list, we really only want price and percent change from this
    @staticmethod
    def get_price_and_change_for_list(symbols):
        q = queue.Queue()
        threads = []
        for symbol in symbols:
            t = threading.Thread(target=lambda ticker: stock_info.__queueJSON(q, ticker), args= (symbol,))
            t.start()
            threads.append(t)
        for thread in threads:
            thread.join(2) # n is the number of seconds to wait before joining
        stocks = {}
        while not q.empty():
            stock = q.get()
            stocks[stock["symbol"]] = stock
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