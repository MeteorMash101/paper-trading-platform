from django.urls import path

from orders.views import OrdersList, OrdersDetail

urlpatterns = [
    path('<str:user_id>/', OrdersList.as_view()),
    path('new/', OrdersDetail.as_view()),
]