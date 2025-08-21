# backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import views

# DRF Router 설정
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'members', views.MemberViewSet)
router.register(r'memberships', views.MembershipViewSet)
router.register(r'schedules', views.ScheduleViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'comments', views.PostCommentViewSet)

urlpatterns = [
    # API 루트
    path('api/', include(router.urls)),
    
    # 인증 관련
    path('api/auth/token/', obtain_auth_token, name='api_token_auth'),
    path('api/auth/', include('rest_framework.urls')),  # DRF 기본 인증 페이지
]