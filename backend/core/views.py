from django.http import Http404
from rest_framework import views, status
from rest_framework.exceptions import ParseError, ValidationError
from rest_framework.parsers import JSONParser
from rest_framework.request import Request
from rest_framework.response import Response
from .serializers import GroupSerializer
from .models import Group


class GroupAPIView(views.APIView):
    """ APIView for managing groups """

    def post(self, request: Request) -> Response:
        """ POST request to create a group """
        try:
            data = JSONParser().parse(request)
            req_user = data.pop("members")
            print(dict(req_user[0]))
            data["members"] = [dict(req_user[0])]
            print("RE", data)
            serializer = GroupSerializer(
                data=data, partial=True, context=dict(req_user[0]))
            if not serializer.is_valid(raise_exception=True):
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data)
        except (ParseError):
            return Response({"result": "error", "description": "could not parse request"}, status=status.HTTP_400_BAD_REQUEST)
        except (ValidationError):
            print("E", serializer.errors)
            return Response({"result": "error", "description": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)


class GroupDetailsAPIView(views.APIView):

    def get_object(self, pk: int) -> Group:
        try:
            return Group.objects.get(pk=pk)
        except Group.DoesNotExist:
            raise Http404

    def get(self, _request: Request, pk: int, _format=None) -> Response:
        """ GET request returns a group """
        group = self.get_object(pk=pk)
        serializer = GroupSerializer(group)
        return Response(serializer.data)
