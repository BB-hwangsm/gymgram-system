// frontend/src/services/api.ts

import axios, { AxiosInstance } from 'axios';
import { 
  User, Member, Membership, Schedule, Post, PostComment,
  ApiResponse, CreateMemberData, CreateScheduleData, CreatePostData 
} from '../types';

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // 로그인 페이지로 리다이렉트하는 대신 콘솔에 로그만 출력
      console.log('Authentication required');
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/token/', { username, password });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
  },
};

// 사용자 관련 API
export const userAPI = {
  getUsers: async (params?: any): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/', { params });
    return response.data;
  },
  
  getUser: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },
  
  getTrainers: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/', { 
      params: { user_type: 'trainer' } 
    });
    return response.data;
  },
};

// 회원 관련 API
export const memberAPI = {
  getMembers: async (params?: any): Promise<ApiResponse<Member>> => {
    const response = await api.get('/members/', { params });
    return response.data;
  },
  
  getMember: async (id: number): Promise<Member> => {
    const response = await api.get(`/members/${id}/`);
    return response.data;
  },
  
  createMember: async (data: CreateMemberData): Promise<Member> => {
    const response = await api.post('/members/', data);
    return response.data;
  },
  
  updateMember: async (id: number, data: Partial<CreateMemberData>): Promise<Member> => {
    const response = await api.patch(`/members/${id}/`, data);
    return response.data;
  },
  
  deleteMember: async (id: number): Promise<void> => {
    await api.delete(`/members/${id}/`);
  },
  
  getMemberPosts: async (id: number): Promise<Post[]> => {
    const response = await api.get(`/members/${id}/posts/`);
    return response.data;
  },
  
  getMemberSchedules: async (id: number): Promise<Schedule[]> => {
    const response = await api.get(`/members/${id}/schedules/`);
    return response.data;
  },
};

// 회원권 관련 API
export const membershipAPI = {
  getMemberships: async (params?: any): Promise<ApiResponse<Membership>> => {
    const response = await api.get('/memberships/', { params });
    return response.data;
  },
  
  createMembership: async (data: any): Promise<Membership> => {
    const response = await api.post('/memberships/', data);
    return response.data;
  },
};

// 스케줄 관련 API
export const scheduleAPI = {
  getSchedules: async (params?: any): Promise<ApiResponse<Schedule>> => {
    const response = await api.get('/schedules/', { params });
    return response.data;
  },
  
  getSchedule: async (id: number): Promise<Schedule> => {
    const response = await api.get(`/schedules/${id}/`);
    return response.data;
  },
  
  createSchedule: async (data: CreateScheduleData): Promise<Schedule> => {
    const response = await api.post('/schedules/', data);
    return response.data;
  },
  
  updateSchedule: async (id: number, data: Partial<CreateScheduleData>): Promise<Schedule> => {
    const response = await api.patch(`/schedules/${id}/`, data);
    return response.data;
  },
  
  deleteSchedule: async (id: number): Promise<void> => {
    await api.delete(`/schedules/${id}/`);
  },
  
  getTodaySchedules: async (): Promise<Schedule[]> => {
    const response = await api.get('/schedules/today/');
    return response.data;
  },
  
  getUpcomingSchedules: async (): Promise<Schedule[]> => {
    const response = await api.get('/schedules/upcoming/');
    return response.data;
  },
  
  joinSchedule: async (id: number, memberId: number): Promise<any> => {
    const response = await api.post(`/schedules/${id}/join/`, { member_id: memberId });
    return response.data;
  },
};

// 포스트 관련 API
export const postAPI = {
  getPosts: async (params?: any): Promise<ApiResponse<Post>> => {
    const response = await api.get('/posts/', { params });
    return response.data;
  },
  
  getPost: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  },
  
  createPost: async (data: CreatePostData): Promise<Post> => {
    const formData = new FormData();
    
    // 텍스트 데이터 추가
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    const response = await api.post('/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updatePost: async (id: number, data: Partial<CreatePostData>): Promise<Post> => {
    const response = await api.patch(`/posts/${id}/`, data);
    return response.data;
  },
  
  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}/`);
  },
  
  addComment: async (postId: number, content: string): Promise<PostComment> => {
    const response = await api.post(`/posts/${postId}/add_comment/`, { content });
    return response.data;
  },
};

// 댓글 관련 API
export const commentAPI = {
  deleteComment: async (id: number): Promise<void> => {
    await api.delete(`/comments/${id}/`);
  },
};

// 유틸리티 함수들
export const apiUtils = {
  // 에러 메시지 추출
  getErrorMessage: (error: any): string => {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return '알 수 없는 오류가 발생했습니다.';
  },
  
  // 이미지 URL 완성
  getImageUrl: (imagePath?: string): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  },
};

export default api;