# Generated by Django 5.0.1 on 2024-01-27 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_record_remove_user_name_remove_user_profile_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(default='null', max_length=50),
            preserve_default=False,
        ),
    ]
