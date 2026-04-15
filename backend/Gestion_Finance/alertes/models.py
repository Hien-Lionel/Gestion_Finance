from django.db import models
from accounts.models import User

class Alerte(models.Model):
    message = models.TextField()
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
