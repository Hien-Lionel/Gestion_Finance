from rest_framework import viewsets
from .models import Dette
from .serializers import DetteSerializer

class DetteViewSet(viewsets.ModelViewSet):
    queryset = Dette.objects.all()
    serializer_class = DetteSerializer
