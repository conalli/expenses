from dataclasses import dataclass
from datetime import datetime
from typing import Final

from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.db.models.manager import BaseManager

from ..models import Category, Currency, Expense, GroupMember

REPORT_TYPE_MONTHLY: Final = "Monthly"
REPORT_TYPE_YEARLY: Final = "Yearly"


@dataclass(frozen=True)
class ReportResults:
    report_type: str
    emails: list[str]
    data: dict[str, dict[str, int | float]]


class MonthlyReport:
    group_id: int
    members: BaseManager[GroupMember]
    expenses: BaseManager[Expense]
    categories: dict[int, Category]
    currencies: dict[int, Currency]
    report_totals: dict[str, dict[str, int | float]] = {}

    def _get_members(self, group_id: int):
        self.members = GroupMember.objects.filter(group=group_id)

    def _get_categories(self, group_id: int):
        categories = Category.objects.filter(
            Q(public=True) | Q(group=group_id))
        self.categories = self._map_group_categories(categories)

    def _map_group_categories(self, categories: BaseManager[Category]) -> dict[int, Category]:
        category_map: dict[int, Category] = {}
        for category in categories:
            category_map[category.pk] = category
        return category_map

    def _get_expenses(self, group_id: int):
        month = self._get_prev_month()
        self.expenses = Expense.objects.filter(
            group=group_id, date__month=month).order_by("category")

    def _get_prev_month(self) -> int:
        date = datetime.now() + relativedelta(months=-1)
        return date.month

    def generate(self, group_id: int, currencies: dict[int, Currency]) -> ReportResults:
        self._get_members(group_id)
        self._get_categories(group_id)
        self._get_expenses(group_id)
        self.currencies = currencies
        for expense in self.expenses:
            self._add_expense_to_report(expense)
        emails = [member.user.email for member in self.members]
        return ReportResults(report_type=REPORT_TYPE_MONTHLY, emails=emails, data=self.report_totals)

    def _add_expense_to_report(self, expense: Expense):
        if expense.currency is None or expense.category is None:
            return
        currency = self.currencies[expense.currency.pk]
        category_id = expense.category.pk
        category_title = self.categories[category_id].title if category_id is not None else "Misc."
        amount_divisor = None if currency.decimals == 0 else 10 ** currency.decimals
        amount = (expense.amount /
                  amount_divisor) if amount_divisor is not None else expense.amount
        if category_title in self.report_totals:
            self.report_totals[category_title][currency.symbol] = self.report_totals[category_title].get(
                currency.symbol, 0) + amount
        else:
            self.report_totals[category_title] = {currency.symbol: amount}


class YearlyReport:
    def generate(self, group_id: int, currencies: dict[int, Currency]) -> ReportResults:
        ...
