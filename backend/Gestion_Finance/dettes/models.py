from django.db import models
from accounts.models import User

class Dette(models.Model):
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date_echeance = models.DateField()
    statut = models.CharField(max_length=20, default="en_cours")

    user = models.ForeignKey(User, on_delete=models.CASCADE)
