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
        data = si.get_quote_data(ticker)
        try:
            jsonData = {
                "symbol": ticker,
                "company_name": data["displayName"],
                "price": si.get_live_price(ticker),
                "low_today": data["regularMarketDayLow"],
                "high_today": data["regularMarketDayHigh"],
                "percent_change": data["regularMarketChangePercent"],
                "change_direction": data["regularMarketChangePercent"] > 0,
                "ft_week_high": data["fiftyTwoWeekHigh"],
                "ft_week_low": data["fiftyTwoWeekLow"],
                "volume": data["regularMarketVolume"],
                "average_volume": data["averageDailyVolume3Month"],
                "pe_ratio": data["trailingPE"],
                "market_cap": data["marketCap"],
                "revenue": 0.00000,
                "dividend_yield": 0.00000
            }
        except KeyError as e:
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", e.__str__(), "!!!!!!!", ticker)
            jsonData = {
                "symbol": ticker,
                "company_name": data["shortName"],
                "price": si.get_live_price(ticker),
                "low_today": data["regularMarketDayLow"],
                "high_today": data["regularMarketDayHigh"],
                "percent_change": data["regularMarketChangePercent"],
                "change_direction": data["regularMarketChangePercent"] > 0,
                "ft_week_high": data["fiftyTwoWeekHigh"],
                "ft_week_low": data["fiftyTwoWeekLow"],
                "volume": data["regularMarketVolume"],
                "average_volume": data["averageDailyVolume3Month"],
                "pe_ratio": 0.0,
                "market_cap": data["marketCap"],
                "revenue": 0.00000,
                "dividend_yield": 0.00000
            }
        return jsonData
    
    @staticmethod
    def get_top_stocks():
        symbols = si.get_day_most_active()["Symbol"].to_list()
        print("----------------------", symbols)
        q = queue.Queue()
        threads = []
        for symbol in symbols[:10]:
            t = threading.Thread(target=lambda ticker: queueJSON(q, ticker), args= (symbol,))
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

def queueJSON(q, ticker):
    data = si.get_quote_data(ticker)
    try:
        jsonData = {
            "symbol": ticker,
            "company_name": data["displayName"],
            "price": si.get_live_price(ticker),
            "percent_change": data["regularMarketChangePercent"],
            "change_direction": data["regularMarketChangePercent"] > 0,
            "volume": data["regularMarketVolume"]
        }
    except:
        print("!!!!!!!!!!!!!!!!!", ticker)
        jsonData = {
            "symbol": ticker,
            "company_name": data["shortName"],
            "price": si.get_live_price(ticker),
            "percent_change": data["regularMarketChangePercent"],
            "change_direction": data["regularMarketChangePercent"] > 0,
            "volume": data["regularMarketVolume"]
        }
    q.put(jsonData)