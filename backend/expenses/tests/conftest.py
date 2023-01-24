from pytest_factoryboy import register

from .factories import CategoryFactory, CurrencyFactory, ExpenseFactory

register(CategoryFactory)
register(CurrencyFactory)
register(ExpenseFactory)
