from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Category, Currency, Expense
from .permissions import IsAdminOrReadOnly
from .serializers import (CategorySerializer, CurrencySerializer,
                          ExpenseSerializer)
from .utils import QueryParamParser


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

    @action(detail=True)
    def group(self, request: Request) -> Response:
        query = request.query_params
        expense_filter = QueryParamParser(query).to_filter()
        expenses = Expense.objects.filter(**expense_filter)
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)
