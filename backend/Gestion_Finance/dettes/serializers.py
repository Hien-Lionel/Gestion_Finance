from rest_framework import serializers
from .models import Dette

class DetteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dette
        fields = '__all__'
