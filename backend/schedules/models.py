from django.db import models
from django.contrib.auth import get_user_model
from members.models import Member

User = get_user_model()

class Schedule(models.Model):
    """스케줄 모델"""
    
    SCHEDULE_TYPE_CHOICES = [
        ('personal', '개인 PT'),
        ('group', '그룹 수업'),
        ('consultation', '상담'),
        ('other', '기타'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', '예약됨'),
        ('completed', '완료'),
        ('cancelled', '취소'),
        ('no_show', '노쇼'),
    ]
    
    # 기본 정보
    title = models.CharField(max_length=100, verbose_name='일정 제목')
    description = models.TextField(blank=True, verbose_name='설명')
    schedule_type = models.CharField(
        max_length=20, 
        choices=SCHEDULE_TYPE_CHOICES,
        default='personal',
        verbose_name='일정 유형'
    )
    
    # 시간 정보
    date = models.DateField(verbose_name='날짜')
    start_time = models.TimeField(verbose_name='시작 시간')
    end_time = models.TimeField(verbose_name='종료 시간')
    
    # 관계 정보
    trainer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'trainer'},
        verbose_name='담당 트레이너'
    )
    members = models.ManyToManyField(
        Member, 
        blank=True,
        verbose_name='참여 회원'
    )
    
    # 상태 정보
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES,
        default='scheduled',
        verbose_name='상태'
    )
    max_participants = models.IntegerField(
        default=1, 
        verbose_name='최대 참여자 수'
    )
    
    # 시스템 정보
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='등록일')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일')
    
    class Meta:
        verbose_name = '스케줄'
        verbose_name_plural = '스케줄'
        ordering = ['date', 'start_time']
        
    def __str__(self):
        return f"{self.title} - {self.date} {self.start_time}"
    
    @property
    def duration(self):
        """운동 시간 계산 (분)"""
        from datetime import datetime, timedelta
        start = datetime.combine(self.date, self.start_time)
        end = datetime.combine(self.date, self.end_time)
        return int((end - start).total_seconds() / 60)
    
    @property
    def participant_count(self):
        """현재 참여자 수"""
        return self.members.count()
    
    def can_register(self):
        """등록 가능 여부"""
        return self.participant_count < self.max_participants