from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PasswordResetCode

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'entreprise', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active', 'entreprise')
    fieldsets = UserAdmin.fieldsets + (
        ('Informations Supplémentaires', {'fields': ('role', 'telephone', 'entreprise')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informations Supplémentaires', {'fields': ('role', 'telephone', 'entreprise')}),
    )

@admin.register(PasswordResetCode)
class PasswordResetCodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'created_at')
    search_fields = ('user__username', 'user__email')
