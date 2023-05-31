from core.serializers import GroupUserSerializer
from core.utils.token import token_generator
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers

from ..models import Group, GroupMember


class GroupMemberSerializer(serializers.ModelSerializer):
    user = GroupUserSerializer()

    class Meta:
        model = GroupMember
        fields = "__all__"
        extra_kwargs = {"verified": {"read_only": True},
                        "verification_code": {"read_only": True}}
        depth = 1

    def validate_group(self, value):
        if GroupMember.objects.get(group=value, user=self.context.get("user")) is None:
            raise serializers.ValidationError(
                "Cannot add new member to non-member group")
        return value

    def create(self, validated_data) -> GroupMember:
        code = token_generator.make_token(validated_data.get("user"))
        new_member_data = {"group": validated_data.get("group"),
                           "user": validated_data.get("user"), "verification_code": code}
        return GroupMember.objects.create(**new_member_data)


class GroupSerializer(serializers.ModelSerializer):
    members = GroupUserSerializer(many=True)

    class Meta:
        model = Group
        fields = "__all__"
        extra_kwargs = {"members": {"read_only": True}}

    def validate(self, data: dict[str, str | list[User]]):
        if "name" not in data or len(data["name"]) == 0 or len(data["name"]) > 50:
            raise serializers.ValidationError(
                "Group name must be between 1 and 50 characters long")
        data["owner"] = self.context["owner"]
        return data

    @transaction.atomic
    def create(self, validated_data) -> Group:
        group_owner = validated_data.pop("owner")
        group = Group.objects.create(**validated_data)
        owner = {"user": group_owner, "group": group, "verified": True,
                 "verification_code": ""}
        group_owner = GroupMember.objects.create(**owner)
        group.members.set([group_owner.user.id])
        return group
