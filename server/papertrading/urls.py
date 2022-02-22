"""papertrading URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from stocks.views import StockList, StockDetail, StockHistData, TopStocks, LivePrice, CompanyEarnings
from accounts.views import AccountList, AccountDetail
# from accounts.views import GoogleLogin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('stocks/', TopStocks.as_view()),
    path('stocks/<str:ticker>/', StockDetail.as_view()), # For single stock page
    path("stocks/hist/<ticker>/", StockHistData.as_view()), #Called for specifically historical data
                                                            #since only need that once per showing of graph
    path("stocks/getPrice/<ticker>/", LivePrice.as_view()),
    path("stocks/quarterlyEarnings/<ticker>/", CompanyEarnings.as_view()),
    path('accounts/', AccountList.as_view()),
    path('accounts/<str:pk>/', AccountDetail.as_view()),
    # path('rest-auth/google/', GoogleLogin.as_view(), name='google_login')
    path('auth/', include('drf_social_oauth2.urls', namespace='drf'))
]