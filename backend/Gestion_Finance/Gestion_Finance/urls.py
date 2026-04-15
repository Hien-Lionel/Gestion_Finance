"""
URL configuration for Gestion_Finance project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from entreprises.views import EntrepriseViewSet
from categories.views import CategorieViewSet
from transactions.views import TransactionViewSet
from dettes.views import DetteViewSet
from alertes.views import AlerteViewSet
from stats.views import StatsView

router = DefaultRouter()
router.register(r'entreprises', EntrepriseViewSet, basename='entreprise')
router.register(r'categories', CategorieViewSet, basename='categorie')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'dettes', DetteViewSet, basename='dette')
router.register(r'alertes', AlerteViewSet, basename='alerte')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('accounts.urls')),
    path('api/stats/', StatsView.as_view(), name='stats'),
]
