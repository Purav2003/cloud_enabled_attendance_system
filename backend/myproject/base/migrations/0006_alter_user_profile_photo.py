# Generated by Django 5.0.1 on 2024-01-27 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_delete_record_user_profile_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_photo',
            field=models.FileField(blank=True, null=True, upload_to='profile_photos/'),
        ),
    ]
