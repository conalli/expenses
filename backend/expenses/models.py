from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator
from django.db import models
from django.utils import timezone
from groups.models import Group, GroupMember


class Currency(models.Model):
    """ Currency represents an expenses currency """
    name = models.CharField(max_length=3, blank=False)
    decimals = models.PositiveSmallIntegerField(
        default=2, validators=[MaxValueValidator(3)])
    symbol = models.CharField(max_length=1, blank=False)

    def __str__(self) -> str:
        return f"{self.name}"


class Category(models.Model):
    """ Category represents an Expense category """
    title = models.CharField(max_length=50, blank=False)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    public = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self) -> str:
        return f"{self.title}"


class Expense(models.Model):
    """ Expense represents a single user expense """
    title = models.CharField(max_length=50, blank=False)
    description = models.CharField(max_length=255, blank=True)
    receipt_url = models.CharField(max_length=255, blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True)
    amount = models.IntegerField(blank=False)
    currency = models.ForeignKey(
        Currency, on_delete=models.SET_NULL, null=True)
    paid = models.BooleanField(default=False)
    paid_by = models.ForeignKey(
        GroupMember, on_delete=models.SET_NULL, default=None, null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.title} - ¥{self.amount}"
