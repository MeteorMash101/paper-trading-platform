# We need serializers to convert model instances to JSON 
# so that the frontend can work with the received data.

from rest_framework import serializers
from . import models

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Account
        fields = ('user', 'name', 'email', 'google_user_id', 'balance', 'portfolio_value', "start_date") # fields to be converted to JSON


class StockListSerializer(serializers.Serializer):
    stock_list = serializers.JSONField()

class StockNumSerializer(serializers.Serializer):
    quantity_owned = serializers.IntegerField()

class PortfolioValueSerializer(serializers.Serializer):
    portfolio_value = serializers.DecimalField(max_digits=30, decimal_places=2)
    percent_change = serializers.DecimalField(max_digits=30, decimal_places=2)
    change_direction = serializers.BooleanField() # True => + change, False => - change

class TransactionHistorySerializer(serializers.Serializer):
    transaction_history = serializers.JSONField()

class BoolSerializer(serializers.Serializer):
    isPresent = serializers.BooleanField()

class HistoricPortfolioValueSerializer(serializers.Serializer):
    pv = serializers.JSONField()
