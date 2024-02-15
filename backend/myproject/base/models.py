
from django.db import models
from django.contrib.auth.models import AbstractUser

class Admin(models.Model):
    name = models.CharField(max_length=50 )
    email = models.CharField(max_length=100 ) 
    mobile = models.CharField(max_length=15 )     
    password = models.CharField(max_length=100 ) 
    companyCode = models.CharField(max_length=20 )
    companyName = models.CharField(max_length=50 )


class User(models.Model):
    name = models.CharField(max_length=50 )
    email = models.CharField(max_length=100 ) 
    mobile = models.CharField(max_length=15 )     
    password = models.CharField(max_length=100 ) 
    companyCode = models.CharField(max_length=20 )
    department = models.CharField(max_length=20 )
    profilePhoto = models.ImageField(upload_to='user_images/', null=True, blank=True)
    isAuthorized = models.CharField(default=False,max_length=100)
    otp = models.IntegerField( null=True, blank=True)
    def __str__(self):
        return(f"{self.email}")


class Attendance(models.Model):
    user_id = models.CharField(max_length=50)
    user = models.CharField(max_length=50)
    date = models.DateField()
    time = models.TimeField( auto_now_add=True)
    attendance = models.BooleanField(default=False)
    companyCode = models.CharField(max_length=20)
    onLeave = models.BooleanField(default=False)
    def __str__(self):
        return(f"{self.attendance} {self.user_id} {self.date} {self.time}")

class Leave(models.Model):
    user_id = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    leave_type = models.CharField(max_length=100)
    reason = models.CharField(max_length=100)
    status = models.CharField(default="Pending",max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return(f"{self.user_id} {self.start_date} {self.end_date} {self.reason}")