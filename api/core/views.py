from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer


class SignUp(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request: Request):
        """ /signup/ POST endpoint creates a new user """
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data, partial=True)
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)


class CustomAuthToken(ObtainAuthToken):

    def post(self, request: Request) -> Response:
        """/token/ POST endpoint retrieves user token """
        serializer = self.serializer_class(
            data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user: User = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "user_id": user.pk,
            "username": user.username,
            "email": user.email,
            "token": token.key,
        })
