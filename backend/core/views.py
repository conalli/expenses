from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class SignUp(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request: Request):
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data, partial=True)
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)
