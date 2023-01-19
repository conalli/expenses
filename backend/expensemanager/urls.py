"""expenses URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from core.views import UserViewSet
from django.contrib import admin
from django.urls import include, path
from expenses.views import CategoryViewSet, CurrencyViewSet, ExpenseViewSet
from groups.views import GroupMemberViewSet, GroupViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
router.register(r"groups", GroupViewSet, basename="group")
router.register(r"groupmembers", GroupMemberViewSet, basename="groupmember")
router.register(r"currencies", CurrencyViewSet, basename="currency")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"expenses", ExpenseViewSet, basename="expense")

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/", include(router.urls))
]