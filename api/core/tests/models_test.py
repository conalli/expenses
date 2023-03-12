import factory
import pytest
from django.db.models import signals

from .factories import UserFactory

pytestmark = pytest.mark.django_db


class TestUser:
    @factory.django.mute_signals(signals.post_save)
    def test_str_method_returns_category_title(self, user_factory: UserFactory):
        user = user_factory(username="test_user1")
        assert user.__str__() == "test_user1"
