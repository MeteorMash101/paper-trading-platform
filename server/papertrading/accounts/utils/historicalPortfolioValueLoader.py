from datetime import date, timedelta
from stocks.financeAPI import Stock_info as si

class PortfolioValue:
    
    @staticmethod
    def load(account):
        if account.portfolio_value_history == {}:
            account.portfolio_value_history["data"] = {}
        startDate = PortfolioValue.__getStartDateToLoadFrom(account)
        PortfolioValue.__fillDatabase(account.portfolio_value_history["data"], startDate, account.transaction_history["history"])
        account.save()

    #Determines the starting date to load portfolio value from
    #Start date is either start of the account or the last day saved in the database
    @staticmethod
    def __getStartDateToLoadFrom(account):
        if len(account.portfolio_value_history["data"].keys()) == 0:
            startDate =  date.fromisoformat(account.start_date)
        else:
            startDate =  date.fromisoformat(sorted(list(account.portfolio_value_history["data"].keys()))[-1])
        return startDate

    #Actually fill the account portfolio value history
    @staticmethod
    def __fillDatabase(d, starting: date, history):
        dailyPortfolioValue = PortfolioValue.__portfolioValueGen(starting, history)
        (day, value) = next(dailyPortfolioValue)
        while day < date.today():
            d[day.strftime("%Y-%m-%d")] = PortfolioValue.__toPennies(value)
            
            (day, value) = next(dailyPortfolioValue)
        d[day.strftime("%Y-%m-%d")] = PortfolioValue.__toPennies(value)
    
    @staticmethod
    def __toPennies(value):
        return int(value*100)

    @staticmethod
    def __portfolioValueGen(start_date, history):
        daysStocks = PortfolioValue.__curOwnedStockGen(history, start_date)
        oneDay = timedelta(days=1)
        day = start_date
        (curDay, owned) = next(daysStocks)
        prevVal = 0
        while curDay < start_date:       #If the history starts before the day we want
            (curDay, owned) = next(daysStocks)
        if curDay > start_date:          #If the history starts after the day we want
            while curDay > day:
                yield (day, 0)
                day += oneDay
        while curDay <= date.today():     #actually calculating in line with history
            print("Current day:", curDay)
            try:
                prevVal = PortfolioValue.__valueOf(owned, curDay)
                yield (curDay, prevVal)
            except KeyError:
                yield(curDay, prevVal)
            (curDay, owned) = next(daysStocks)

    #Returns a tuple with the first element being the date and the second element being
    #a dictionary of owned stocks and how much 
    #e.g. (2022-05-13, {"aapl": 12, "goog": 1})
    @staticmethod
    def __curOwnedStockGen(transaction_history, start_date):
        history = transaction_history.copy()
        currentlyOwned = {}
        if len(history) == 0:
            curDay = start_date
        else:
            curDay = date.fromisoformat(history[0]["date"])
        while True:
            PortfolioValue.__applyTransactionsFromCurrentDay(currentlyOwned, history, curDay)
            yield (curDay, currentlyOwned)
            curDay += timedelta(days=1)
    
    @staticmethod
    def __applyTransactionsFromCurrentDay(currentlyOwned, history, curDay):
        if len(history) == 0:
            return
        transaction = history[0]
        while date.fromisoformat(transaction["date"]) == curDay:
            history.pop(0)
            PortfolioValue.__applyTransaction(currentlyOwned, transaction["type"], transaction["stock"], transaction["quantity"])
            if len(history) == 0:
                return
            transaction = history[0]
        return

    @staticmethod
    def __applyTransaction(currentlyOwned, transactionType, symbol, quantity):
        if transactionType == "sell":
            if currentlyOwned[symbol] == int(quantity):
                currentlyOwned.pop(symbol)
            else:
                currentlyOwned[symbol] = int(currentlyOwned[symbol]) - int(quantity)
        else:
            if symbol in currentlyOwned:
                currentlyOwned[symbol] += int(quantity)
            else:
                currentlyOwned[symbol] = int(quantity)

    #Returns the value of the stocks on the given day
    @staticmethod
    def __valueOf(stocks, curDay):
        stockKeys = list(stocks.keys())
        if len(stockKeys) == 0:
            return 0
        if curDay == date.today():
            return PortfolioValue.__curValueOf(stocks)
        (totPrice, lastOpenMarket) = PortfolioValue.__getLastOpenMarket(stocks, stockKeys[0], curDay)  
        if len(stockKeys) == 1:
            return totPrice

        for symbol, quantity in list(stocks.items())[1:]:
            totPrice += int(quantity) * PortfolioValue.__priceForStockOn(symbol, lastOpenMarket)
        return totPrice

    #Finds the most recent previous open market day
    @staticmethod
    def __getLastOpenMarket(stocks, symbol, curDay):
        lastOpenMarket = curDay
        invalid = True
        while invalid:
            try:
                dayPrice = PortfolioValue.__priceForStockOn(symbol, lastOpenMarket)
                totPrice = int(stocks[symbol]) * dayPrice
                invalid = False
            except KeyError as e:
                lastOpenMarket -= timedelta(days=1)
        return (totPrice, lastOpenMarket)
    
    #Get the price for the day (Expect this to throw a KeyError if the day isn't an open market day)
    @staticmethod
    def __priceForStockOn(symbol, day):
        return si.get_data(symbol, start_date=day, end_date=day+timedelta(days=1)).iloc[-1]["close"]

    #Gets the value of the list of stocks at their current prices.
    @staticmethod
    def __curValueOf(stocks):
        totPrice = 0
        for symbol, quantity in stocks.items():
            totPrice += int(quantity)*si.get_live_price(symbol)
        return totPrice
