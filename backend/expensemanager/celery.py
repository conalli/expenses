import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "expensemanager.settings")

app = Celery("expensemanager")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


app.conf.beat_schedule = {
    "debug-every-30-seconds": {
        "task": "core.tasks.debug_task",
        "schedule": 30.0,
    }
}
