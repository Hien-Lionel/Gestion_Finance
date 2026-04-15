from django.contrib import admin
from .models import Alerte

@admin.register(Alerte)
class AlerteAdmin(admin.ModelAdmin):
    list_display = ('message', 'date', 'user')
    list_filter = ('date',)
    search_fields = ('user__username', 'message')
