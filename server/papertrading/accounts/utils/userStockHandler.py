from stocks.financeAPI import Stock_info as si

class UserStocks:

    #This gets the portfolio value for the user
    @staticmethod
    def calculateValue(owned):
        value = 0
        d = si.get_price_and_change_for_list(owned)
        for ticker in sorted(d.keys()): #Sorted makes it ok for testing...
            value += d[ticker]["price"] * UserStocks.countStock(owned, ticker)
        return value
    
    #Goes through stock purchases to find how many of a stock the user has
    @staticmethod
    def countStock(owned, symbol):
        if symbol not in owned.keys():
            return 0

        quantity = 0
        for order in owned[symbol]:
            quantity += int(order["quantity"])
        return quantity

    #Calculates the percent change in portfolio given the owned stocks and the current value
    @staticmethod
    def calculatePortfolioChange(owned, curVal):
        totalSpent = 0
        for purchases in owned.values():
            for purchase in purchases:
                totalSpent += int(purchase["quantity"]) * float(purchase["price"])
        if totalSpent == 0:
            return 0
        percent_change = 100*(curVal - totalSpent) / totalSpent
        return percent_change
    
    
