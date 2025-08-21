# backend/members/management/commands/create_test_data.py
# 먼저 폴더 구조를 만들어야 합니다:
# members/management/ 폴더 생성
# members/management/__init__.py 파일 생성
# members/management/commands/ 폴더 생성  
# members/management/commands/__init__.py 파일 생성

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from members.models import Member, Membership
from schedules.models import Schedule
from posts.models import Post
from datetime import date, datetime, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = '헬스장 관리 시스템 테스트 데이터 생성'

    def add_arguments(self, parser):
        parser.add_argument(
            '--members',
            type=int,
            default=10,
            help='생성할 회원 수 (기본값: 10)'
        )
        parser.add_argument(
            '--schedules',
            type=int,
            default=20,
            help='생성할 스케줄 수 (기본값: 20)'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🏋️‍♂️ 테스트 데이터 생성을 시작합니다...'))
        
        # 1. 트레이너 계정 생성
        self.create_trainers()
        
        # 2. 회원 생성
        members_count = options['members']
        self.create_members(members_count)
        
        # 3. 회원권 생성
        self.create_memberships()
        
        # 4. 스케줄 생성
        schedules_count = options['schedules']
        self.create_schedules(schedules_count)
        
        # 5. 포스트 생성
        self.create_posts()
        
        self.stdout.write(
            self.style.SUCCESS('✅ 테스트 데이터 생성이 완료되었습니다!')
        )

    def create_trainers(self):
        """트레이너 계정 생성"""
        trainers_data = [
            {
                'username': 'trainer1',
                'email': 'trainer1@gym.com',
                'first_name': '김',
                'last_name': '트레이너',
                'phone': '010-1234-5678',
                'user_type': 'trainer'
            },
            {
                'username': 'trainer2', 
                'email': 'trainer2@gym.com',
                'first_name': '이',
                'last_name': '트레이너',
                'phone': '010-2345-6789',
                'user_type': 'trainer'
            },
            {
                'username': 'admin1',
                'email': 'admin@gym.com', 
                'first_name': '박',
                'last_name': '관리자',
                'phone': '010-9999-0000',
                'user_type': 'admin'
            }
        ]
        
        for trainer_data in trainers_data:
            user, created = User.objects.get_or_create(
                username=trainer_data['username'],
                defaults=trainer_data
            )
            if created:
                user.set_password('trainer123!')
                user.save()
                self.stdout.write(f'✅ 트레이너 생성: {user.get_full_name()}')

    def create_members(self, count):
        """회원 생성"""
        first_names = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임']
        last_names = ['철수', '영희', '민수', '수지', '준호', '소영', '현우', '지은', '성민', '하늘']
        
        trainers = User.objects.filter(user_type='trainer')
        
        for i in range(count):
            name = f"{random.choice(first_names)}{random.choice(last_names)}"
            phone = f"010-{random.randint(1000, 9999)}-{random.randint(1000, 9999)}"
            
            # 가입일은 최근 6개월 내
            join_date = date.today() - timedelta(days=random.randint(1, 180))
            
            # 생년월일은 20-50세 범위
            birth_year = random.randint(1974, 2004)
            birth_date = date(birth_year, random.randint(1, 12), random.randint(1, 28))
            
            member_data = {
                'name': name,
                'phone': phone,
                'email': f'{name.lower()}@email.com',
                'gender': random.choice(['M', 'F']),
                'birth_date': birth_date,
                'join_date': join_date,
                'trainer': random.choice(trainers),
                'goals': random.choice([
                    '체중 감량 및 근력 증진',
                    '다이어트 및 체력 향상', 
                    '근력 운동 위주',
                    '유산소 운동 집중',
                    '전체적인 체력 향상',
                    '건강 관리'
                ]),
                'health_notes': random.choice([
                    '',
                    '무릎 부상 주의',
                    '허리 디스크 주의',
                    '고혈압 주의',
                    '당뇨 관리 중',
                    ''
                ])
            }
            
            member, created = Member.objects.get_or_create(
                phone=phone,
                defaults=member_data
            )
            
            if created:
                self.stdout.write(f'✅ 회원 생성: {member.name}')

    def create_memberships(self):
        """회원권 생성"""
        members = Member.objects.all()
        membership_types = ['monthly', 'quarterly', 'yearly', 'pt']
        
        for member in members:
            membership_type = random.choice(membership_types)
            
            # 시작일은 가입일 이후
            start_date = member.join_date + timedelta(days=random.randint(0, 30))
            
            # 회원권 기간 설정
            if membership_type == 'monthly':
                end_date = start_date + timedelta(days=30)
                price = 80000
                sessions = 0
            elif membership_type == 'quarterly':
                end_date = start_date + timedelta(days=90)
                price = 220000
                sessions = 0
            elif membership_type == 'yearly':
                end_date = start_date + timedelta(days=365)
                price = 800000
                sessions = 0
            else:  # pt
                end_date = start_date + timedelta(days=60)
                price = 600000
                sessions = random.randint(8, 20)
            
            Membership.objects.create(
                member=member,
                membership_type=membership_type,
                start_date=start_date,
                end_date=end_date,
                remaining_sessions=sessions,
                price=price
            )

    def create_schedules(self, count):
        """스케줄 생성"""
        trainers = User.objects.filter(user_type='trainer')
        members = list(Member.objects.all())
        
        schedule_types = ['personal', 'group', 'consultation']
        
        for i in range(count):
            # 날짜는 오늘부터 한 달 내
            schedule_date = date.today() + timedelta(days=random.randint(0, 30))
            
            # 시간은 9시-21시 사이
            start_hour = random.randint(9, 20)
            start_time = datetime.strptime(f"{start_hour}:00", "%H:%M").time()
            end_time = datetime.strptime(f"{start_hour + 1}:00", "%H:%M").time()
            
            schedule_type = random.choice(schedule_types)
            
            if schedule_type == 'personal':
                title = "개인 PT"
                max_participants = 1
            elif schedule_type == 'group':
                title = random.choice(['요가 클래스', '필라테스', '크로스핏', '바디펌프'])
                max_participants = random.randint(5, 15)
            else:
                title = "회원 상담"
                max_participants = 1
            
            schedule = Schedule.objects.create(
                title=title,
                description=f"{title} 수업입니다.",
                schedule_type=schedule_type,
                date=schedule_date,
                start_time=start_time,
                end_time=end_time,
                trainer=random.choice(trainers),
                max_participants=max_participants,
                status=random.choice(['scheduled', 'completed'])
            )
            
            # 참여 회원 추가 (그룹 수업의 경우)
            if schedule_type == 'group':
                participants = random.sample(members, min(random.randint(3, 8), len(members)))
                schedule.members.set(participants)
            elif schedule_type == 'personal':
                if members:
                    schedule.members.add(random.choice(members))

    def create_posts(self):
        """포스트 생성"""
        members = Member.objects.all()
        trainers = User.objects.filter(user_type='trainer')
        
        post_contents = [
            "오늘 스쿼트 10kg 증가! 💪",
            "30분 유산소 완료. 체중 1kg 감량 성공!",
            "벤치프레스 개인 기록 갱신했습니다.",
            "요가 수업 후 몸이 한결 가벼워요.",
            "오늘은 하체 운동에 집중했습니다.",
            "데드리프트 자세 교정 완료!",
            "유산소 운동으로 체력이 많이 늘었어요.",
            "근력 운동 후 단백질 섭취 잘 하고 있습니다."
        ]
        
        for member in members:
            # 회원당 1-5개의 포스트 생성
            post_count = random.randint(1, 5)
            
            for _ in range(post_count):
                post_date = member.join_date + timedelta(
                    days=random.randint(1, (date.today() - member.join_date).days or 1)
                )
                
                Post.objects.create(
                    member=member,
                    author=member.trainer or random.choice(trainers),
                    post_type=random.choice(['workout', 'progress', 'note']),
                    content=random.choice(post_contents),
                    workout_duration=random.randint(30, 120) if random.choice([True, False]) else None,
                    calories_burned=random.randint(200, 600) if random.choice([True, False]) else None,
                    weight=round(random.uniform(50, 90), 1) if random.choice([True, False]) else None,
                    created_at=datetime.combine(post_date, datetime.now().time())
                )