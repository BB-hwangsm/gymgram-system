from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Member(models.Model):
    """헬스장 회원 모델"""
    
    GENDER_CHOICES = [
        ('M', '남성'),
        ('F', '여성'),
    ]
    
    # 기본 정보
    name = models.CharField(max_length=50, verbose_name='이름')
    phone = models.CharField(max_length=15, verbose_name='전화번호')
    email = models.EmailField(blank=True, verbose_name='이메일')
    gender = models.CharField(
        max_length=1, 
        choices=GENDER_CHOICES, 
        blank=True,
        verbose_name='성별'
    )
    birth_date = models.DateField(blank=True, null=True, verbose_name='생년월일')
    
    # 헬스장 관련 정보
    join_date = models.DateField(verbose_name='가입일')
    trainer = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        limit_choices_to={'user_type': 'trainer'},
        verbose_name='담당 트레이너'
    )
    
    # 운동 관련 정보
    goals = models.TextField(blank=True, verbose_name='운동 목표')
    health_notes = models.TextField(blank=True, verbose_name='건강 특이사항')
    emergency_contact = models.CharField(
        max_length=50, 
        blank=True, 
        verbose_name='비상연락처'
    )
    
    # 시스템 정보
    is_active = models.BooleanField(default=True, verbose_name='활성 상태')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='등록일')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일')
    
    class Meta:
        verbose_name = '회원'
        verbose_name_plural = '회원'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.name} ({self.phone})"
    
    @property
    def age(self):
        """나이 계산"""
        if self.birth_date:
            from datetime import date
            today = date.today()
            return today.year - self.birth_date.year - (
                (today.month, today.day) < (self.birth_date.month, self.birth_date.day)
            )
        return None


class Membership(models.Model):
    """회원권 모델"""
    
    MEMBERSHIP_TYPE_CHOICES = [
        ('daily', '일일권'),
        ('monthly', '월 회원권'),
        ('quarterly', '3개월 회원권'),
        ('yearly', '연간 회원권'),
        ('pt', 'PT 회원권'),
    ]
    
    member = models.ForeignKey(
        Member, 
        on_delete=models.CASCADE, 
        verbose_name='회원'
    )
    membership_type = models.CharField(
        max_length=20, 
        choices=MEMBERSHIP_TYPE_CHOICES,
        verbose_name='회원권 유형'
    )
    start_date = models.DateField(verbose_name='시작일')
    end_date = models.DateField(verbose_name='종료일')
    remaining_sessions = models.IntegerField(
        default=0, 
        verbose_name='남은 횟수'
    )  # PT 등에 사용
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=0, 
        verbose_name='가격'
    )
    is_active = models.BooleanField(default=True, verbose_name='활성 상태')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='등록일')
    
    class Meta:
        verbose_name = '회원권'
        verbose_name_plural = '회원권'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.member.name} - {self.get_membership_type_display()}"