from django.http import Http404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError, ValidationError
from rest_framework.parsers import JSONParser
from rest_framework.request import Request
from rest_framework.response import Response
from expenses.models import Expense
from expenses.serializers import ExpenseSerializer
from .models import Group, GroupMember
from .serializers import GroupSerializer, GroupMemberSerializer
from .utils import ExpenseQueryParamParser
from .metadata import GroupMetadata


class GroupViewSet(viewsets.ViewSet):
    """ APIView for managing groups """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    metadata_class = GroupMetadata

    def list(self, _request: Request) -> Response:
        group = Group.objects.all()
        serializer = GroupSerializer(group, many=True)
        return Response(serializer.data)

    def get_group(self, pk: int) -> Group:
        try:
            return Group.objects.get(pk=pk)
        except Group.DoesNotExist:
            raise Http404

    def retrieve(self, _request: Request, pk: int, _format=None) -> Response:
        """ /groups/{id} GET request returns a group with a given id """
        group = self.get_group(pk=pk)
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

    @action(detail=True)
    def expenses(self, request: Request, pk: int) -> Response:
        query = request.query_params
        expense_filter = ExpenseQueryParamParser(pk, query).to_filter()
        expenses = Expense.objects.filter(**expense_filter)
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)


class GroupMemberViewSet(viewsets.ModelViewSet):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer
