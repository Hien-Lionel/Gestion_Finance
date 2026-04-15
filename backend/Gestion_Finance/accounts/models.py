from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('user', 'User'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    telephone = models.CharField(max_length=20, blank=True)
    entreprise = models.ForeignKey('entreprises.Entreprise', on_delete=models.SET_NULL, null=True, blank=True, related_name='employes')

class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def is_valid(self):
        # Valable pour 15 minutes
        return timezone.now() < self.created_at + timedelta(minutes=15)
