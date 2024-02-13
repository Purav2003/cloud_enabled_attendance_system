from django.urls import path
from . import views
from . import view
urlpatterns = [
    path('api/all/<int:pk>',views.getData),
    path('api/access/<int:pk>',views.access),
    path('api/deny/<int:pk>',views.deny),
    path('api/checkOtp/<str:pk>',views.checkOtp),
    path('api/signup/',views.signup),
    path('api/faceMatch/',views.match_face),
    path('api/admin/signup',views.adminSignup),
    path('api/admin/login',views.adminLogin),
    path('api/login/',views.login),
    path('api/del/<int:pk>',views.delUser),
    path('api/user/<int:pk>',views.customer_record),
    path('api/approved/<int:pk>',views.customer_record_approved),
    path('api/rejected/<int:pk>',views.customer_record_rejected),
    path('api/pending/<int:pk>',views.customer_record_pending),
    path('api/update/<int:pk>',views.updateUser),
    path('api/attendance/<int:pk>',views.get_attendance),
    path('api/allAttendance/<int:pk>',views.all_attendance),
    path('api/lastFiveDaysAttendance/<int:pk>',view.last_5_days_attendance),
    path('api/dayAttendance/<int:pk>/<str:dk>',views.date_attendance),
    path('api/absent/<int:pk>',view.date_absent),
]

