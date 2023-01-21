from typing import Optional, TypeVar

from django.db.models import Model
from django.db.models.manager import BaseManager
from rest_framework import viewsets

M = TypeVar("M", bound=Model)


def default_user_queryset(viewset: viewsets.GenericViewSet, model: M, filterkey: str, prefetch: Optional[str]) -> BaseManager[M]:
    user = viewset.request.user
    get_all = model.objects.all()
    f = {filterkey: user}
    filtered = model.objects.filter(**f)
    if user.is_staff:
        return get_all if prefetch is None else get_all.prefetch_related(prefetch)
    return filtered if prefetch is None else filtered.prefetch_related(prefetch)
