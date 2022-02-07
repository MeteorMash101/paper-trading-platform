# We need serializers to convert model instances to JSON 
# so that the frontend can work with the received data.

from rest_framework import serializers
from . import models

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Stock
        fields = ('id', 'symbol', 'company_name', 'price', 'percent_change', 'change_direction', 'market_cap', 'pe_ratio', 'dividend_yield', 'average_volume', 'volume', 'high_today', 'low_today', 'ft_week_high', 'ft_week_low', 'revenue') # fields to be converted to JSON