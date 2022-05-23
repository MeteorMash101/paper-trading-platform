from datetime import datetime
from decimal import Decimal
from stocks.financeAPI import Stock_info as si

class Transaction:

    #Adds the purchase of the stock to the list
    # EDIT: This will likely be changed to accept the price from the frontend
    #       making it really easy to test since we just give it the price
    @staticmethod
    def buy(data, account):
        symbol = data["stock"].lower()
        price = Transaction.__getPrice(data)

        purchase = Transaction.__createTransactionEntry(data, price)
        Transaction.__addPurchaseToOwnedStocks(account.ownedStocks, symbol, purchase)
        Transaction.__recordTransaction(account, "buy", purchase, symbol)
        account.balance -= Decimal.from_float(float(data["quantity"])*price)
        return True

    #Get's the price from the front end, but if it doesn't pass it
    #it takes the live price
    @staticmethod
    def __getPrice(data):
        if "marketPrice" in data.keys():
            price = float(data["marketPrice"])
        else:
            price = si.get_live_price(data["stock"])
        return price

    #Each purchase is stored as a quantity, date, and price. This creates that dictionary
    @staticmethod
    def __createTransactionEntry(data, price):
        return {
            "quantity": data["quantity"],
            "date": datetime.today().strftime("%Y-%m-%d"),
            "price": price
        }

    #If the user already owns some shares they add to that stock's list
    #Otherwise create a new entry and list for that stock
    @staticmethod
    def __addPurchaseToOwnedStocks(owned, symbol, purchase):
        if symbol in owned.keys():   #if the user already owns some stock
                owned[symbol].append(purchase) #Convert to getting from server
        else:   #create new entry in the dictionary for the stock
            owned[symbol] = [purchase]

    # EDIT: understnd this a bit mroe
    # EDIT: This will accept the front end value for the stock?
    #Sells the given amount of stock
    #enough stock being owned is checked for in the client
    #Format of a single stock would be:
    '''
    {"aapl": [{"quantity": "2", "datePurchased": "2022-03-04", "purchasePrice": 56.150001525878906},
              {"quantity": "4", "datePurchased": "2022-03-05", "purchasePrice": 57.186511155551367}]}
    '''
    #So selling starts with the top (first) element in the list and removes as much as it can from there.
    #If it removes all the list elements, it will delete the stock name from the dictionary (deleting "aapl").
    @staticmethod
    def sell(data, account):
        Transaction.__removeSoldSharesFromOwned(data, account)
        price = Transaction.__getPrice(data)

        newSale = Transaction.__createTransactionEntry(data, price)
        Transaction.__recordTransaction(account, "sell", newSale, data["stock"])
        account.balance += Decimal.from_float(float(data["quantity"]) * price)
        return True

    #Sells the x shares the user requested
    @staticmethod
    def __removeSoldSharesFromOwned(data, account):
        owned = account.ownedStocks
        symbol = data["stock"].lower()
        toSell = int(data["quantity"])
        while toSell > 0:
            toSell = Transaction.__sellOldestPurchasedShares(toSell, owned[symbol])
        if len(owned[symbol]) == 0:
            owned.pop(symbol)

    #Sell the shares from the oldest purchase of the stock they made.
    @staticmethod
    def __sellOldestPurchasedShares(toSell, stockPurchases):
        if toSell >= int(stockPurchases[0]["quantity"]): #When we can sell the whole transaction amount of shares
            toSell -= int(stockPurchases[0]["quantity"])
            stockPurchases.pop(0)
        else: #When we sell only part of the transaction
            stockPurchases[0]["quantity"] = int(stockPurchases[0]["quantity"]) - toSell
            toSell = 0
        return toSell

    #Saves the transaction in the transaction history
    @staticmethod
    def __recordTransaction(account, type, details, symbol):
        account.transaction_history["history"].append({
            "type": type,
            "stock": symbol.lower(),
            "quantity": details["quantity"], 
            "date": details["date"], 
            "stockPrice": details["price"]
        })