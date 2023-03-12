from datetime import datetime

import factory
import pytest
from core.tests.factories import UserFactory
from dateutil.relativedelta import relativedelta
from django.db.models import signals

from ..models import Group
from ..reports.generator import (REPORT_TYPE_MONTHLY, REPORT_TYPE_YEARLY,
                                 MonthlyReport, YearlyReport)
from ..reports.report import Report, map_currencies
from ..reports.types import ReportType
from .factories import (CategoryFactory, CurrencyFactory, ExpenseFactory,
                        GroupFactory, GroupMemberFactory)

pytestmark = pytest.mark.django_db


class TestReport:
    @pytest.fixture
    @factory.django.mute_signals(signals.post_save)
    def report_data(self):
        last_month_date = datetime.now() + relativedelta(months=-1)
        currency_jpy = CurrencyFactory(name="JPY", decimals=0, symbol="¥")
        currency_usd = CurrencyFactory(name="USD", decimals=2, symbol="$")
        user = UserFactory(username="reporttest",
                           password="password", email="reporttest@report.test")
        group = GroupFactory(name="test_group")
        GroupMemberFactory(group=group, user=user)
        category_food = CategoryFactory(
            title="Food", group=group, created_by=user)
        category_gas = CategoryFactory(
            title="Gas", group=group, created_by=user)
        ExpenseFactory(title="weekly_shop", amount=5000, category=category_food,
                             currency=currency_jpy, created_by=user, date=last_month_date, group=group)
        ExpenseFactory(title="weekly_shop", amount=3000, category=category_food,
                       currency=currency_jpy, created_by=user, date=last_month_date, group=group)
        ExpenseFactory(title="weekly_shop", amount=6000, category=category_food,
                       currency=currency_jpy, created_by=user, date=last_month_date, group=group)
        ExpenseFactory(title="weekly_shop", amount=4000, category=category_food,
                       currency=currency_usd, created_by=user, date=last_month_date, group=group)
        ExpenseFactory(title="gas", amount=3000, category=category_gas,
                       currency=currency_jpy, created_by=user, date=last_month_date, group=group)
        return {"group_name": group.name}

    def test_monthly_report(self, report_data):
        new_group = Group.objects.get(name=report_data["group_name"])
        currencies = map_currencies()
        report = Report(REPORT_TYPE_MONTHLY).generate(new_group.pk, currencies)
        want = {
            "Food": {"¥": 14000.0, "$": 40.0},
            "Gas": {"¥": 3000.0}
        }
        assert want == report.data

    def test_get_emails(self, report_data):
        new_group = Group.objects.get(name=report_data["group_name"])
        currencies = map_currencies()
        report = Report(REPORT_TYPE_MONTHLY).generate(new_group.pk, currencies)
        emails = report.emails
        assert len(emails) == 1
        assert emails[0] == "reporttest@report.test"

    def test_map_currencies(self):
        usd = CurrencyFactory(name="USD", decimals=2, symbol="$")
        jpy = CurrencyFactory(name="JPY", decimals=0, symbol="¥")
        got = map_currencies()
        assert got[1] == usd
        assert got[2] == jpy


class TestGenerator:
    def test_get_generator_returns_monthly_report(self) -> None:
        variant_literal, variant_str = REPORT_TYPE_MONTHLY, "Monthly"
        assert isinstance(
            ReportType.get_generator(variant_literal), MonthlyReport)
        assert isinstance(
            ReportType.get_generator(variant_str), MonthlyReport)

    def test_get_generator_returns_yearly_report(self) -> None:
        variant_literal, variant_str = REPORT_TYPE_YEARLY, "Yearly"
        assert isinstance(
            ReportType.get_generator(variant_literal), YearlyReport)
        assert isinstance(
            ReportType.get_generator(variant_str), YearlyReport)

    def test_get_generator_raises_valueerror(self) -> None:
        non_variant = "Testy"
        with pytest.raises(ValueError):
            ReportType.get_generator(non_variant)
