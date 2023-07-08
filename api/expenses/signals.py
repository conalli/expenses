from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Group


@receiver(post_save, sender=User)
def create_default_group(sender: User, instance: User, created: bool, **kwargs):
    if created:
        name = f"{instance.username}'s Expenses"
        Group.objects.create(name=name, members=instance)
