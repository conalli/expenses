from datetime import datetime

import factory
from core.tests.factories import UserFactory

from ..models import Category, Currency, Expense, Group, GroupMember


class GroupFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Group

    name = "test_group"


class GroupMemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupMember

    group = factory.SubFactory(GroupFactory)
    user = factory.SubFactory(UserFactory)
    verified = False
    verification_code = "verification_code"


class GroupWithMembersFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Group

    members = factory.RelatedFactory(
        GroupMemberFactory, factory_related_name="group")


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category

    title = "test_category"
    group = factory.SubFactory(GroupFactory)
    created_by = factory.SubFactory(UserFactory)


class CurrencyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Currency

    name = "test_category"
    decimals = 0
    symbol = "t"


class ExpenseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Expense

    title = "test_expense"
    description = "test_description"
    category = factory.SubFactory(CategoryFactory)
    amount = 100
    currency = factory.SubFactory(CurrencyFactory)
    paid = True
    group = factory.SubFactory(GroupFactory)
    created_by = factory.SubFactory(UserFactory)
    date = datetime.now()
