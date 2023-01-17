from django.contrib import admin
from .models import Group, GroupMember
# Register your models here.


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    readonly_fields = ["id"]
    list_display = ["id", "name"]
    filter_horizontal = ["members"]


@admin.register(GroupMember)
class GroupMemberAdmin(admin.ModelAdmin):
    list_display = ["id", "group", "user", "verified", "verification_code"]
    readonly_fields = ["id"]
