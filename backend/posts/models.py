from django.db import models
from django.contrib.auth import get_user_model
from members.models import Member

User = get_user_model()

class Post(models.Model):
    """회원 기록 포스트 모델 (인스타그램 스타일)"""
    
    POST_TYPE_CHOICES = [
        ('workout', '운동 기록'),
        ('progress', '진행 상황'),
        ('note', '메모'),
    ]
    
    # 기본 정보
    member = models.ForeignKey(
        Member, 
        on_delete=models.CASCADE, 
        verbose_name='회원'
    )
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        verbose_name='작성자'
    )
    post_type = models.CharField(
        max_length=20, 
        choices=POST_TYPE_CHOICES,
        default='workout',
        verbose_name='포스트 유형'
    )
    
    # 내용
    content = models.TextField(verbose_name='내용')
    image = models.ImageField(
        upload_to='posts/%Y/%m/%d/', 
        blank=True, 
        null=True,
        verbose_name='첨부 이미지'
    )
    
    # 운동 관련 데이터 (선택적)
    workout_duration = models.IntegerField(
        blank=True, 
        null=True, 
        verbose_name='운동 시간(분)'
    )
    calories_burned = models.IntegerField(
        blank=True, 
        null=True, 
        verbose_name='소모 칼로리'
    )
    weight = models.DecimalField(
        max_digits=5, 
        decimal_places=1, 
        blank=True, 
        null=True,
        verbose_name='체중(kg)'
    )
    
    # 시스템 정보
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='작성일')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일')
    
    class Meta:
        verbose_name = '포스트'
        verbose_name_plural = '포스트'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.member.name} - {self.get_post_type_display()} ({self.created_at.strftime('%Y-%m-%d')})"


class PostComment(models.Model):
    """포스트 댓글 모델"""
    
    post = models.ForeignKey(
        Post, 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name='포스트'
    )
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        verbose_name='작성자'
    )
    content = models.TextField(verbose_name='댓글 내용')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='작성일')
    
    class Meta:
        verbose_name = '댓글'
        verbose_name_plural = '댓글'
        ordering = ['created_at']
        
    def __str__(self):
        return f"{self.author.username}: {self.content[:50]}"