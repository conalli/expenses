
import pytest
from pytest_factoryboy import register

from .factories import (CategoryFactory, CurrencyFactory, ExpenseFactory,
                        GroupFactory, GroupMemberFactory)

register(CategoryFactory)
register(CurrencyFactory)
register(ExpenseFactory)
register(GroupFactory)
register(GroupMemberFactory)
