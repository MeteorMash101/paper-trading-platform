# We need serializers to convert model instances to JSON 
# so that the frontend can work with the received data.

from rest_framework import serializers
from . import models

# class StockSerializer(serializers.ModelSerializer):
    # class Meta:
        # model = models.Stock
        # fields = ('id', 'symbol', 'company_name', 'price', 'percent_change', 'change_direction', 'market_cap', 'pe_ratio', 'dividend_yield', 'average_volume', 'volume', 'high_today', 'low_today', 'ft_week_high', 'ft_week_low', 'revenue') # fields to be converted to JSON
# EDIT: vvvreduce this to one field like above^^^

class StockSerializer(serializers.Serializer):
    """Your data serializer, define your fields here."""
    company_name = serializers.CharField(max_length=50)
    symbol = serializers.CharField(max_length=5)
    MAX_DIGITS = 30 # EDIT: change this value later...
    price = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    percent_change = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    change_direction = serializers.BooleanField() # True => + change, False => - change
    market_cap = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    pe_ratio = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    dividend_yield = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    average_volume = serializers.IntegerField()
    volume = serializers.IntegerField()
    high_today = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    low_today = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    # ft == "fifty two"
    ft_week_high = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    ft_week_low = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    revenue = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)

#All available fields
#https://www.geeksforgeeks.org/serializers-django-rest-framework/
class HistSerializer(serializers.Serializer):
    historical_data = serializers.ListField()

class LivePriceSerializer(serializers.Serializer):
    MAX_DIGITS = 30
    live_price = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places = 2)

class EarningsSerializer(serializers.Serializer):
    quarterly_earnings = serializers.ListField()

class ShortSerializer(serializers.Serializer):
    """Your data serializer, define your fields here."""
    company_name = serializers.CharField(max_length=50)
    symbol = serializers.CharField(max_length=5)
    MAX_DIGITS = 30 # EDIT: change this value later...
    price = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    percent_change = serializers.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    change_direction = serializers.BooleanField() # True => + change, False => - change

class searchSerializer(serializers.Serializer):
    company_name = serializers.CharField(max_length=50)
    symbol = serializers.CharField(max_length=6)
