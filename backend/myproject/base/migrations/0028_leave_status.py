# Generated by Django 5.0.1 on 2024-02-15 07:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0027_leave_leave_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='leave',
            name='status',
            field=models.BooleanField(default=False),
        ),
    ]
