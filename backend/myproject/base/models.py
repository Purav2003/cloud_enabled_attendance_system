
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
    profilePhoto = models.ImageField(upload_to='user_images/', null=True, blank=True)
    isAuthorized = models.BooleanField(default=False)
    def __str__(self):
        return(f"{self.email}")
