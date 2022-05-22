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
        dates = sorted(balance.keys())
        day = datetime.fromisoformat(dates[0])
        endDate = datetime.fromisoformat(endDate)
        while day <= endDate:
            dayStr = day.strftime("%Y-%m-%d")
            if dayStr in balance.keys():
                curBalance = balance[dayStr]
            else:
                balance[dayStr] = curBalance
            day += timedelta(days=1)
        return balance

    # EDIT: need to understand this.
    @staticmethod
    def buildBuyingPowerHistory(account):
        history = account.transaction_history["history"]
        if len(history) == 0:
            return {"data": {datetime.today().strftime("%Y-%m-%d"): account.balance}}

        startDate = account.start_date
        balance = account.balance
        balanceHistory = {datetime.today().strftime("%Y-%m-%d"): account.balance}
        curDate = datetime.today().strftime("%Y-%m-%d")
        for transaction in history[::-1]:
            if transaction["date"] == curDate:
                if transaction["type"] == "buy":
                    balance += Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
                else:
                    balance -= Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
            else:
                curDate = transaction["date"]
                balanceHistory[curDate] = balance
                if transaction["type"] == "buy":
                    balance += Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
                else:
                    balance -= Decimal.from_float(float(transaction["quantity"])*transaction["stockPrice"])
        if startDate not in balanceHistory.keys():
            balanceHistory[startDate] = balance
        return {"data": balanceHistory}