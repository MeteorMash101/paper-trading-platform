from stocks.financeAPI import Stock_info as si

class UserStocks:

    #This calculates the current portfolio value for the user
    @staticmethod
    def calculateCurrentPortfolioValue(owned):
        value = 0
        d = si.get_price_and_change_for_list(owned)
        for ticker in sorted(d.keys()): #Sorted makes it ok for testing...
            value += d[ticker]["price"] * UserStocks.countNumberOfSharesOwned(owned, ticker)
        return value
    
    #Goes through stock purchases to find how many of a stock the user has
    @staticmethod
    def countNumberOfSharesOwned(owned, symbol):
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
        for purchases in owned.values(): #calculate how much was spent on each share at time of purchase
            for purchase in purchases:
                print("HERE,",purchase)
                totalSpent += int(purchase["quantity"]) * float(purchase["price"])
        if totalSpent == 0:
            return 0
        percent_change = 100*(curVal - totalSpent) / totalSpent
        return percent_change
    
    
