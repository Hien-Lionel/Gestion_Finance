from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from .models import User
from entreprises.models import Entreprise

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    roleCode = serializers.CharField(write_only=True, required=False)
    enterpriseCode = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'telephone', 'roleCode', 'enterpriseCode']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        role = attrs.get('role', 'user')
        role_code = attrs.get('roleCode', '')
        enterprise_code = attrs.get('enterpriseCode', '')

        if role == 'admin':
            if role_code != getattr(settings, 'ADMIN_SECRET_CODE', ''):
                raise serializers.ValidationError({"roleCode": "Code administrateur invalide."})
        elif role == 'manager':
            if role_code != getattr(settings, 'MANAGER_SECRET_CODE', ''):
                raise serializers.ValidationError({"roleCode": "Code manager invalide."})
            if not enterprise_code:
                raise serializers.ValidationError({"enterpriseCode": "Le code d'entreprise est requis pour un manager."})
            if not Entreprise.objects.filter(code_entreprise=enterprise_code).exists():
                raise serializers.ValidationError({"enterpriseCode": "Entreprise introuvable."})
        elif role == 'user':
            if not enterprise_code:
                 raise serializers.ValidationError({"enterpriseCode": "Le code d'entreprise est requis."})
            if not Entreprise.objects.filter(code_entreprise=enterprise_code).exists():
                raise serializers.ValidationError({"enterpriseCode": "Entreprise introuvable."})

        return attrs

    def create(self, validated_data):
        validated_data.pop('roleCode', None)
        enterprise_code = validated_data.pop('enterpriseCode', None)
        
        entreprise = None
        if enterprise_code:
            entreprise = Entreprise.objects.filter(code_entreprise=enterprise_code).first()

        user = User.objects.create_user(**validated_data)
        
        if entreprise:
            user.entreprise = entreprise
            user.save()
            
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom fields to token response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'telephone': self.user.telephone,
            'entreprise_code': self.user.entreprise.code_entreprise if getattr(self.user, 'entreprise', None) else None,
        }
        
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'telephone', 'first_name', 'last_name', 'is_active']
        read_only_fields = ['id']
