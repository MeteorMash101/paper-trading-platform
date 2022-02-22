# Create your views here.
from accounts.models import Account
from accounts.serializers import AccountSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class AccountList(APIView):
    """
    List all accounts, or create a new Account.
    """
    def get(self, request):
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountDetail(APIView):
    """
    Retrieve, update or delete a Account instance.
    """
    def get_object(self, pk):
        try:
            return Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        Account = self.get_object(pk)
        serializer = AccountSerializer(Account)
        return Response(serializer.data)

    def put(self, request, pk):
        Account = self.get_object(pk)
        serializer = AccountSerializer(Account, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        Account = self.get_object(pk)
        Account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)