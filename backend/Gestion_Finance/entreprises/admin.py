from django.contrib import admin
from .models import Entreprise

@admin.register(Entreprise)
class EntrepriseAdmin(admin.ModelAdmin):
    list_display = ('nom', 'code_entreprise', 'domaine', 'date_creation', 'user')
    search_fields = ('nom', 'code_entreprise', 'user__username')
    list_filter = ('date_creation',)
