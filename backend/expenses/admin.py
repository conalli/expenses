from django.contrib import admin

from .models import Category, Currency, Expense


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "decimals"]
    readonly_fields = ["id"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "group"]
    readonly_fields = ["id"]


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "description", "category", "currency",
                    "amount", "paid", "created_at", "updated_at"]
    readonly_fields = ["id"]
