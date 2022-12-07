from django.contrib import admin
from .models import Category, Expense, Group, GroupMember


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "group"]
    readonly_fields = ["id"]


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "description", "category",
                    "amount", "paid", "created_at", "updated_at"]
    readonly_fields = ["id"]


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    readonly_fields = ["id"]
    list_display = ["id", "name"]
    filter_horizontal = ["members"]


@admin.register(GroupMember)
class GroupMemberAdmin(admin.ModelAdmin):
    list_display = ["id", "group", "user", "verified", "verification_code"]
    readonly_fields = ["id"]
