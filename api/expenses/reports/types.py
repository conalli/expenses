
from enum import StrEnum
from typing import Protocol

from ..models import Currency
from .generator import (REPORT_TYPE_MONTHLY, REPORT_TYPE_YEARLY, MonthlyReport,
                        ReportResults, YearlyReport)


class ReportGenerator(Protocol):
    def generate(self, group_id: int, currencies: dict[int, Currency]) -> ReportResults:
        ...


class ReportType(StrEnum):
    MONTHLY = REPORT_TYPE_MONTHLY
    YEARLY = REPORT_TYPE_YEARLY

    @staticmethod
    def get_generator(report_type: str) -> ReportGenerator:
        match report_type:
            case ReportType.MONTHLY:
                return MonthlyReport()
            case ReportType.YEARLY:
                return YearlyReport()
            case _:
                raise ValueError("Argument not compatible with ReportType")
