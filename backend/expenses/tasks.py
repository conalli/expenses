from celery.utils.log import get_task_logger
from expensemanager.celery import app

from .models.groups import Group
from .report import Report, map_currencies

logger = get_task_logger(__name__)


@app.task(bind=True)
def email_monthly_report(self):
    logger.info("MONTHLY EMAIL TASK")
    currencies = map_currencies()
    groups = Group.objects.all()
    for group in groups:
        report = Report(group.pk, currencies)
