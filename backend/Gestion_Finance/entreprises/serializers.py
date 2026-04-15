from rest_framework import serializers
from .models import Entreprise

class EntrepriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = ['id', 'nom', 'code_entreprise', 'domaine', 'date_creation']
        read_only_fields = ['code_entreprise']
