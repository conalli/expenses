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
from django.contrib import admin
from django.urls import path
from rest_framework import routers
from core import views as core_views

router = routers.DefaultRouter()

urlpatterns = router.urls

urlpatterns += [
    path("admin/", admin.site.urls),
    path("group/", core_views.GroupAPIView.as_view()),
    path("group/<int:pk>/", core_views.GroupDetailsAPIView.as_view()),
]
