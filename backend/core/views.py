from django.http import Http404
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.exceptions import ParseError, ValidationError
from rest_framework.parsers import JSONParser
from rest_framework.request import Request
from rest_framework.response import Response
from .serializers import GroupSerializer, GroupMemberSerializer, UserSerializer, CategorySerializer, ExpenseSerializer
from .models import Group, GroupMember, Category, Expense


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ViewSet):
    """ APIView for managing groups """

    def list(self, _request: Request) -> Response:
        """ """
        groups = Group.objects.get()
        serializer = GroupSerializer(groups)
        return Response(serializer.data)

    def get_object(self, pk: int) -> Group:
        try:
            return Group.objects.get(pk=pk)
        except Group.DoesNotExist:
            raise Http404

    def retrieve(self, _request: Request, pk: int, _format=None) -> Response:
        """ /groups/{id} GET request returns a group with a given id """
        group = self.get_object(pk=pk)
        serializer = GroupSerializer(group)
        return Response(serializer.data)

    def create(self, request: Request) -> Response:
        """ /groups POST request creates a new group """
        try:
            data = JSONParser().parse(request)
            print("RE", data)
            req_user = data.pop("members")
            print(dict(req_user[0]))
            data["members"] = [dict(req_user[0])]
            serializer = GroupSerializer(
                data=data, partial=True, context=dict(req_user[0]))
            if not serializer.is_valid(raise_exception=True):
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data)
        except ParseError as err:
            print(err.get_full_details())
            return Response({"result": "error", "description": "could not parse request"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError:
            print("E", serializer.errors)
            return Response({"result": "error", "description": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)


class GroupMemberViewSet(viewsets.ModelViewSet):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
