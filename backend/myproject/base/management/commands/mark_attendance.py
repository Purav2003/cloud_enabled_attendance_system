# myapp/management/commands/mark_attendance.py

from django.core.management.base import BaseCommand
from datetime import date
from base.models import User, Attendance

class Command(BaseCommand):
    help = 'Marks attendance as absent for all users for the current date'

    def handle(self, *args, **options):
        # Get today's date
        today = date.today()

        # Iterate over all users and mark their attendance as absent for today
        for user in User.objects.all():
            # Check if attendance entry for the user for today exists
            attendance_entry = Attendance.objects.filter(user=user, date=today).first()

            # If attendance entry doesn't exist, create a new one and mark as absent
            if not attendance_entry:
                Attendance.objects.create(user=user.name, attendance=False, date=today,user_id=user.id,companyCode=user.companyCode)
                self.stdout.write(self.style.SUCCESS(f"Attendance marked as absent for {user} for {today}"))
            else:
                self.stdout.write(self.style.WARNING(f"Attendance entry already exists for {user} for {today}"))
