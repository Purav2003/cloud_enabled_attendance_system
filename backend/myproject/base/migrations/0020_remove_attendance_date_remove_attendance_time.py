# Generated by Django 5.0.1 on 2024-02-06 07:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0019_attendance_time_alter_attendance_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attendance',
            name='date',
        ),
        migrations.RemoveField(
            model_name='attendance',
            name='time',
        ),
    ]