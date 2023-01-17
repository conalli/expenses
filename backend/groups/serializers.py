from django.db import transaction

from rest_framework import serializers
from .models import Group, GroupMember, User


class GroupSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ["id", "name", "members"]
        depth = 1

    def validate(self, attrs):
        print("CTX", self.context)
        attrs["members"] = self.context
        return attrs

    def get_members(self, obj):
        members = GroupMember.objects.filter(group=obj.id)
        serializer = GroupMemberSerializer(members, many=True)
        print("SSS", serializer.data)
        return serializer.data

    @transaction.atomic
    def create(self, validated_data):
        print("DATA: ", validated_data)
        member = validated_data.pop("members")
        user = User.objects.get(pk=member["id"])
        group = Group.objects.create(**validated_data)
        group_member = {"user": user, "group": group,
                        "verification_code": "verify"}
        group_owner = GroupMember.objects.create(**group_member)
        print("GO", group_owner.verified)
        group.members.set([group_owner.user.id])
        return group


class GroupMemberSerializer(serializers.ModelSerializer):
    group = serializers.PrimaryKeyRelatedField(
        read_only=True)
    user = serializers.PrimaryKeyRelatedField(
        read_only=True)

    class Meta:
        model = GroupMember
        fields = ["id", "verified", "verification_code", "group", "user"]
