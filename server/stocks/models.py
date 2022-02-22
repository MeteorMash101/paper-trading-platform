# Create your models here.

from django.db import models
from accounts.models import Account

class Stock(models.Model):
    company_name = models.CharField(max_length=50, unique=True)
    symbol = models.CharField(max_length=5, unique=True)
    MAX_DIGITS = 30 # EDIT: change this value later...
    price = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    percent_change = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    change_direction = models.BooleanField() # True => + change, False => - change
    market_cap = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    pe_ratio = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    dividend_yield = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    average_volume = models.IntegerField()
    volume = models.IntegerField()
    high_today = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    low_today = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    # ft == "fifty two"
    ft_week_high = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    ft_week_low = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    revenue = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2)
    # many to one relationship: "One user has many stocks", etc.
    # stock_owners = models.ForeignKey(Account, on_delete=models.DO_NOTHING, related_name='stock_owners') 
    # stock_watchers = models.ForeignKey(Account, on_delete=models.DO_NOTHING, related_name='stock_watchers')

    def __str__(self):
        return self.company_name