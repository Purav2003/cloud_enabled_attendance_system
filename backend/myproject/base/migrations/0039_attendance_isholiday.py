# Generated by Django 5.0.2 on 2024-02-28 16:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0038_alter_holiday_dates'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendance',
            name='isHoliday',
            field=models.BooleanField(default=False),
        ),
    ]
