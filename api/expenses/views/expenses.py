import os
from pathlib import Path

import boto3
from core.permissions import IsAdminOrReadOnly
from core.utils.queryset import default_user_queryset
from django.db.models import Model, Q
from django.db.models.manager import BaseManager
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from ..models.expenses import Category, Currency, Expense
from ..serializers.expenses import (CategorySerializer, CurrencySerializer,
                                    ExpenseSerializer)


class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self) -> BaseManager[Category]:
        user = self.request.user
        if user.is_staff:
            return Category.objects.all()
        return Category.objects.filter(Q(public=True) | Q(created_by=user))


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    supported_file_extensions = [".jpg", ".jpeg", ".png", ".webp"]
    bucket_region_code = os.environ.get("S3_BUCKET_REGION_CODE")
    bucket_name = os.environ.get("S3_BUCKET_NAME")
    bucket_url = f"https://s3.{bucket_region_code}.amazonaws.com/{bucket_name}/"
    s3 = boto3.resource("s3",
                        aws_access_key_id=os.environ.get("AWS_ACCESS_ID"),
                        aws_secret_access_key=os.environ.get("AWS_ACCESS_KEY"))

    def get_queryset(self) -> BaseManager[Model]:
        return default_user_queryset(self, Expense, "created_by")

    @action(detail=True, methods=["post"])
    def receipt(self, request: Request, pk: int) -> Response:
        receipt = request.FILES.get("receipt", None)
        if not receipt:
            return Response({"result": "error", "details": "no file in request"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            receipt_file_path = Path(receipt.name)
            if receipt_file_path.suffix not in self.supported_file_extensions:
                return Response({"result": "error", "details": "unsupported file format"}, status=status.HTTP_400_BAD_REQUEST)
            key = f"{request.user}_{pk}_{receipt_file_path.stem}"
            self.s3.meta.client.upload_fileobj(receipt, self.bucket_name, key)
            url = self.bucket_url + key
            Expense.objects.filter(pk=pk).update(receipt_url=url)
            return Response({"url": url})
        except Exception as e:
            print(e)
            return Response({"result": "error", "details": "could not process file"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
