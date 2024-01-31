from django.urls import path
from . import views

urlpatterns = [
    path('api/all/<int:pk>',views.getData),
    path('api/access/<int:pk>',views.access),
    path('api/deny/<int:pk>',views.deny),
    path('api/checkOtp/<str:pk>',views.checkOtp),
    path('api/signup/',views.signup),
    # path('api/faceMatch/',views.match_face),
    path('api/admin/signup',views.adminSignup),
    path('api/admin/login',views.adminLogin),
    path('api/login/',views.login),
    path('api/del/<int:pk>',views.delUser),
    path('api/user/<int:pk>',views.customer_record),
    path('api/update/<int:pk>',views.updateItem),
]


