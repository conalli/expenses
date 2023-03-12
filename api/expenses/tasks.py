from typing import Literal

from celery.utils.log import get_task_logger
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from expensemanager.celery import app

from .models.groups import Group
from .reports.report import Report, ReportType, map_currencies

logger = get_task_logger(__name__)


@app.task(bind=True)
def create_group_report(_self, report_type: str):
    logger.info("EMAIL REPORT")
    currencies = map_currencies()
    groups = Group.objects.all()
    for group in groups:
        report = Report(report_type).generate(group.pk, currencies)
        send_report.delay(
            group_name=group.name, emails=report.emails, report_type=report.report_type, report_data=report.data)


@app.task(bind=True)
def send_report(_self, group_name: str, emails: list[str], report_type: ReportType, report_data: dict[str, dict[str, int | float]]):
    logger.info(f"SEND REPORT EMAIL FOR {group_name}")
    subject = f"{report_type} report for {group_name}"
    message = render_to_string(
        "expenses/report.html", {"group": group_name, "data": report_data})
    send_mail(subject, message,
              settings.DEFAULT_FROM_EMAIL, emails, False, html_message=message)
