from core.utils.queryset import default_user_queryset
from django.db.models import Q
from rest_framework import viewsets

from ..models.expenses import Category, Currency, Expense
from ..permissions import IsAdminOrReadOnly
from ..serializers.expenses import (CategorySerializer, CurrencySerializer,
                                    ExpenseSerializer)


class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Category.objects.all()
        return Category.objects.filter(Q(public=True) | Q(created_by=user))


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return default_user_queryset(self, Expense, "created_by")
