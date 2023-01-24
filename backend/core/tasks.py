from celery.utils.log import get_task_logger
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from expensemanager.celery import app

logger = get_task_logger(__name__)


@app.task(bind=True)
def send_newuser_email(self, username: str, email: str):
    logger.info(f"SEND_EMAIL {username} - {email}")
    subject = f"Welcome, {username}!"
    message = render_to_string(
        "core/newuser.html", {"username": username})
    send_mail(subject, message,
              settings.DEFAULT_FROM_EMAIL, [email], False, html_message=message)
