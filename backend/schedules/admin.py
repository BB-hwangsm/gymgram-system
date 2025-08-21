# backend/schedules/admin.py

from django.contrib import admin
from .models import Schedule

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    """스케줄 Admin"""
    
    # 목록 페이지
    list_display = ('title', 'schedule_type', 'date', 'start_time', 'end_time', 'trainer', 'participant_count', 'status')
    list_filter = ('schedule_type', 'status', 'date', 'trainer')
    search_fields = ('title', 'description', 'trainer__username', 'members__name')
    ordering = ('-date', '-start_time')
    date_hierarchy = 'date'
    
    # 상세 페이지 필드 구성
    fieldsets = (
        ('기본 정보', {
            'fields': ('title', 'description', 'schedule_type')
        }),
        ('시간 정보', {
            'fields': ('date', 'start_time', 'end_time')
        }),
        ('담당자 및 참여자', {
            'fields': ('trainer', 'members', 'max_participants')
        }),
        ('상태', {
            'fields': ('status',)
        }),
        ('시스템 정보', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    # Many-to-Many 필드 위젯
    filter_horizontal = ('members',)  # 회원 선택을 더 편하게
    
    # 목록에서 바로 편집 가능한 필드
    list_editable = ('status',)
    
    # 액션
    actions = ['mark_completed', 'mark_cancelled']
    
    def mark_completed(self, request, queryset):
        """완료로 상태 변경"""
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated}개의 일정이 완료로 변경되었습니다.')
    mark_completed.short_description = "선택된 일정을 완료로 변경"
    
    def mark_cancelled(self, request, queryset):
        """취소로 상태 변경"""
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated}개의 일정이 취소로 변경되었습니다.')
    mark_cancelled.short_description = "선택된 일정을 취소로 변경"
    
    # 커스텀 메서드를 Admin에서 표시
    def participant_count(self, obj):
        """참여자 수 표시"""
        return f"{obj.participant_count}/{obj.max_participants}"
    participant_count.short_description = "참여자 수"
    
    # 날짜별로 그룹화해서 보기
    def get_queryset(self, request):
        """쿼리셋 최적화"""
        return super().get_queryset(request).select_related('trainer').prefetch_related('members')