# backend/api/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from members.models import Member, Membership
from schedules.models import Schedule
from posts.models import Post, PostComment

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """사용자 시리얼라이저"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 
                 'user_type', 'phone', 'profile_image', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class MemberSerializer(serializers.ModelSerializer):
    """회원 시리얼라이저"""
    trainer_name = serializers.CharField(source='trainer.get_full_name', read_only=True)
    age = serializers.ReadOnlyField()
    
    class Meta:
        model = Member
        fields = ['id', 'name', 'phone', 'email', 'gender', 'birth_date', 'age',
                 'join_date', 'trainer', 'trainer_name', 'goals', 'health_notes',
                 'emergency_contact', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class MembershipSerializer(serializers.ModelSerializer):
    """회원권 시리얼라이저"""
    member_name = serializers.CharField(source='member.name', read_only=True)
    membership_type_display = serializers.CharField(source='get_membership_type_display', read_only=True)
    
    class Meta:
        model = Membership
        fields = ['id', 'member', 'member_name', 'membership_type', 'membership_type_display',
                 'start_date', 'end_date', 'remaining_sessions', 'price', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class ScheduleSerializer(serializers.ModelSerializer):
    """스케줄 시리얼라이저"""
    trainer_name = serializers.CharField(source='trainer.get_full_name', read_only=True)
    members_detail = MemberSerializer(source='members', many=True, read_only=True)
    participant_count = serializers.ReadOnlyField()
    duration = serializers.ReadOnlyField()
    can_register = serializers.ReadOnlyField()
    schedule_type_display = serializers.CharField(source='get_schedule_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Schedule
        fields = ['id', 'title', 'description', 'schedule_type', 'schedule_type_display',
                 'date', 'start_time', 'end_time', 'duration', 'trainer', 'trainer_name',
                 'members', 'members_detail', 'participant_count', 'max_participants',
                 'can_register', 'status', 'status_display', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PostCommentSerializer(serializers.ModelSerializer):
    """댓글 시리얼라이저"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = PostComment
        fields = ['id', 'author', 'author_name', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    """포스트 시리얼라이저"""
    member_name = serializers.CharField(source='member.name', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    post_type_display = serializers.CharField(source='get_post_type_display', read_only=True)
    comments = PostCommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'member', 'member_name', 'author', 'author_name', 'post_type', 
                 'post_type_display', 'content', 'image', 'workout_duration', 
                 'calories_burned', 'weight', 'comments', 'comments_count',
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_comments_count(self, obj):
        return obj.comments.count()


# 간단한 리스트용 시리얼라이저들
class MemberListSerializer(serializers.ModelSerializer):
    """회원 목록용 간단한 시리얼라이저"""
    trainer_name = serializers.CharField(source='trainer.get_full_name', read_only=True)
    
    class Meta:
        model = Member
        fields = ['id', 'name', 'phone', 'trainer_name', 'join_date', 'is_active']


class ScheduleListSerializer(serializers.ModelSerializer):
    """스케줄 목록용 간단한 시리얼라이저"""
    trainer_name = serializers.CharField(source='trainer.get_full_name', read_only=True)
    participant_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Schedule
        fields = ['id', 'title', 'schedule_type', 'date', 'start_time', 'end_time',
                 'trainer_name', 'participant_count', 'max_participants', 'status']


class PostListSerializer(serializers.ModelSerializer):
    """포스트 목록용 간단한 시리얼라이저"""
    member_name = serializers.CharField(source='member.name', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'member_name', 'author_name', 'post_type', 'content', 'created_at']