import factory
import pytest
from django.db.models import signals

from .factories import (CategoryFactory, CurrencyFactory, ExpenseFactory,
                        GroupFactory)

pytestmark = pytest.mark.django_db


class TestCategory:
    @factory.django.mute_signals(signals.post_save)
    def test_str_method_returns_category_title(self, category_factory: CategoryFactory):
        category = category_factory(title="test_category")
        assert category.__str__() == "test_category"


class TestCurrency:
    def test_str_method_returns_category_name(self, currency_factory: CurrencyFactory):
        currency = currency_factory(name="USD", symbol="$")
        assert currency.__str__() == "USD: $"


class TestExpense:
    @factory.django.mute_signals(signals.post_save)
    def test_str_method_returns_expense_title_and_amount(self, expense_factory: ExpenseFactory):
        expense = expense_factory(title="Weekly shop", amount="100")
        assert expense.__str__() == "Weekly shop: 100"


class TestGroup:
    @factory.django.mute_signals(signals.post_save)
    def test_str_method_returns_group_name(self, group_factory: GroupFactory):
        group = group_factory(name="test_group")
        assert group.__str__() == "test_group"
