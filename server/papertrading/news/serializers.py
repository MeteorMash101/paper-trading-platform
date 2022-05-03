from rest_framework import serializers
from . import models

class NewsSerializer(serializers.Serializer):
    headline = serializers.CharField(max_length=250)
    image = serializers.CharField(max_length=250)
    summary = serializers.CharField(max_length=500)
    url = serializers.CharField(max_length=250)
    datetime = serializers.DateTimeField()