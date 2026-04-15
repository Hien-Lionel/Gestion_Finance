from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('montant', 'type', 'categorie', 'date', 'user')
    list_filter = ('type', 'date', 'categorie')
    search_fields = ('user__username',)
