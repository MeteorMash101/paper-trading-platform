# This configuration boilerplate allows us to manipulate models...
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'papertrading.settings')

import django
django.setup()

# --STOCK DATA SCRIPT--
# Run this script to create all the stock listings and/or update them.
# Recommended to clear stock db table first, if possible.

import requests
from pprint import pprint
from stocks.models import Stock

def populate():
    # stock data we are using (by symbol):
    # NOTE: max symbols allowed is 10, may need to add parsing method later if we add more.
    stocks = ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA", "FB", "NFLX", "NVDA", "BAC", "PFE", "INTC", "VFC", "CAT"]
    # stocks = ["MSFT", "CAT"] # just for testing (to save calls), one good stock, one bad stock...
    stockData = []
    fetchStockInfo(stocks, stockData)
    print("Stock Data Retrieved: ", stockData)
    saveToDB(stockData)
    return

def fetchStockInfo(stocks, stockData):
    # CURRENT API SOURCE: Yahoo Finance - https://www.yahoofinanceapi.com/
    URL = "https://yfapi.net/v6/finance/quote"
    HEADERS = {
        'x-api-key': "3omQgh3gOq71NwtZsrfEG5ewJ11XmlHA5MG7MOG0" # EDIT: use process.env var here...
    }
    for stock in stocks:
        QUERYSTRING = {"symbols" : stock}
        response = requests.request("GET", URL, headers=HEADERS, params=QUERYSTRING)
        # pprint(stock, response.json()['quoteResponse']['result'][0])
        stockData.append(extractData(response.json()['quoteResponse']['result'][0]))
    return stockData

def saveToDB(stockData):
    # EDIT: delete all stocks first, for now. Otherwise ran into 'unique' errors.
    Stock.objects.all().delete()
    for stock in stockData:
        Stock.objects.update_or_create(**stock) # creates & saves model w/ dict input.
        print("Saved stock:", stock['company_name'], "in db")
    return

# extract only relevant Stock Model info.
def extractData(res):
    relevantData = {}
    relevantData["company_name"] = res['displayName']
    relevantData["symbol"] = res['symbol']
    relevantData["price"] = res['ask'] # EDIT: confirm?
    relevantData["percent_change"] = res['regularMarketChangePercent']
    relevantData["change_direction"] = False if res['regularMarketChangePercent'] < 0 else True # False -> Neg., True -> Pos.
    relevantData["market_cap"] = res['marketCap']
    relevantData["pe_ratio"] = res['forwardPE'] # EDIT: confirm?
    relevantData["dividend_yield"] = 0.0000 # EDIT: temp, not found
    relevantData["average_volume"] = res['averageDailyVolume10Day']
    relevantData["volume"] = res['regularMarketVolume']
    relevantData["high_today"] = res['regularMarketDayHigh']
    relevantData["low_today"] = res['regularMarketDayLow']
    relevantData["ft_week_high"] = res['fiftyTwoWeekHigh']
    relevantData["ft_week_low"] = res['fiftyTwoWeekLow']
    relevantData["revenue"] = 0.0000 # EDIT: temp, not found
    return relevantData


if __name__ == "__main__":
    print("populating script!")
    populate()
    print("populating complete.")
