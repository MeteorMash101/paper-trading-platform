from django.urls import path
from news.views import *
from . import views

app_name = "news"
urlpatterns = [
    # STOCKS URLS:
    
    path("", GeneralNews.as_view(), name = "generalNews"),
    
]