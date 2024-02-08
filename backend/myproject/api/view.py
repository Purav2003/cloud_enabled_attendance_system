from django.core.files.storage import FileSystemStorage
from datetime import date
from collections import defaultdict
from datetime import datetime, timedelta
from base.models import Attendance
from rest_framework.response import Response    
from rest_framework.decorators import api_view
from datetime import datetime

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




