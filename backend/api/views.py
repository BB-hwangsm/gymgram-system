# backend/api/views.py

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny  # AllowAny 추가
from django.contrib.auth import get_user_model
from django.db.models import Q
from datetime import date, datetime

from members.models import Member, Membership
from schedules.models import Schedule
from posts.models import Post, PostComment
from .serializers import (
    UserSerializer, MemberSerializer, MemberListSerializer,
    MembershipSerializer, ScheduleSerializer, ScheduleListSerializer,
    PostSerializer, PostListSerializer, PostCommentSerializer
)

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """사용자(트레이너) API"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # 권한 변경
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'username']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        user_type = self.request.query_params.get('user_type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        return queryset


class MemberViewSet(viewsets.ModelViewSet):
    """회원 API"""
    queryset = Member.objects.select_related('trainer').all()
    permission_classes = [AllowAny]  # 권한 변경
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'phone', 'email']
    ordering_fields = ['created_at', 'name', 'join_date']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return MemberListSerializer
        return MemberSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 트레이너별 필터링
        trainer_id = self.request.query_params.get('trainer', None)
        if trainer_id:
            queryset = queryset.filter(trainer_id=trainer_id)
        
        # 활성 상태 필터링
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset

    @action(detail=True, methods=['get'])
    def posts(self, request, pk=None):
        """특정 회원의 포스트 목록"""
        member = self.get_object()
        posts = Post.objects.filter(member=member).order_by('-created_at')
        serializer = PostListSerializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def schedules(self, request, pk=None):
        """특정 회원의 스케줄 목록"""
        member = self.get_object()
        schedules = Schedule.objects.filter(members=member).order_by('-date', '-start_time')
        serializer = ScheduleListSerializer(schedules, many=True)
        return Response(serializer.data)


class MembershipViewSet(viewsets.ModelViewSet):
    """회원권 API"""
    queryset = Membership.objects.select_related('member').all()
    serializer_class = MembershipSerializer
    permission_classes = [AllowAny]  # 권한 변경
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['member__name', 'member__phone']
    ordering_fields = ['created_at', 'start_date', 'end_date']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 회원별 필터링
        member_id = self.request.query_params.get('member', None)
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        
        # 회원권 타입별 필터링
        membership_type = self.request.query_params.get('type', None)
        if membership_type:
            queryset = queryset.filter(membership_type=membership_type)
        
        # 활성 상태 필터링
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset


class ScheduleViewSet(viewsets.ModelViewSet):
    """스케줄 API"""
    queryset = Schedule.objects.select_related('trainer').prefetch_related('members').all()
    permission_classes = [AllowAny]  # 권한 변경
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'trainer__first_name', 'trainer__last_name']
    ordering_fields = ['date', 'start_time', 'created_at']
    ordering = ['date', 'start_time']

    def get_serializer_class(self):
        if self.action == 'list':
            return ScheduleListSerializer
        return ScheduleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 날짜별 필터링
        date_param = self.request.query_params.get('date', None)
        if date_param:
            try:
                filter_date = datetime.strptime(date_param, '%Y-%m-%d').date()
                queryset = queryset.filter(date=filter_date)
            except ValueError:
                pass
        
        # 월별 필터링
        month = self.request.query_params.get('month', None)
        year = self.request.query_params.get('year', None)
        if month and year:
            try:
                queryset = queryset.filter(date__year=int(year), date__month=int(month))
            except ValueError:
                pass
        
        # 트레이너별 필터링
        trainer_id = self.request.query_params.get('trainer', None)
        if trainer_id:
            queryset = queryset.filter(trainer_id=trainer_id)
        
        # 스케줄 타입별 필터링
        schedule_type = self.request.query_params.get('type', None)
        if schedule_type:
            queryset = queryset.filter(schedule_type=schedule_type)
        
        # 상태별 필터링
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset

    @action(detail=False, methods=['get'])
    def today(self, request):
        """오늘의 스케줄"""
        today = date.today()
        schedules = self.get_queryset().filter(date=today)
        serializer = self.get_serializer(schedules, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """다가오는 스케줄 (오늘 포함 7일)"""
        from datetime import timedelta
        end_date = date.today() + timedelta(days=7)
        schedules = self.get_queryset().filter(
            date__gte=date.today(),
            date__lte=end_date
        )
        serializer = self.get_serializer(schedules, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """스케줄 참여"""
        schedule = self.get_object()
        member_id = request.data.get('member_id')
        
        if not member_id:
            return Response({'error': '회원 ID가 필요합니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            return Response({'error': '회원을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        
        if not schedule.can_register():
            return Response({'error': '참여 인원이 가득 찼습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        schedule.members.add(member)
        return Response({'message': '스케줄에 등록되었습니다.'})


class PostViewSet(viewsets.ModelViewSet):
    """포스트 API"""
    queryset = Post.objects.select_related('member', 'author').prefetch_related('comments').all()
    permission_classes = [AllowAny]  # 권한 변경
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['content', 'member__name', 'author__first_name']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 회원별 필터링
        member_id = self.request.query_params.get('member', None)
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        
        # 포스트 타입별 필터링
        post_type = self.request.query_params.get('type', None)
        if post_type:
            queryset = queryset.filter(post_type=post_type)
        
        # 작성자별 필터링
        author_id = self.request.query_params.get('author', None)
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        
        return queryset

    def perform_create(self, serializer):
        """포스트 생성 시 작성자를 기본 사용자로 설정"""
        # 임시로 첫 번째 사용자를 작성자로 설정
        first_user = User.objects.first()
        if first_user:
            serializer.save(author=first_user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """포스트에 댓글 추가"""
        post = self.get_object()
        serializer = PostCommentSerializer(data=request.data)
        
        if serializer.is_valid():
            # 임시로 첫 번째 사용자를 작성자로 설정
            first_user = User.objects.first()
            if first_user:
                serializer.save(post=post, author=first_user)
            else:
                serializer.save(post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostCommentViewSet(viewsets.ModelViewSet):
    """댓글 API"""
    queryset = PostComment.objects.select_related('post', 'author').all()
    serializer_class = PostCommentSerializer
    permission_classes = [AllowAny]  # 권한 변경
    ordering = ['created_at']

    def perform_create(self, serializer):
        """댓글 생성 시 작성자를 기본 사용자로 설정"""
        # 임시로 첫 번째 사용자를 작성자로 설정
        first_user = User.objects.first()
        if first_user:
            serializer.save(author=first_user)
        else:
            serializer.save()