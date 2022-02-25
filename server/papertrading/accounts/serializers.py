# We need serializers to convert model instances to JSON 
# so that the frontend can work with the received data.

from rest_framework import serializers
from . import models

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Account
        fields = ('user', 'name', 'email', 'google_user_id', 'balance', 'portfolio_value') # fields to be converted to JSON


class StockListSerializer(serializers.Serializer):
    stock_list = serializers.JSONField()

class StockNumSerializer(serializers.Serializer):
    quantity_owned = serializers.IntegerField()

class PortfolioValueSerializer(serializers.Serializer):
    portfolio_value = serializers.DecimalField(max_digits=30, decimal_places=2)
