# backend/accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """커스텀 사용자 Admin"""
    
    # 목록 페이지에서 보여질 필드
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'phone', 'is_active', 'created_at')
    list_filter = ('user_type', 'is_active', 'is_staff', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    ordering = ('-created_at',)
    
    # 상세 페이지 필드 구성
    fieldsets = UserAdmin.fieldsets + (
        ('추가 정보', {
            'fields': ('user_type', 'phone', 'profile_image', 'created_at')
        }),
    )
    
    # 읽기 전용 필드
    readonly_fields = ('created_at',)
    
    # 새 사용자 추가 시 필드
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('추가 정보', {
            'fields': ('user_type', 'phone', 'email', 'first_name', 'last_name')
        }),
    )