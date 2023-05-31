from core.serializers import UserSerializer
from expenses.serializers.groups import GroupMemberSerializer, GroupSerializer
from rest_framework import serializers

from ..models import Category, Currency, Expense


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ExpenseSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer()
    category = CategorySerializer()
    paid_by = GroupMemberSerializer()
    group = GroupSerializer()
    created_by = UserSerializer()

    class Meta:
        model = Expense
        fields = [
            "id",
            "title",
            "description",
            "receipt_url",
            "currency",
            "category",
            "amount",
            "paid",
            "paid_by",
            "group",
            "date",
            "created_by"
        ]
