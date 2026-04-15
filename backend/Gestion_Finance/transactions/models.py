from django.db import models
from accounts.models import User
from categories.models import Categorie

class Transaction(models.Model):
    TYPE_CHOICES = (
        ('revenu', 'Revenu'),
        ('depense', 'Depense'),
    )

    montant = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    date = models.DateField(auto_now_add=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True)
