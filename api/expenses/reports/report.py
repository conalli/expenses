from __future__ import annotations

from ..models import Currency
from .generator import ReportResults
from .types import ReportGenerator, ReportType


class Report:
    report_generator: ReportGenerator

    def __init__(self, report_type: str):
        self.report_generator = ReportType.get_generator(report_type)

    def generate(self, group_id: int, currencies: dict[int, Currency]) -> ReportResults:
        return self.report_generator.generate(group_id, currencies)


def map_currencies() -> dict[int, Currency]:
    currencies = Currency.objects.all()
    currency_map: dict[int, Currency] = {}
    for currency in currencies:
        currency_map[currency.pk] = currency
    return currency_map
