# backend/members/admin.py

from django.contrib import admin
from .models import Member, Membership

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    """회원 Admin"""
    
    # 목록 페이지
    list_display = ('name', 'phone', 'gender', 'age', 'trainer', 'join_date', 'is_active')
    list_filter = ('gender', 'is_active', 'join_date', 'trainer')
    search_fields = ('name', 'phone', 'email')
    ordering = ('-created_at',)
    date_hierarchy = 'join_date'
    
    # 상세 페이지 필드 구성
    fieldsets = (
        ('기본 정보', {
            'fields': ('name', 'phone', 'email', 'gender', 'birth_date')
        }),
        ('헬스장 정보', {
            'fields': ('join_date', 'trainer', 'is_active')
        }),
        ('운동 정보', {
            'fields': ('goals', 'health_notes', 'emergency_contact'),
            'classes': ('collapse',)  # 접을 수 있는 섹션
        }),
        ('시스템 정보', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    # 필터 사이드바
    list_per_page = 25
    
    # 액션
    actions = ['activate_members', 'deactivate_members']
    
    def activate_members(self, request, queryset):
        """회원 활성화"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated}명의 회원이 활성화되었습니다.')
    activate_members.short_description = "선택된 회원 활성화"
    
    def deactivate_members(self, request, queryset):
        """회원 비활성화"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated}명의 회원이 비활성화되었습니다.')
    deactivate_members.short_description = "선택된 회원 비활성화"


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    """회원권 Admin"""
    
    list_display = ('member', 'membership_type', 'start_date', 'end_date', 'remaining_sessions', 'price', 'is_active')
    list_filter = ('membership_type', 'is_active', 'start_date')
    search_fields = ('member__name', 'member__phone')
    ordering = ('-created_at',)
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('회원권 정보', {
            'fields': ('member', 'membership_type', 'price')
        }),
        ('기간 정보', {
            'fields': ('start_date', 'end_date', 'remaining_sessions')
        }),
        ('상태', {
            'fields': ('is_active',)
        }),
        ('시스템 정보', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at',)
    
    # 인라인으로 회원 상세에서 회원권 보기
    class MembershipInline(admin.TabularInline):
        model = Membership
        extra = 0
        readonly_fields = ('created_at',)
    
# 회원 Admin에 인라인 추가
MemberAdmin.inlines = [MembershipAdmin.MembershipInline]