from django.urls import path
from stocks.views import *
from . import views

app_name = "stocks"
urlpatterns = [
    # STOCKS URLS:
    path("", TopStocks.as_view(), name = "topStocks"),
    path('popular/', PopularStocks.as_view(), name = "popularStocks"),
    path("searchableStocks/", SearchBar.as_view(), name = "search"),
    path("generalNews/", GeneralNews.as_view(), name = "generalNews"),
    # For single stock page
    path('<str:ticker>/', StockDetail.as_view(), name = "stockDetails"), 
    # Called for specifically historical data since only need that once per showing of graph
    path("hist/<ticker>/", StockHistData.as_view(), name = "historicalData"),
    path("getPrice/<ticker>/", LivePrice.as_view(), name = "livePrice"),
    path("quarterlyEarnings/<ticker>/", CompanyEarnings.as_view(), name = "quarterlyEarnings"),
    
]