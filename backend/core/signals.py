from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from .tasks import send_newuser_email


@receiver(post_save, sender=User)
def create_auth_token(sender: User, instance: User, created: bool, **kwargs):
    if created:
        Token.objects.create(user=instance)


@receiver(post_save, sender=User)
def send_auth_email(sender, instance: User, created: bool, **kwargs):
    if created:
        send_newuser_email.delay(
            username=instance.username, email=instance.email)
