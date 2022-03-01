# SOURCE: https://www.django-rest-framework.org/tutorial/3-class-based-views/
# Create your views here.
from accounts.models import Account
from accounts.serializers import AccountSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User # we are extending Django's User

class AccountList(APIView):
    """
    List all accounts, or create a new Account.
    """
    def get(self, request):
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

class AccountDetail(APIView):
    """
    Create, retrieve, update or delete a Account instance.
    """
    def post(self, request, *args, **kwargs):
        print("IN POST AccountDetail...w/ data:", request.data)
        # EDIT: need way to add User's pk to req. data to map this Account -> User.
        # tried: User.objects.get(email=request.data['email']), request.data['email'].split('@')[0]
        # request.data['user'] = ?
        # print("UPDATED REQ. DATA", request.data)
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # saves to DB
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("ERROR: ",serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self, request, *args, **kwargs):
        print("IN GETOBJ...")
        pk = self.kwargs.get('pk')
        try:
            return Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return None

    def get(self, request, pk):
        print("IN GET...w/ pk:", pk)
        AccountObj = self.get_object(pk)
        if AccountObj != None: # account exists
            serializer = AccountSerializer(AccountObj)
            return Response(serializer.data)
        else: # account doesn't exist, create new
            print("Account not found, sending None...")
            return Response(None)

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