from core.utils.queryset import default_user_queryset
from django.http import Http404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError, ValidationError
from rest_framework.parsers import JSONParser
from rest_framework.request import Request
from rest_framework.response import Response

from ..metadata import GroupMetadata
from ..models.expenses import Expense
from ..models.groups import Group, GroupMember, User
from ..serializers.expenses import ExpenseSerializer
from ..serializers.groups import GroupMemberSerializer, GroupSerializer
from ..utils import QueryParamParser


class GroupViewSet(viewsets.ModelViewSet):
    """ APIView for managing groups """
    serializer_class = GroupSerializer
    metadata_class = GroupMetadata

    def get_queryset(self):
        return default_user_queryset(self, Group, "members", "members")

    def get_group(self, pk: int) -> Group:
        try:
            return Group.objects.get(pk=pk)
        except Group.DoesNotExist:
            raise Http404

    def create(self, request: Request) -> Response:
        """ /group/ POST request creates a new group """
        try:
            data = JSONParser().parse(request)
            serializer = GroupSerializer(
                data=data, partial=True, context={"owner": request.user})
            if not serializer.is_valid(raise_exception=True):
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ParseError as err:
            print("Parse Err:", err.get_full_details())
            return Response({"result": "error", "description": "could not parse request"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError:
            print("Validation Err:", serializer.errors)
            return Response({"result": "error", "description": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True)
    def members(self, _request: Request, pk: int) -> Response:
        """ /group/{id}/members GET lists the members of a given group """
        members = GroupMember.objects.filter(group=pk)
        serializer = GroupMemberSerializer(members, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def expenses(self, request: Request, pk: int) -> Response:
        """ /group/{id}/expenses GET lists the expenses of a given group """
        query = request.query_params
        expense_filter = QueryParamParser(pk, query).to_filter()
        expenses = Expense.objects.filter(**expense_filter)
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)


class GroupMemberViewSet(viewsets.ModelViewSet):
    serializer_class = GroupMemberSerializer

    def get_queryset(self):
        return default_user_queryset(self, GroupMember, "user", None)

    def create(self, request: Request):
        """ /groupmember/ POST creates a new member for given group and user """
        data = JSONParser().parse(request)
        serializer = GroupMemberSerializer(
            data=data, context={"user": request.user})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
