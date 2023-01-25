from typing import List

from celery.utils.log import get_task_logger
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from expensemanager.celery import app

from .models.groups import Group
from .report import Report, ReportResults, get_prev_month, map_currencies

logger = get_task_logger(__name__)


@app.task(bind=True)
def email_monthly_report(self):
    logger.info("MONTHLY EMAIL TASK")
    currencies = map_currencies()
    prev_month = get_prev_month()
    groups = Group.objects.all()
    for group in groups:
        report = Report(group.pk, prev_month, currencies)
        report_data = report.create_monthly_report()
        emails = [member.user.email for member in report.get_members()]
        send_member_report.delay(
            group_name=group.name, emails=emails, report_data=report_data)


@app.task(bind=True)
def send_member_report(self, group_name: str, emails: List[str], report_data: ReportResults):
    logger.info(f"SEND REPORT EMAIL FOR {group_name}")
    subject = f"Monthly report for {group_name}"
    message = render_to_string(
        "expenses/report.html", {"group": group_name, "data": report_data})
    send_mail(subject, message,
              settings.DEFAULT_FROM_EMAIL, emails, False, html_message=message)
