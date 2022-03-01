# Create your views here.
from django.http import HttpResponse
from orders.models import Order
from orders.serializers import OrderSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class OrdersList(APIView):
    """
    List all orders (transaction history) for specific user
    """
    def get(self, request):
        # Get user

        # Get user's orders
        return "die"
        

class OrdersDetail(APIView):
    """
    Update a user's account balance.
    """
    def put(self, request, pk):
        # Get user

        # Parse req.

        # Update user's balance (buying power)

        # Update transaction history

        return "die"

# class AccountBalance(APIView):
#     """
#     Update an Account's buying power.
#     """
#     def put(self, request, pk):
#         Account = self.get_object(pk)
#         print("AMOUNT SENT IN BP PUT: ", request.data['amount'], type(request.data['amount']))
#         serializer = AccountSerializer(Account, data=request.data)
#         # if serializer.is_valid():
#         #     serializer.save()
#         #     return Response(serializer.data)
#         return Response(None)
