from datetime import datetime
from decimal import Decimal
from stocks.financeAPI import Stock_info as si

class Transaction:

    #Adds the purchase of the stock to the list
    # EDIT: This will likely be changed to accept the price from the frontend
    #       making it really easy to test since we just give it the price
    @staticmethod
    def buy(data, account):
        #While we don't send marketPrice from the frontend, just allow for it to be sent
        if "marketPrice" in data.keys():
            price = float(data["marketPrice"])
        else:
            price = si.get_live_price(data["stock"])

        owned = account.ownedStocks
        newPurchase = {
            "quantity": data["quantity"],
            "datePurchased": datetime.today().strftime("%Y-%m-%d"),
            "purchasePrice": price
        }
        if data["stock"].lower() in owned.keys():   #if the user already owns some stock
                owned[data["stock"].lower()].append(newPurchase) #Convert to getting from server
        else:   #create new entry in the dictionary for the stock
            owned[data["stock"].lower()] = [newPurchase]
        Transaction.__recordTransaction(account, "buy", newPurchase, data["stock"])
        account.balance -= Decimal.from_float(float(data["quantity"])*price)
        return True
    
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
        owned = account.ownedStocks
        Transaction.__stockPurchasesExist(data["stock"], owned)
        stockPurchases = owned[data["stock"].lower()]
        toSell = int(data["quantity"])
        while toSell > 0:
            if toSell > int(stockPurchases[0]["quantity"]): #If
                toSell -= int(stockPurchases[0]["quantity"])
                stockPurchases.pop(0)
            elif toSell < int(stockPurchases[0]["quantity"]):
                stockPurchases[0]["quantity"] = int(stockPurchases[0]["quantity"]) - toSell
                toSell = 0
            else:
                toSell = 0
                stockPurchases.pop(0)
                if len(stockPurchases) == 0:
                    owned.pop(data["stock"].lower())

        #While we aren't guaranteed to pass marketPrice we'll just provide the option
        #Is this safe? Like it allows people to essentially buy the stock at whatever price they want
        #While it makes no sense for people to want to do this they could for competitions
        if "marketPrice" in data.keys():
            price = float(data["marketPrice"])
        else:
            price = si.get_live_price(data["stock"])

        newSale = {
            "quantity": data["quantity"],
            "datePurchased": datetime.today().strftime("%Y-%m-%d"),
            "purchasePrice": price           
        }
        Transaction.__recordTransaction(account, "sell", newSale, data["stock"])
        account.balance += Decimal.from_float(float(data["quantity"]) * price)
        return True
    
    #Check if stock exists, return true if it does
    @staticmethod
    def __stockPurchasesExist(stock, owned):
        return stock.lower() in owned.keys()

    #Saves the transaction in the history
    @staticmethod
    def __recordTransaction(account, type, details, symbol):
        account.transaction_history["history"].append({
            "type": type,
            "stock": symbol.lower(),
            "quantity": details["quantity"], 
            "date": details["datePurchased"], 
            "stockPrice": details["purchasePrice"]
        })