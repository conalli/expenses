from django.db import models
from django.contrib.auth.models import User


class Group(models.Model):
    """ Category represents a group of users """
    name = models.CharField(max_length=50, blank=False)
    members = models.ManyToManyField(
        User, through="GroupMember", through_fields=("group", "user"))

    def __str__(self) -> str:
        return f"{self.name}"


class GroupMember(models.Model):
    """ GroupMember is the through table for groups and users """
    group = models.ForeignKey(Group, on_delete=models.CASCADE, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=255)


class Category(models.Model):
    """ Category represents an Expense category """
    title = models.CharField(max_length=50, blank=False)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.title}"


class Expense(models.Model):
    """ Expense represents a single user expense """
    title = models.CharField(max_length=50, blank=False)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True)
    amount = models.IntegerField(blank=False)
    paid = models.BooleanField(default=False)
    paid_by = models.ForeignKey(
        GroupMember, on_delete=models.SET_NULL, default=None, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.title} - ¥{self.amount}"
