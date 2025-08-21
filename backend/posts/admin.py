# backend/posts/admin.py

from django.contrib import admin
from django.utils.html import format_html
from .models import Post, PostComment

class PostCommentInline(admin.TabularInline):
    """포스트 댓글 인라인"""
    model = PostComment
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """포스트 Admin"""
    
    # 목록 페이지
    list_display = ('member', 'post_type', 'content_preview', 'author', 'image_preview', 'created_at')
    list_filter = ('post_type', 'author', 'created_at')
    search_fields = ('member__name', 'content', 'author__username')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    # 상세 페이지 필드 구성
    fieldsets = (
        ('기본 정보', {
            'fields': ('member', 'author', 'post_type')
        }),
        ('내용', {
            'fields': ('content', 'image')
        }),
        ('운동 데이터', {
            'fields': ('workout_duration', 'calories_burned', 'weight'),
            'classes': ('collapse',),
            'description': '운동 관련 수치 데이터 (선택사항)'
        }),
        ('시스템 정보', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    inlines = [PostCommentInline]
    
    # 커스텀 메서드
    def content_preview(self, obj):
        """내용 미리보기"""
        if len(obj.content) > 50:
            return f"{obj.content[:50]}..."
        return obj.content
    content_preview.short_description = "내용 미리보기"
    
    def image_preview(self, obj):
        """이미지 미리보기"""
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 5px;"/>',
                obj.image.url
            )
        return "이미지 없음"
    image_preview.short_description = "이미지"
    
    # 필터링 최적화
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('member', 'author')


@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    """댓글 Admin"""
    
    list_display = ('post_preview', 'author', 'content_preview', 'created_at')
    list_filter = ('author', 'created_at')
    search_fields = ('content', 'author__username', 'post__member__name')
    ordering = ('-created_at',)
    
    def post_preview(self, obj):
        """포스트 미리보기"""
        return f"{obj.post.member.name} - {obj.post.get_post_type_display()}"
    post_preview.short_description = "포스트"
    
    def content_preview(self, obj):
        """댓글 내용 미리보기"""
        if len(obj.content) > 30:
            return f"{obj.content[:30]}..."
        return obj.content
    content_preview.short_description = "댓글 내용"