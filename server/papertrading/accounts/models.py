# Create your models here.
# SOURCE: https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html#onetoone

from django.db import models
from django.contrib.auth.models import User # we are extending Django's User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Account(models.Model):
    # EDIT: need to find unique field in User to connect with this model instance...
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True) # ref. to original User auth info.
    name = models.CharField(max_length=50, null=True)
    email = models.CharField(max_length=50, unique=True, null=True) # EDIT: add unique later
    google_user_id = models.CharField(max_length=50, unique=True, primary_key=True) # EDIT: just google ID for now...
    MAX_DIGITS = 10000000000000 # EDIT: temp?
    # balance == 'buying power'
    balance = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2, default=5000.00)
    portfolio_value = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=2, default=0.00)
    ownedStocks = models.JSONField(null=True)
    
    def __str__(self):
        return self.google_user_id

# class Order(models.Model):

    # EDIT: For later?
    # friends, ranking, STATS, isActive, LastLoginDate:, etc.

    # signals so our Account model will be automatically created/updated when we create/update User instances.
    # @receiver(post_save, sender=User)
    # def create_user_profile(sender, instance, created, **kwargs):
    #     if created:
    #         Account.objects.create(user=instance)

    # @receiver(post_save, sender=User)
    # def save_user_profile(sender, instance, **kwargs):
    #     instance.Account.save()