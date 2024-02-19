from django.core.files.storage import FileSystemStorage
from datetime import date
from collections import defaultdict
from datetime import datetime, timedelta
from base.models import Attendance,Leave,User
from rest_framework.response import Response    
from rest_framework.decorators import api_view
from datetime import datetime
from .serializers import UserSerializer,LeaveSerializer,AttendanceSerializer
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
 

@api_view(['POST'])
def get_attendance(request, pk):
    year = int(request.data.get('year'))
    month = int(request.data.get('month'))
    
    first_day_of_month = datetime(year, month, 1).date()
    if month == 12:
        last_day_of_month = datetime(year + 1, 1, 1).date()
    else:
        last_day_of_month = datetime(year, month + 1, 1).date() - timedelta(days=1)

    items = Attendance.objects.filter(user_id=pk, date__range=[first_day_of_month, last_day_of_month])

    # Serialize the data
    if items:
        serializer = AttendanceSerializer(items, many=True)
        return Response(serializer.data)
    else:
        return Response({'status': 'error', 'message': 'No attendance records found'}, status=status.HTTP_404_NOT_FOUND)
 
 
@api_view(['GET'])
def last_5_days_attendance(request,pk):
    today = datetime.now().date()
    five_days_ago = today - timedelta(days=6)
    yeterday = today - timedelta(days=1)
    # Query attendance records for the company within the date range
    attendance_records = Attendance.objects.filter(companyCode=pk, date__range=[five_days_ago, yeterday])
    
    # Initialize a defaultdict to store attendance counts for each day
    attendance_counts = defaultdict(lambda: {'date': '', 'total_users': 0, 'present_users': 0})
    
    # Iterate over attendance records and accumulate counts
    for record in attendance_records:
        attendance_date = record.date.strftime('%Y-%m-%d')
        attendance_counts[attendance_date]['date'] = attendance_date
        attendance_counts[attendance_date]['total_users'] += 1
        if record.attendance:
            attendance_counts[attendance_date]['present_users'] += 1
    
    # Calculate the percentage of attendance for each day
    for date, counts in attendance_counts.items():
        total_employees = counts['total_users']
        present_employees = counts['present_users']
        if total_employees > 0:
            percentage = (present_employees / total_employees) * 100
        else:
            percentage = 0
        counts['percentage_present'] = percentage
    
    # Convert the defaultdict to a list of dictionaries
    attendance_list = [counts for date, counts in attendance_counts.items()]
    
    # Return the attendance counts with date in JSON format
    return Response({'data': attendance_list})



@api_view(['GET'])
def date_absent(request,pk):
    items = Attendance.objects.filter(user_id=pk,attendance=False, onLeave=False)
    serializer = AttendanceSerializer(items,many=True)
    dates = [item['date'] for item in serializer.data]
    return Response(dates)

@api_view(['GET'])
def date_leave(request,pk):
    items = Attendance.objects.filter(user_id=pk, onLeave=True)
    serializer = AttendanceSerializer(items,many=True)    
    dates = [item['date'] for item in serializer.data]
    return Response(dates)




@api_view(['GET'])
def leave_remaining(request, pk):
    leave_counts = {
        'Sick Leave': 7,
        'Casual Leave': 7,
        'Privileged Leave': 3,
        'Paternity Leave': 15
    }

    # Initialize dictionary to store used leave counts
    used_leave_counts = {leave_type: 0 for leave_type in leave_counts}

    # Get today's date
    today = timezone.now().date()

    # Iterate over leave entries for the user
    user_leave_entries = Leave.objects.filter(user_id=pk, status="Leave Granted")
    for leave_entry in user_leave_entries:
        leave_type = leave_entry.leave_type
        start_date = leave_entry.start_date
        end_date = leave_entry.end_date

        # Calculate the total number of days for this leave entry
        total_days = (end_date - start_date).days + 1  # Adding 1 to include both start and end dates

        # Update the used leave counts for this leave type
        used_leave_counts[leave_type] += total_days

    # Calculate remaining leave counts
    remaining_counts = {leave_type: leave_counts[leave_type] - used_leave_counts.get(leave_type, 0) for leave_type in leave_counts}

    response_data = {
        'Sick Leave': {
            'total': leave_counts['Sick Leave'],
            'remaining': remaining_counts['Sick Leave']
        },
        'Casual Leave': {
            'total': leave_counts['Casual Leave'],
            'remaining': remaining_counts['Casual Leave']
        },
        'Privileged Leave': {
            'total': leave_counts['Privileged Leave'],
            'remaining': remaining_counts['Privileged Leave']
        },
        'Paternity Leave': {
            'total': leave_counts['Paternity Leave'],
            'remaining': remaining_counts['Paternity Leave']
        }
    }

    return Response(response_data)


@api_view(['POST'])
def leave_application(request):
    serializer = LeaveSerializer(data=request.data)
    if serializer.is_valid():    
        serializer.save()
        return Response({'status': 'success', 'message': 'Leave Applied successfully'}, status=status.HTTP_201_CREATED)      
    return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)
        
    

@api_view(['GET'])
def leave_user(request, pk):
    current_month = datetime.now().month
    current_year = datetime.now().year
    items = Leave.objects.filter(user_id=pk, timestamp__month=current_month, timestamp__year=current_year)
    serializer = LeaveSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def leave_user_pending(request,pk):
    current_month = datetime.now().month
    current_year = datetime.now().year
    items = Leave.objects.filter(status="Pending",companyCode = pk ,timestamp__month=current_month, timestamp__year=current_year)
    serializer = LeaveSerializer(items, many=True)  
    for leave_data in serializer.data:
        user_id = leave_data['user_id']
        user = User.objects.get(id=user_id)  
        leave_data['user_name'] = user.name  
      
    return Response(serializer.data)

@api_view(['GET'])
def leave_user_approved(request,pk):
    current_month = datetime.now().month
    current_year = datetime.now().year
    items = Leave.objects.filter(status="Leave Granted", companyCode = pk, timestamp__month=current_month, timestamp__year=current_year)
    serializer = LeaveSerializer(items, many=True)  
    for leave_data in serializer.data:
        user_id = leave_data['user_id']
        user = User.objects.get(id=user_id)  
        leave_data['user_name'] = user.name  
      
    return Response(serializer.data)

@api_view(['GET'])
def leave_status_update_approve(request, pk):
    try:
        leave = get_object_or_404(Leave, id=pk)
    except Leave.DoesNotExist:
        return Response({'status': 'error', 'message': 'Leave not found'}, status=status.HTTP_404_NOT_FOUND)
    
    leave.status = "Leave Granted"
    leave.save()    
    
    start_date = leave.start_date
    end_date = leave.end_date
    user_id = leave.user_id
    user = get_object_or_404(User, id=user_id)
    name = user.name
    company_code = user.companyCode 
    print(start_date)
    
    for current_date in range((end_date - start_date).days + 1):
        current_date = start_date + timedelta(days=current_date)
        
        attendance, created = Attendance.objects.get_or_create(
            user_id=user_id,
            date=current_date,
            user=name,
            onLeave=True, 
            companyCode= company_code
        )
        if not created:
            attendance.onLeave = True
            attendance.companyCode = company_code
            attendance.save()

    
    return Response({'status': 'success', 'message': 'Leave Approved'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def leave_status_update_deny(request,pk):
    try:
        leave = Leave.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    leave.status = "Leave Denied"
    leave.save()    
    return Response({'status': 'success', 'message': 'Leave Denied'}, status=status.HTTP_200_OK)
 
 
@api_view(['GET'])
def today_on_leave(request,pk):
    today = datetime.now().date()
    items = Attendance.objects.filter(companyCode=pk, date=today, onLeave=True)
    serializer = AttendanceSerializer(items, many=True)
    return Response(serializer.data)