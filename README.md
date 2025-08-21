# 🏋️‍♂️ GymGram - Instagram Style Gym Management System

> 인스타그램 스타일의 현대적인 헬스장 회원 관리 시스템

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://github.com/BB-hwangsm/gymgram-system)
[![Backend](https://img.shields.io/badge/Backend-Django-green)](https://github.com/BB-hwangsm/gymgram-system)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](https://github.com/BB-hwangsm/gymgram-system)
[![Style](https://img.shields.io/badge/Style-Instagram-ff69b4)](https://github.com/BB-hwangsm/gymgram-system)

## 📱 프로젝트 소개

GymGram은 인스타그램의 세련된 UI/UX를 헬스장 관리 시스템에 적용한 혁신적인 웹 애플리케이션입니다. 
트레이너와 회원들이 직관적이고 친숙한 인터페이스를 통해 소통하고 관리할 수 있도록 설계되었습니다.

### ✨ 주요 특징

- 🎨 **Instagram-Inspired Design**: 친숙하고 세련된 인스타그램 스타일 UI
- 📅 **Schedule Management**: 직관적인 달력 뷰로 일정 관리
- 👥 **Member Feed System**: 회원별 인스타그램 스타일 피드
- 📊 **Analytics Dashboard**: 월별 통계 및 현황 분석
- 📱 **Responsive Design**: 모바일 친화적 반응형 디자인
- 🔄 **Real-time Updates**: 실시간 데이터 동기화

## 🚀 기술 스택

### Backend
- **Django 4.2**: 안정적인 웹 프레임워크
- **Django REST Framework**: RESTful API 개발
- **SQLite**: 개발용 데이터베이스 (PostgreSQL 배포 준비)
- **Token Authentication**: 보안 인증 시스템

### Frontend  
- **React 18**: 모던 프론트엔드 라이브러리
- **TypeScript**: 타입 안전성 및 개발 효율성
- **Custom CSS**: 인스타그램 스타일 커스텀 디자인
- **Axios**: HTTP 클라이언트

### Development Tools
- **Git**: 버전 관리
- **VS Code/Cursor**: 개발 환경
- **Node.js**: 프론트엔드 빌드 도구

## 🎯 핵심 기능

### 📅 스케줄 관리
- **달력 뷰**: 월별 일정을 한눈에 확인
- **일정 등록**: 개인 PT, 그룹 수업, 상담 등 다양한 일정 유형
- **트레이너 배정**: 담당 트레이너 자동 배정
- **실시간 업데이트**: 일정 변경 시 즉시 반영

### 👥 회원 관리  
- **인스타그램 스타일 프로필**: 회원별 개성있는 프로필
- **피드 시스템**: 운동 기록, 진행 상황을 포스트 형태로 관리
- **사진 업로드**: 운동 전후 사진, 성과 인증샷 등
- **회원 통계**: 가입일, 출석률, 운동 기록 분석

### 📊 분석 및 통계
- **월별 일정 요약**: 개인 PT, 그룹 수업, 상담 건수 통계
- **회원 현황**: 신규 가입, 활성 회원, 휴면 회원 분석
- **트렌드 분석**: 인기 운동 시간대, 프로그램 선호도

## 🛠️ 설치 및 실행

### 사전 요구사항
- Python 3.8+
- Node.js 16+
- Git

### Backend 설정
```bash
# 저장소 클론
git clone https://github.com/BB-hwangsm/gymgram-system.git
cd gymgram-system

# 백엔드 설정
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux  
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 데이터베이스 마이그레이션
python manage.py migrate

# 슈퍼유저 생성
python manage.py createsuperuser

# 테스트 데이터 생성 (선택사항)
python manage.py create_test_data

# 서버 실행
python manage.py runserver
```

### Frontend 설정
```bash
# 새 터미널에서
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 접속
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

## 📂 프로젝트 구조

```
gymgram-system/
├── backend/                    # Django 백엔드
│   ├── gym_management/        # 메인 프로젝트 설정
│   ├── accounts/              # 사용자 관리
│   ├── members/               # 회원 관리
│   ├── schedules/             # 스케줄 관리
│   ├── posts/                 # 포스트/피드 관리
│   └── api/                   # API 엔드포인트
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── components/        # 재사용 컴포넌트
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── services/          # API 서비스
│   │   ├── types/             # TypeScript 타입
│   │   ├── utils/             # 유틸리티 함수
│   │   └── styles/            # 스타일 파일
│   └── public/                # 정적 파일
└── README.md                   # 프로젝트 문서
```

## 🎨 UI/UX 디자인

### 디자인 철학
- **Familiar Interface**: 인스타그램의 친숙한 UI 패턴 활용
- **Visual Hierarchy**: 중요한 정보를 시각적으로 강조
- **Consistent Branding**: 일관된 컬러 팔레트와 타이포그래피
- **Mobile First**: 모바일 우선 반응형 디자인

### 컬러 팔레트
- **Primary Blue**: #0095f6 (인스타그램 블루)
- **Text Dark**: #262626 (메인 텍스트)
- **Text Muted**: #8e8e8e (보조 텍스트)
- **Background**: #fafafa (배경)
- **Gradient**: Instagram 브랜드 그라디언트

## 🔮 향후 계획

### Phase 1: 기능 확장
- [ ] 회원권 관리 시스템
- [ ] 결제 시스템 연동
- [ ] 실시간 알림 기능
- [ ] 채팅 시스템

### Phase 2: 배포 및 최적화  
- [ ] Railway/Vercel 배포
- [ ] PostgreSQL 마이그레이션
- [ ] CDN 연동
- [ ] 성능 최적화

### Phase 3: 고도화
- [ ] 모바일 앱 (React Native)
- [ ] 다중 헬스장 지원
- [ ] AI 기반 운동 추천
- [ ] 웨어러블 기기 연동

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

**Developer**: hwangsm  
**Email**: [이메일 주소]  
**GitHub**: [@BB-hwangsm](https://github.com/BB-hwangsm)  
**Project Link**: [https://github.com/BB-hwangsm/gymgram-system](https://github.com/BB-hwangsm/gymgram-system)

---

⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!