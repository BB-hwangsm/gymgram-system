from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """커스텀 사용자 모델 (트레이너, 관리자)"""
    
    USER_TYPE_CHOICES = [
        ('admin', '관리자'),
        ('trainer', '트레이너'),
    ]
    
    user_type = models.CharField(
        max_length=10, 
        choices=USER_TYPE_CHOICES, 
        default='trainer',
        verbose_name='사용자 유형'
    )
    phone = models.CharField(
        max_length=15, 
        blank=True, 
        verbose_name='전화번호'
    )
    profile_image = models.ImageField(
        upload_to='profiles/', 
        blank=True, 
        null=True,
        verbose_name='프로필 이미지'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='가입일'
    )
    
    class Meta:
        verbose_name = '사용자'
        verbose_name_plural = '사용자'
        
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"