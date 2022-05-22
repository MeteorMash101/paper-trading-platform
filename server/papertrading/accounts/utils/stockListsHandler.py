from stocks.financeAPI import Stock_info as si

class StockLists:

    #Creates a list of stock JSONs for the watchlist stocks
    @staticmethod
    def watchList(watchList):
        price_and_percent = si.get_price_and_change_for_list(watchList["stocks"])
        stocks = []
        for symbol in watchList["stocks"]:
            stocks.append(StockLists.__buildWatchListJSON(price_and_percent, symbol))
        return stocks

    #Creates a JSON entry for the stock passed in (for watch list display)
    @staticmethod
    def __buildWatchListJSON(price_and_percent, symbol):
        price = price_and_percent[symbol]["price"]
        percent_change = price_and_percent[symbol]["percent_change"]
        return {
                "symbol": symbol,
                "price": price,
                "percent_change": percent_change,
                "changedir": percent_change > 0
        }

    #returns a list JSONs with each being for a single stock the user owns.
    @staticmethod
    def ownedStocks(owned):
        stocks = []
        price_and_percent = si.get_price_and_change_for_list(owned.keys())
        for symbol in sorted(owned):
            stocks.append(StockLists.__buildOwnedJSON(price_and_percent, symbol, owned))
        return stocks

    #Creates a JSON entry for the stock passed in
    @staticmethod
    def __buildOwnedJSON(price_and_percent, symbol, owned):
        totOwned = StockLists.__getTotalOwned(owned, symbol)
        percent_change = price_and_percent[symbol]["percent_change"]
        return {
                "symbol": symbol,
                "shares": totOwned,
                "price": price_and_percent[symbol]["price"],
                "percent_change": percent_change,
                "change_direction": percent_change > 0
        }

    #Sums up the total shares owned of a stock given the list of purchases of said stock
    @staticmethod
    def __getTotalOwned(owned, symbol):
        totOwned = 0
        for purchase in owned[symbol]:
            totOwned += int(purchase["quantity"])
        return totOwned

    