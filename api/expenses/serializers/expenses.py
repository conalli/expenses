from core.models import User
from core.serializers import UserSerializer
from expenses.serializers.groups import GroupMemberSerializer, GroupSerializer
from rest_framework import serializers

from ..models import Category, Currency, Expense, Group


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ExpenseSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        source="currency", queryset=Currency.objects.all(), write_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.all(), write_only=True)
    paid_by = GroupMemberSerializer(read_only=True)
    paid_by_id = serializers.PrimaryKeyRelatedField(
        source="paid_by", queryset=User.objects.all(), allow_null=True, write_only=True)
    group = GroupSerializer(read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(
        source="group", queryset=Group.objects.all(), write_only=True)
    created_by = UserSerializer(read_only=True)
    created_by_id = serializers.PrimaryKeyRelatedField(
        source="created_by", queryset=User.objects.all(), write_only=True)

    class Meta:
        model = Expense
        fields = [
            "id",
            "title",
            "description",
            "receipt_url",
            "currency",
            "currency_id",
            "category",
            "category_id",
            "amount",
            "paid",
            "paid_by",
            "paid_by_id",
            "group",
            "group_id",
            "date",
            "created_by",
            "created_by_id",
        ]
