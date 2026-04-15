from django.db import models

class Categorie(models.Model):
    TYPE_CHOICES = (
        ('revenu', 'Revenu'),
        ('depense', 'Depense'),
    )

    nom = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
