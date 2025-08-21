# backend/gym_management/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Admin 사이트 제목 변경
admin.site.site_header = "💪 헬스장 관리 시스템"
admin.site.site_title = "헬스장 관리"
admin.site.index_title = "관리 대시보드에 오신 것을 환영합니다"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),  # API URLs 연결
]

# 개발 환경에서 미디어 파일 서빙
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)