from django.urls import path
from accounts.views import *
from . import views

app_name = "accounts"
urlpatterns = [
    #ACCOUNTS URLS:
    path("", AccountList.as_view(), name = "allAccounts"),
    path('<str:goog_id>/', AccountDetail.as_view(), name = "details"),
    path('new/', AccountDetail.as_view(), name = "create"),
    # path('accounts/balance/', AccountBalance.as_view()),
    # '/stocklist', 'watchlist', '/portval'
    path('<str:goog_id>/getStocks/', AccountStocksOwned.as_view(), name = "ownedStockList"),
    path('<str:goog_id>/watchList/', AccountWatchList.as_view(), name = "watchList"),
    path('<str:goog_id>/transactionHistory/', AccountTransactionHistory.as_view(), name = "transactionHistory"),
    path('<str:goog_id>/historicPV/', AccountHistoricPV.as_view(), name = "pvHistory"),
    path('<str:goog_id>/reset/', AccountReset.as_view(), name = "reset"),
]
