from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "password",
                  "last_name", "email", "date_joined"]
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if not value or value == "":
            raise serializers.ValidationError("must provide an email address")
        return value

    def create(self, validated_data):
        print(validated_data)
        user = User(email=validated_data["email"],
                    username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        return user
