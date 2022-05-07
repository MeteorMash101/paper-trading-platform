from django.shortcuts import render
import finnhub
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from news.serializers import *
from datetime import datetime
import pandas as pd


# Create your views here.
class GeneralNews(APIView):
    #This will return general news, not even necessarily relating to a specific company
    def get(self, request):
        useful = set(["datetime", "headline", "image", "summary", "url"])
        fin = finnhub.Client(api_key="c7np72iad3ifj5l0i6eg").general_news("general")
        #fin = finnhub.Client(api_key="c9o7gs2ad3i930olbhm0").general_news("general")
        df = pd.DataFrame.from_dict(fin)
        unnecessary = set(df.columns) - useful
        df = df.drop(columns = unnecessary)
        df['datetime'] = df['datetime'].apply(lambda x: datetime.fromtimestamp(x))
        serializer = NewsSerializer(df.to_dict("records"), many=True)
        return Response(serializer.data)