import uuid
from django.db import models
from accounts.models import User

class Entreprise(models.Model):
    nom = models.CharField(max_length=100)
    domaine = models.CharField(max_length=100, blank=True, null=True)
    date_creation = models.DateField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entreprises_crees')
    code_entreprise = models.CharField(max_length=20, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.code_entreprise:
            # Generate a 8-character uppercase code
            self.code_entreprise = str(uuid.uuid4()).split('-')[0].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nom} ({self.code_entreprise})"
