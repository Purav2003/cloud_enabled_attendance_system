# Generated by Django 5.0.1 on 2024-01-27 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_rename_demo_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(default='null', max_length=100),
            preserve_default=False,
        ),
    ]
