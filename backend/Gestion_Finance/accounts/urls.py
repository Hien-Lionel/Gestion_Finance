from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, UserProfileView, ForgotPasswordView, ResetPasswordView, UserListView, UserToggleActiveView, UserDeleteView

app_name = 'accounts'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/toggle-active/', UserToggleActiveView.as_view(), name='user-toggle-active'),
    path('users/<int:user_id>/delete/', UserDeleteView.as_view(), name='user-delete'),
]
