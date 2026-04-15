import random
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, PasswordResetCode
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


from django.db.models import Q

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        ent_id = self.request.query_params.get('entreprise_id')
        
        # If Admin, return users belonging to the specified enterprise (if provided)
        # AND include the Admin themselves.
        if getattr(user, 'role', '') == 'admin':
            if ent_id:
                qs = User.objects.filter(Q(entreprise_id=ent_id) | Q(id=user.id))
            else:
                qs = User.objects.filter(Q(entreprise__user=user) | Q(id=user.id))
            return qs.distinct()
        
        # If Manager or User, return users in their specific enterprise (role='user')
        # plus themselves. The manager should NOT see the Admin.
        if getattr(user, 'entreprise', None):
            return User.objects.filter(
                Q(entreprise=user.entreprise, role='user') | Q(id=user.id)
            ).distinct()
        
        return User.objects.none()


class UserToggleActiveView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        caller = request.user
        if caller.role not in ('admin', 'manager'):
            return Response({"error": "Permission refusée."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            target = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND)
        
        # Cannot deactivate yourself
        if target.id == caller.id:
            return Response({"error": "Vous ne pouvez pas vous désactiver vous-même."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Manager cannot toggle admin or other managers
        if caller.role == 'manager' and target.role != 'user':
            return Response({"error": "Permission refusée."}, status=status.HTTP_403_FORBIDDEN)
        
        target.is_active = not target.is_active
        target.save()
        return Response({"id": target.id, "is_active": target.is_active, "username": target.username}, status=status.HTTP_200_OK)


class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        caller = request.user
        if caller.role not in ('admin', 'manager'):
            return Response({"error": "Permission refusée."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            target = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND)
        
        # Cannot delete yourself
        if target.id == caller.id:
            return Response({"error": "Vous ne pouvez pas supprimer votre propre compte."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Manager cannot delete admin or other managers
        if caller.role == 'manager' and target.role != 'user':
            return Response({"error": "Permission refusée."}, status=status.HTTP_403_FORBIDDEN)
        
        name = target.username
        target.delete()
        return Response({"message": f"Utilisateur '{name}' supprimé."}, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "L'email est requis."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        if user:
            # Generate 6-digit code
            code = str(random.randint(100000, 999999))
            PasswordResetCode.objects.create(user=user, code=code)
            # In a real app we send an email here.
            print(f"--- PASSEWORD RESET CODE FOR {email} ---")
            print(f"CODE: {code}")
            print("----------------------------------------")
            return Response({"message": "Si cet email existe, un code a été envoyé."}, status=status.HTTP_200_OK)
        # return same response to prevent email enumeration
        return Response({"message": "Si cet email existe, un code a été envoyé."}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        new_password = request.data.get('new_password')

        if not all([email, code, new_password]):
            return Response({"error": "Email, code et nouveau mot de passe sont requis."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "Code invalide ou expiré."}, status=status.HTTP_400_BAD_REQUEST)

        reset_code = PasswordResetCode.objects.filter(user=user, code=code).order_by('-created_at').first()
        if not reset_code or not reset_code.is_valid():
            return Response({"error": "Code invalide ou expiré."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        reset_code.delete() # Consume the code

        return Response({"message": "Mot de passe réinitialisé avec succès."}, status=status.HTTP_200_OK)
