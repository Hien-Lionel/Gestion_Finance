from rest_framework import viewsets, permissions
from .models import Entreprise
from .serializers import EntrepriseSerializer

class EntrepriseViewSet(viewsets.ModelViewSet):
    serializer_class = EntrepriseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', '') == 'admin':
            return Entreprise.objects.filter(user=user)
        elif getattr(user, 'entreprise', None) is not None:
            return Entreprise.objects.filter(id=user.entreprise.id)
        return Entreprise.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
