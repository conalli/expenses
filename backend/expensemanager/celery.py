import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "expensemanager.settings")

app = Celery("expensemanager")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


app.conf.beat_schedule = {
    "send-monthly-report": {
        "task": "expenses.tasks.send",
        "schedule": crontab(minute=0, hour=0, day_of_month=1)
    }
}
