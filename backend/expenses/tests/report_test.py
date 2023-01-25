from datetime import datetime

import factory
import pytest
from core.tests.factories import UserFactory
from dateutil.relativedelta import relativedelta
from django.db.models import signals

from ..models.groups import Group
from ..report import Report, get_prev_month, map_currencies
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
        return {"group_name": group.name, "date": last_month_date}

    def test_monthly_report(self, report_data):
        new_group = Group.objects.get(name=report_data["group_name"])
        currencies = map_currencies()
        prev_month = report_data["date"].month
        report = Report(new_group.pk, prev_month,
                        currencies)
        got = report.create_monthly_report()
        print("REPORT", prev_month)
        want = {
            "Food": {"¥": 14000.0, "$": 40.0},
            "Gas": {"¥": 3000.0}
        }
        assert want == got


class TestMapCurrencies:
    def test_map_currencies(self):
        usd = CurrencyFactory(name="USD", decimals=2, symbol="$")
        jpy = CurrencyFactory(name="JPY", decimals=0, symbol="¥")
        got = map_currencies()
        assert got[1] == usd
        assert got[2] == jpy


class TestGetPrevMonth:
    def test_get_prev_month(self):
        this_month = datetime.now().month
        assert this_month - 1 == (0 if this_month == 1 else get_prev_month())
