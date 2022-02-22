# Create your views here.
# NOTE: got rid of format=none param
# Source: https://www.django-rest-framework.org/tutorial/3-class-based-views/

from stocks.models import Stock
from stocks.serializers import StockSerializer, HistSerializer, ShortSerializer, LivePriceSerializer, EarningsSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stocks.financeAPI import stock_info as si

class StockList(APIView):
    """
    List all stocks, or create a new stock.
    """
    def get(self, request):
        stocks = Stock.objects.all()
        serializer = StockSerializer(stocks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StockSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''For historical data for the specific stock'''
class StockHistData(APIView):
    def get(self, request, ticker):
        jsonData = si.get_stock_historical_data(ticker)
        results = HistSerializer(jsonData).data
        return Response(results)

'''For the specific stock page general updating info'''
class StockDetail(APIView):
    '''
    Requests to /stocks/ticker will go here and return this data
    '''
    def get(self, request, ticker):
        jsonData = si.get_full_stock_stats(ticker)
        results = StockSerializer(jsonData).data
        return Response(results)

class TopStocks(APIView):
    def get(self, request):
        stocks = si.get_top_stocks()
        serializer = ShortSerializer(stocks, many=True)
        return Response(serializer.data)

class LivePrice(APIView):
    def get(self, request, ticker):
        return Response(LivePriceSerializer({"live_price": si.get_live_price(ticker)}).data)

class CompanyEarnings(APIView):
    def get(self, request, ticker):
        jsonData = si.getEarningsReport(ticker)
        serializer = EarningsSerializer(jsonData).data
        return Response(serializer)



'''
Ok we need to error check everything::
The get_quote_data isn't guaranteed to have all the keys
Hence everyone should be given alternative and if push comes to shove nothing
'''