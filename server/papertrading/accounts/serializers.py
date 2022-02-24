# We need serializers to convert model instances to JSON 
# so that the frontend can work with the received data.

from rest_framework import serializers
from . import models

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Account
        fields = ('user', 'name', 'email', 'google_user_id', 'balance', 'portfolio_value') # fields to be converted to JSON