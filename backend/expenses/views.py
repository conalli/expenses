from rest_framework import viewsets
from utils.queryset import default_user_queryset

from .models import Category, Currency, Expense
from .permissions import IsAdminOrReadOnly
from .serializers import (CategorySerializer, CurrencySerializer,
                          ExpenseSerializer)


class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
