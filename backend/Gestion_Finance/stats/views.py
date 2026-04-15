from rest_framework.views import APIView
from rest_framework.response import Response
from transactions.models import Transaction
from django.contrib.auth import get_user_model

User = get_user_model()

class StatsView(APIView):
    def get(self, request):
        return Response({
            "users": User.objects.count(),
            "transactions": Transaction.objects.count(),
        })
