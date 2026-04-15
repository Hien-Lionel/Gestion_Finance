from django.contrib import admin
from .models import Dette

@admin.register(Dette)
class DetteAdmin(admin.ModelAdmin):
    list_display = ('montant', 'statut', 'date_echeance', 'user')
    list_filter = ('statut', 'date_echeance')
    search_fields = ('user__username',)
