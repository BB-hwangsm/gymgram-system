// frontend/src/types/index.ts

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    user_type: 'admin' | 'trainer';
    phone: string;
    profile_image?: string;
    created_at: string;
  }
  
  export interface Member {
    id: number;
    name: string;
    phone: string;
    email: string;
    gender: 'M' | 'F' | '';
    birth_date?: string;
    age?: number;
    join_date: string;
    trainer?: number;
    trainer_name?: string;
    goals: string;
    health_notes: string;
    emergency_contact: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface Membership {
    id: number;
    member: number;
    member_name: string;
    membership_type: 'daily' | 'monthly' | 'quarterly' | 'yearly' | 'pt';
    membership_type_display: string;
    start_date: string;
    end_date: string;
    remaining_sessions: number;
    price: number;
    is_active: boolean;
    created_at: string;
  }
  
  export interface Schedule {
    id: number;
    title: string;
    description: string;
    schedule_type: 'personal' | 'group' | 'consultation' | 'other';
    schedule_type_display: string;
    date: string;
    start_time: string;
    end_time: string;
    duration: number;
    trainer: number;
    trainer_name: string;
    members: number[];
    members_detail: Member[];
    participant_count: number;
    max_participants: number;
    can_register: boolean;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    status_display: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Post {
    id: number;
    member: number;
    member_name: string;
    author: number;
    author_name: string;
    post_type: 'workout' | 'progress' | 'note';
    post_type_display: string;
    content: string;
    image?: string;
    workout_duration?: number;
    calories_burned?: number;
    weight?: number;
    comments: PostComment[];
    comments_count: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface PostComment {
    id: number;
    author: number;
    author_name: string;
    content: string;
    created_at: string;
  }
  
  // API 응답 타입들
  export interface ApiResponse<T> {
    count: number;
    next?: string;
    previous?: string;
    results: T[];
  }
  
  export interface ApiError {
    detail?: string;
    error?: string;
    [key: string]: any;
  }
  
  // 폼 데이터 타입들
  export interface CreateMemberData {
    name: string;
    phone: string;
    email?: string;
    gender?: 'M' | 'F';
    birth_date?: string;
    join_date: string;
    trainer?: number;
    goals?: string;
    health_notes?: string;
    emergency_contact?: string;
  }
  
  export interface CreateScheduleData {
    title: string;
    description?: string;
    schedule_type: 'personal' | 'group' | 'consultation' | 'other';
    date: string;
    start_time: string;
    end_time: string;
    trainer: number;
    members?: number[];
    max_participants: number;
  }
  
  export interface CreatePostData {
    member: number;
    post_type: 'workout' | 'progress' | 'note';
    content: string;
    image?: File;
    workout_duration?: number;
    calories_burned?: number;
    weight?: number;
  }