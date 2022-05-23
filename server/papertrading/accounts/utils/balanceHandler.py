from datetime import datetime, timedelta
from decimal import Decimal

class Balance:

    #Adds the balance history to the portfolio value history
    @staticmethod
    def addBalance(pv, balance):
        balance = Balance.fillBalance(balance, sorted(pv.keys())[-1])
        for key in pv.keys():
            pv[key] = pv[key] + balance[key]*100
        return pv

    #Balance is a sparse dictionary, only made of dates that the balance changed
    #This adds the balance for days inbetween, up until the end date
    @staticmethod
    def fillBalance(balance, endDate):
        for key in balance.keys():
            balance[key] = round(balance[key], 2)
        day = datetime.fromisoformat(sorted(balance.keys())[0])
        endDate = datetime.fromisoformat(endDate)
        while day <= endDate:
            dayStr = day.strftime("%Y-%m-%d")
            if dayStr in balance.keys():
                curBalance = balance[dayStr]
            else:
                balance[dayStr] = curBalance
            day += timedelta(days=1)
        return balance

    #Starting with the most recent transaction, save the end of day balance
    #for any day in which sales were made.
    @staticmethod
    def buildBuyingPowerHistory(account):
        history = account.transaction_history["history"]
        startDate = account.start_date
        balance = account.balance
        balanceHistory = {datetime.today().strftime("%Y-%m-%d"): account.balance}
        curDate = datetime.today().strftime("%Y-%m-%d")

        for transaction in history[::-1]:
            #When we get to a new date add it to the balance history
            if transaction["date"] != curDate:
                curDate = transaction["date"]
                balanceHistory[curDate] = balance
            balance += Balance.__totalTransactionValue(transaction)

        if startDate not in balanceHistory.keys(): #We need the balance history for the first date
            balanceHistory[startDate] = balance
        return {"data": balanceHistory}

    #Calculate the value of the transaction; negative is a sale, positive is a purchase
    @staticmethod
    def __totalTransactionValue(transaction):
        buyOrSell = (-1)**(transaction["type"] != "buy")
        return buyOrSell * Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])