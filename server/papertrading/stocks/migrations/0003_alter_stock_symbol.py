# Generated by Django 3.2.5 on 2022-01-30 07:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0002_auto_20220130_0738'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock',
            name='symbol',
            field=models.CharField(max_length=5),
        ),
    ]
