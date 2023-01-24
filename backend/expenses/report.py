from dataclasses import dataclass
from datetime import datetime
from functools import reduce
from typing import List, NewType

from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.db.models.manager import BaseManager

from .models.expenses import Category, Currency, Expense
from .models.groups import GroupMember

# ReportResults represents a dict of Category titles with a dict of Currency -> total expense amount
ReportResults = NewType("ReportResults", dict[str, dict[str, float]])


class Report:
    group_id: int
    group_members: BaseManager[GroupMember]
    group_expenses: BaseManager[Expense]
    categories: dict[int, Category]
    currencies: dict[int, Currency]
    report_totals: ReportResults

    def __init__(self, group_id: int, month: int, currencies: dict[int, Currency]):
        self.group_id = group_id
        self.group_members = GroupMember.objects.filter(group=group_id)
        categories = Category.objects.filter(
            Q(public=True) | Q(group=group_id))
        self.categories = self.map_group_categories(categories)
        self.group_expenses = Expense.objects.filter(
            group=group_id, date__month=month).order_by("category")
        self.currencies = currencies
        self.report_totals = {}

    def map_group_categories(self, categories: BaseManager[Category]) -> dict[int, Category]:
        category_map: dict[int, Currency] = {}
        for category in categories:
            category_map[category.pk] = category
        return category_map

    def create_monthly_report(self) -> ReportResults:
        for expense in self.group_expenses:
            self.add_expense_to_report(expense)
        return self.report_totals

    def add_expense_to_report(self, expense: Expense):
        currency = self.currencies[expense.currency.pk]
        category_id = expense.category.pk
        category_title = self.categories[category_id].title if category_id is not None else "Misc."
        amount_divisor = 1 if currency.decimals == 0 else 10 ** currency.decimals
        if category_title in self.report_totals:
            self.report_totals[category_title][currency.name] = self.report_totals[category_title].get(
                currency.name, 0) + (expense.amount / amount_divisor)
        else:
            expense_amount = {currency.name: (expense.amount / amount_divisor)}
            self.report_totals[category_title] = expense_amount


def map_currencies() -> dict[int, Currency]:
    currencies = Currency.objects.all()
    currency_map: dict[int, Currency] = {}
    for currency in currencies:
        currency_map[currency.id] = currency
    return currency_map


def get_prev_month() -> int:
    date = datetime.now() + relativedelta(months=-1)
    return date.month
