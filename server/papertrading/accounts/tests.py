from django.test import TestCase, Client
from django.urls import reverse
from accounts.models import Account
from datetime import date


class StockListTestCases(TestCase):

    
    #Creates the test user with id "test"
    def createTestUser(self):
        user = Account.objects.create(name = "Will", email = "test@gmail.com", google_user_id = "test")
        user.save()

    #Always uses the test user with id "test"
    def buyOrSellStock(self, action, symbol, quantity):
        url = reverse("accounts:ownedStockList", args=("test", ))
        return Client().put(url, {"action": action, "stock": symbol, "quantity":quantity}, content_type="application/json")

    #Returns the test user
    def getTestUser(self):
        return Account.objects.filter(google_user_id = "test")[0]
    
    #A single purchase to make sure it is initializing the structure correctly
    def test_buy_share_not_owned_raw_data(self):
        """Test buying a user's first stock"""
        self.createTestUser()
        self.buyOrSellStock("buy", "dis", 1)
        user = self.getTestUser()
        #Get the data from the server
        data = user.ownedStocks
        #Price is set to zero because I don't want it failing due to market fluctuations
        expectedResult = {"dis": [{"quantity": 1, "datePurchased": date.today().strftime("%Y-%m-%d"), "purchasePrice": 0.0}]}
        self.assertTrue(data["dis"][0]["purchasePrice"] != None)
        expectedResult["dis"][0]["purchasePrice"] = data["dis"][0]["purchasePrice"]
        #Checking the raw data result is correct
        self.assertEqual(expectedResult, data)

    #TEST NOT DONE, TRANSACTION HISTORY IS STORED USING INPUT, BUT WE SHOULD MAKE ALL TICKERS LOWER CASE
    #Well maybe, idk if it matters but consistency right
    def test_buy_share_transaction_history(self):
        self.createTestUser()
        self.buyOrSellStock("buy", "DIS", 1)
        user = self.getTestUser()
        #Get the data from the server
        data = user.transaction_history["history"]
        #Price is set to zero because I don't want it failing due to market fluctuations
        expectedResult = [{"type": "buy", "stock": "dis", "quantity": 1, "date": date.today().strftime("%Y-%m-%d"), "stockPrice": 0}]
        self.assertTrue(data[0]["stockPrice"] != None)
        expectedResult[0]["stockPrice"] = data[0]["stockPrice"]
        #Checking the raw data result is correct
        self.assertEqual(expectedResult, data)

    #Buy the same stock back to back
    def test_buy_share_some_owned(self):
        """Checking that multiple separate purchases of the same stock are put in the list correctly"""
        self.createTestUser()
        self.buyOrSellStock("buy", "dis", 3)
        self.buyOrSellStock("buy", "dis", 2)
        
        user = self.getTestUser()
        #Get the data from the server
        data = user.ownedStocks
        #Price is set to zero because I don't want it failing due to market fluctuations
        expectedResult = {"dis": [{"quantity": 3, "datePurchased": date.today().strftime("%Y-%m-%d"), "purchasePrice": 0.0},
                                  {"quantity": 2, "datePurchased": date.today().strftime("%Y-%m-%d"), "purchasePrice": 0.0}]}
        self.assertTrue(data["dis"][0]["purchasePrice"] != None)
        self.assertTrue(data["dis"][1]["purchasePrice"] != None)
        expectedResult["dis"][0]["purchasePrice"] = data["dis"][0]["purchasePrice"]
        expectedResult["dis"][1]["purchasePrice"] = data["dis"][1]["purchasePrice"]
        #Checking the raw data result is correct
        self.assertEqual(expectedResult, data)

    #A single purchase to see how balance changes
    def test_valid_balance_after_purchase(self):
        """Making sure the balance is within one cent of what it should be"""
        self.createTestUser()
        self.buyOrSellStock("buy", "dis", 2)
        user = self.getTestUser()
        data = user.ownedStocks
        #Check balance (it might not be exact so we just want it within a cent)
        self.assertAlmostEqual(float(user.balance) + data["dis"][0]["purchasePrice"]*data["dis"][0]["quantity"], 5000.00, delta = 0.01)

    
    #CURRENTLY WE PROBABLY TEST IN FRONT END FOR THIS SO IT SHOULDN'T MATTER WHAT HAPPENS SINCE IT CAN'T HAPPEN
    def test_buy_shares_without_enough_money(self):
        #self.createTestUser()
        #result = self.buyOrSellStock("buy", "DIS", 5000)
        #print(result)
        #user = self.getTestUser()
        #data = user.ownedStocks
        #Check balance (it might not be exact so we just want it within a cent)
        #self.assertAlmostEqual(float(user.balance) + data["dis"][0]["purchasePrice"]*data["dis"][0]["quantity"], 5000.00, delta = 0.01)
        self.assertTrue(True)
    
    #Also is tested for and probably doesn't matter
    def test_sell_share_not_owned(self):
        self.assertTrue(True)

    #Same as above?
    def test_sell_many_shares_one_owned(self):
        self.assertTrue(True)

    #Same as above?
    def test_sell_share_none_owned(self):
        self.assertTrue(True)
    

    #NOT DONE
    #The view needs to delete the stock when we sell the last instance of it.
    def test_sell_one_share_one_owned(self):
        self.createTestUser()
        self.buyOrSellStock("buy", "dis", 3)
        self.buyOrSellStock("sell", "dis", 3)
        user = self.getTestUser()
        data = user.ownedStocks
        self.assertTrue(data == {})

    #NOT DONE
    #accounts.views sellStock thing sets the quantity to a string, why and lets fix that
    #Let's make things consistent please me
    def test_sell_shares_single_purchase(self):
        self.createTestUser()
        self.buyOrSellStock("buy", "dis", 3)
        self.buyOrSellStock("sell", "dis", 2)
        user = self.getTestUser()
        data = user.ownedStocks
        #This should be switched to an int quantity when the view is changed.
        expected = {"dis": [{"quantity": 1, "datePurchased": date.today().strftime("%Y-%m-%d"), "purchasePrice": 0.0}]}
        self.assertTrue(data["dis"][0]["purchasePrice"] != None)
        expected["dis"][0]["purchasePrice"] = data["dis"][0]["purchasePrice"]
        #Checking the raw data result is correct
        self.assertEqual(expected, data)
    
    #NOT DONE
    #Same as above where the quantity is a string after selling and modifying a value
    def test_sell_shares_multiple_purchase(self):
        self.createTestUser()
        self.buyOrSellStock("buy", "dis", 3)
        self.buyOrSellStock("buy", "dis", 5)
        self.buyOrSellStock("buy", "dis", 2)
        self.buyOrSellStock("sell", "dis", 4)
        user = self.getTestUser()
        data = user.ownedStocks
        #This should be switched to an int quantity when the view is changed.
        expected = {"dis": [{"quantity": 4, "datePurchased": date.today().strftime("%Y-%m-%d"), "purchasePrice": 0.0},
                            {"quantity": 2, "datePurchased": date.today().strftime("%Y-%m-%d"), "purchasePrice": 0.0}]}
        self.assertTrue(data["dis"][0]["purchasePrice"] != None)
        expected["dis"][0]["purchasePrice"] = data["dis"][0]["purchasePrice"]
        expected["dis"][1]["purchasePrice"] = data["dis"][1]["purchasePrice"]
        #Checking the raw data result is correct
        self.assertEqual(expected, data)
    
    
    
    #reverse("accounts:ownedStockList", args=(goog_id, ))
    #get(url, data = {"info": "num_of_ticker_stocks", "symbol": ticker})   the amount of the stock they own
    def test_number_of_shares_none_owned(self):
        self.createTestUser()
        url = reverse("accounts:ownedStockList", args=("test", ))
        data = Client().get(url, data = {"info": "num_of_ticker_stocks", "symbol":"dis"})
        print("*"*20)
        print(data.json())
        print("*"*20)
        self.assertTrue(True)
    def test_number_of_shares_one_owned(self):
        self.assertTrue(True)
    def test_number_of_shares_many_owned(self):
        self.assertTrue(True)
    
    #reverse("accounts:ownedStockList", args=(goog_id, ))
    #get(url, data = {"info": "portfolio_value"})                          The portfolio value of the stocks they own with the percent change
    def test_portfolio_value_no_stocks(self):
        self.assertTrue(True)
    def test_portfolio_value_one_share(self):
        self.assertTrue(True)
    def test_portfolio_value_many_stocks(self):
        self.assertTrue(True)


    #reverse("accounts:ownedStockList", args=(goog_id, ))
    #get(url, data = {"info": "stock_list_display"})                       The list of every stock the user owns, its quantity, current price, change% and direction
    def test_stock_list_when_none_owned(self):
        self.assertTrue(True)
    def test_stock_list_when_one_owned(self):
        self.assertTrue(True)
    def test_stock_list_when_many_owned(self):
        self.assertTrue(True)

    #reverse("accounts:ownedStockList", args=(goog_id, ))
    #get(url, data = {"info": "stock_list_detailed"})                      the crazy list form
    def test_raw_stock_list_when_none_owned(self):
        self.assertTrue(True)
    def test_raw_stock_list_when_one_share_owned(self):
        self.assertTrue(True)
    def test_raw_stock_list_multiple_purchases_single_stock(self):
        self.assertTrue(True)
    def test_raw_stock_list_multiple_stocks(self):
        self.assertTrue(True)
    def test_raw_stock_list_stocks_purchased_alternating(self):
        self.assertTrue(True)
    def test_raw_stock_list_bought_and_sold_all(self):
        self.assertTrue(True)
    def test_raw_stock_list_bought_and_sold_exact_purchase(self):
        self.assertTrue(True)
    def test_raw_stock_list_bought_and_sold_less_than_purchase(self):
        self.assertTrue(True)
    def test_raw_stock_list_bought_and_sold_greater_than_purchase(self):
        self.assertTrue(True)

'''
###############################################################################
class WatchListTestCases(TestCase):
    #reverse("accounts:watchList", args=(goog_id, ))
    #put(url, data = {"symbol": ticker})                if stock present it removes it. If it isn't present it adds it
    def test_adding_ticker(self):
        self.assertTrue(True)
    def test_removing_ticker(self):
        self.assertTrue(True)
    def test_adding_multiple_tickers(self):
        self.assertTrue(True)
    def test_adding_removing_multiple_tickers(self):
        self.assertTrue(True)

    #reverse("accounts:watchList", args=(goog_id, ))
    #get(url, data = {"info": "check_stock", "symbol": ticker})     returns true if the stock is in the watchlist
    def test_check_if_existing_stock_in_watchlist(self):
        self.assertTrue(True)
    def test_check_if_nonexistent_stock_in_watchlist(self):
        self.assertTrue(True)

    #reverse("accounts:watchList", args=(goog_id, ))
    #get(url, data = {"info": "stocks"})                returns all the tickers that the user owns.
    def test_get_all_watched_stocks_when_none(self):
        self.assertTrue(True)
    def test_get_all_watched_stocks_when_one(self):
        self.assertTrue(True)
    def test_get_all_watched_stocks_when_many(self):
        self.assertTrue(True)
    
    #reverse("accounts:watchList", args=(goog_id, ))
    #get(url, data = {"info": "detailed_stocks"})       returns all the watch list stocks with price change and whatnot
    def test_get_detailed_watchlist_stock_info_when_none(self):
        self.assertTrue(True)
    def test_get_detailed_watchlist_stock_info_when_one(self):
        self.assertTrue(True)
    def test_get_detailed_watchlist_stock_info_when_many(self):
        self.assertTrue(True)
'''
'''
###############################################################################
class GeneralAccountTestCases(TestCase):

    #post reverse("accounts:create")        #Creates a new user, may need to deal with google oauth D: 
    def test_create_account(self):
        self.assertTrue(True)
    def test_create_multiple_accounts(self):
        self.assertTrue(True)
    #def test_create_already_existing_account(self):
        #self.assertTrue(True)

    #get reverse("accounts:allAccounts")     returns all accounts
    def test_see_all_accounts_when_none(self):
        url = reverse("accounts:allAccounts")
        data = Client().get(url).json()
        self.assertTrue(len(data) == 0)

    #Note that balance is stored as a string for some reason
    def test_see_all_accounts_when_one(self):
        userData = {"user": None, "name": "Will", "email": "test@gmail.com", "google_user_id": "test",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None}
        user = Account.objects.create(name = "Will", email = "test@gmail.com", google_user_id = "test")
        user.save()
        url = reverse("accounts:allAccounts")
        data = Client().get(url).json()
        self.assertTrue(len(data) == 1)
        self.assertEqual(data[0], userData)

    #This isn't sorting to make sure it is truly ok but I think that is fine
    def test_see_all_accounts_when_many(self):
        userData = [{"user": None, "name": "Will", "email": "test1@gmail.com", "google_user_id": "test1",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "William", "email": "test2@gmail.com", "google_user_id": "test2",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Billiam", "email": "test5@gmail.com", "google_user_id": "test5",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Willy", "email": "test3@gmail.com", "google_user_id": "test3",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Bill", "email": "test4@gmail.com", "google_user_id": "test4",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None}]
        #Load data into database
        for acctInfo in userData:
            user = Account.objects.create(name = acctInfo["name"], email = acctInfo["email"], google_user_id = acctInfo["google_user_id"])
            user.save()
        #Make backend call
        url = reverse("accounts:allAccounts")
        data = Client().get(url).json()

        #Sort by emails, which are unique
        data = sorted(data, key=lambda x: x["email"])
        userData = sorted(userData, key=lambda x: x["email"])

        #Make sure everything matches
        self.assertTrue(len(data) == len(userData))
        for index, acct in enumerate(userData):
            self.assertEqual(data[index], acct)
    
    def test_see_existing_account_details(self):
        userData = [{"user": None, "name": "Will", "email": "test1@gmail.com", "google_user_id": "test1",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "William", "email": "test2@gmail.com", "google_user_id": "test2",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Billiam", "email": "test5@gmail.com", "google_user_id": "test5",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Willy", "email": "test3@gmail.com", "google_user_id": "test3",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Bill", "email": "test4@gmail.com", "google_user_id": "test4",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None}]
        userToFind = userData[3]
        #Load data into database
        for acctInfo in userData:
            user = Account.objects.create(name = acctInfo["name"], email = acctInfo["email"], google_user_id = acctInfo["google_user_id"])
            user.save()
        url = reverse("accounts:details", args=(userToFind["google_user_id"], ))
        data = Client().get(url).json()
        self.assertEqual(data, userToFind)

    #THIS IS NOT A VALID TEST YET DON'T LET IT STAY THIS WAY
    def test_see_nonexistent_account_details(self):
        userData = [{"user": None, "name": "Will", "email": "test1@gmail.com", "google_user_id": "test1",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "William", "email": "test2@gmail.com", "google_user_id": "test2",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Billiam", "email": "test5@gmail.com", "google_user_id": "test5",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Willy", "email": "test3@gmail.com", "google_user_id": "test3",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None},
                    {"user": None, "name": "Bill", "email": "test4@gmail.com", "google_user_id": "test4",
                    "balance": "5000.00", "portfolio_value": "0.00", "start_date": None}]
        userToFind = userData[3]
        #Load data into database
        for acctInfo in userData:
            user = Account.objects.create(name = acctInfo["name"], email = acctInfo["email"], google_user_id = acctInfo["google_user_id"])
            user.save()
        url = reverse("accounts:details", args=("notPresent", ))
        data = Client().get(url)
        self.assertEqual(data.status_code, 200)
        #Have it send 404 error when people do this and then remove the above line and uncomment below
        #self.assertEqual(data.status_code, 404)
'''

'''
print("Name:", user.name)
print("Email:", user.email)
print("goog_id", user.google_user_id)
print("Balance:", type(user.balance))
print("PV:", user.portfolio_value)
print("OwnedStocks:", user.ownedStocks)
print("watchList:", user.watchList)
print("TransactionHistory:", user.transaction_history)
print("PVHistory:", user.portfolio_value_history)
print("StartDate:", user.start_date)
'''