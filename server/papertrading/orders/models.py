# Create your models here.

from django.db import models
# from accounts.models import Account
import jsonfield

class Order(models.Model):
    # user = models.OneToOneField(Account, on_delete=models.DO_NOTHING, null=True) # ref. to user Account.
    transaction_history = jsonfield.JSONField()

