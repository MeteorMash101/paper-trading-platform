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
        data = si.get_data(ticker, "2021-03-15")
        data.reset_index(level=0, inplace=True)
        data.rename(columns={"index": "date"}, inplace = True)
        data["date"] = data["date"].map(lambda a: str(a).split(" ")[0])
        data = data.drop(columns = ["ticker", "high", "low", "close", "adjclose"])
        jsonData = {
            "historical_data": data.to_dict("records")
        }
        return jsonData

    @staticmethod
    def get_full_stock_stats(ticker):
        try:
            data = si.get_quote_data(ticker)
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
        try:
            jsonData = {
                "symbol": ticker,
                "company_name": stock_info.__getName(data, ticker),
                "price": si.get_live_price(ticker),
                "low_today": stock_info.__getMarketLow(data),
                "high_today": data["regularMarketDayHigh"],
                "percent_change": data["regularMarketChangePercent"],
                "change_direction": data["regularMarketChangePercent"] > 0,
                "ft_week_high": data["fiftyTwoWeekHigh"],
                "ft_week_low": data["fiftyTwoWeekLow"],
                "volume": stock_info.__getMarketVol(data),
                "average_volume": stock_info.__getAvgVol(data),
                "pe_ratio": stock_info.__getPE(data),
                "market_cap": stock_info.__getMarketCap(data),
                "revenue": 0.00000,
                "dividend_yield": 0.00000
            }
        except KeyError as e:
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(ticker)
            print(e.__str__())
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            #Throw error to catch
            #Currently it just prints none for all the remaining stock
            jsonData = {
                "symbol": ticker,
                "company_name": stock_info.__getName(data, ticker),
                "price": si.get_live_price(ticker),
                "low_today": stock_info.__getMarketLow(data),
                "high_today": None,
                "percent_change": None,
                "change_direction": None,
                "ft_week_high": None,
                "ft_week_low": None,
                "volume": stock_info.__getMarketVol(data),
                "average_volume": stock_info.__getAvgVol(data),
                "pe_ratio": stock_info.__getPE(data),
                "market_cap": stock_info.__getMarketCap(data),
                "revenue": 0.00000,
                "dividend_yield": 0.00000
            }
        return jsonData
    
    @staticmethod
    def get_top_stocks():
        NUM_STOCKS_TO_RETURN = 5
        symbols = si.get_day_most_active()["Symbol"].to_list()
        print("----------------------", symbols)
        q = queue.Queue()
        threads = []
        for symbol in symbols[:(NUM_STOCKS_TO_RETURN + 1)]:
            t = threading.Thread(target=lambda ticker: stock_info.__queueJSON(q, ticker), args= (symbol,))
            t.start()
            threads.append(t)
        for thread in threads:
            thread.join(2) # n is the number of seconds to wait before joining
        stocks = []
        while not q.empty():
            stocks.append(q.get())
        #print([i["symbol"] for i in stocks])
        #print([(i["symbol"], i["volume"]) for i in sorted(stocks, key = lambda x: x["volume"], reverse=True)])
        return sorted(stocks, key = lambda x: x["volume"], reverse=True)

    @staticmethod
    def get_popular_stocks():
        POPULAR_STOCKS = ["FB", "AAPL", "AMZN", "NFLX", "GOOG", "MSFT", "TSLA", "ABNB", "ZM"]
        q = queue.Queue()
        threads = []
        for symbol in POPULAR_STOCKS:
            t = threading.Thread(target=lambda ticker: stock_info.__queueJSON(q, ticker), args= (symbol,))
            t.start()
            threads.append(t)
        for thread in threads:
            thread.join(2) # n is the number of seconds to wait before joining
        stocks = []
        while not q.empty():
            stocks.append(q.get())
        return stocks

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
    def __getMarketLow(data):
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
'''
try:
    try:    
    except KeyError as e:
        exceptionQ.put((ticker, e.__str__()))
except AssertionError as e:
    exceptionQ.put((ticker, "ASSERTION"))
'''