// frontend/src/components/schedule/ScheduleForm.tsx

import React, { useState, useEffect } from 'react';
import { CreateScheduleData, User } from '../../types';
import { scheduleAPI, userAPI, apiUtils } from '../../services/api';
import { getCurrentTimeString } from '../../utils/dateUtils';

interface ScheduleFormProps {
  selectedDate: string;
  onScheduleAdded: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  selectedDate,
  onScheduleAdded
}) => {
  const [formData, setFormData] = useState<CreateScheduleData>({
    title: '',
    description: '',
    schedule_type: 'personal',
    date: selectedDate,
    start_time: getCurrentTimeString(),
    end_time: '',
    trainer: 0,
    max_participants: 1
  });

  const [trainers, setTrainers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // 트레이너 목록 로드
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const response = await userAPI.getTrainers();
        setTrainers(response.results);
        
        // 첫 번째 트레이너를 기본값으로 설정
        if (response.results.length > 0) {
          setFormData(prev => ({
            ...prev,
            trainer: response.results[0].id
          }));
        }
      } catch (err) {
        console.error('트레이너 로드 실패:', err);
      }
    };

    loadTrainers();
  }, []);

  // 선택된 날짜가 변경되면 폼의 날짜 업데이트
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: selectedDate
    }));
  }, [selectedDate]);

  // 시작 시간이 변경되면 종료 시간 자동 설정
  useEffect(() => {
    if (formData.start_time) {
      const [hours, minutes] = formData.start_time.split(':');
      const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
      setFormData(prev => ({
        ...prev,
        end_time: `${endHour}:${minutes}`
      }));
    }
  }, [formData.start_time]);

  // 스케줄 타입이 변경되면 최대 참여자 수 조정
  useEffect(() => {
    if (formData.schedule_type === 'personal' || formData.schedule_type === 'consultation') {
      setFormData(prev => ({
        ...prev,
        max_participants: 1
      }));
    } else if (formData.schedule_type === 'group') {
      setFormData(prev => ({
        ...prev,
        max_participants: 10
      }));
    }
  }, [formData.schedule_type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'trainer' || name === 'max_participants' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_time || !formData.end_time || !formData.trainer) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await scheduleAPI.createSchedule(formData);
      
      setSuccess('스케줄이 성공적으로 등록되었습니다!');
      
      // 폼 초기화
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        start_time: getCurrentTimeString(),
        end_time: ''
      }));
      
      onScheduleAdded();
      
      // 성공 메시지 3초 후 숨김
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(apiUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-form">
      <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>일정 등록</h3>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>선택된 날짜</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>시작 시간</label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>종료 시간</label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>일정 제목</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="예: 김철수 PT, 요가 클래스 등"
            required
          />
        </div>

        <div className="form-group">
          <label>일정 유형</label>
          <select
            name="schedule_type"
            value={formData.schedule_type}
            onChange={handleInputChange}
          >
            <option value="personal">개인 PT</option>
            <option value="group">그룹 수업</option>
            <option value="consultation">상담</option>
            <option value="other">기타</option>
          </select>
        </div>

        <div className="form-group">
          <label>담당 트레이너</label>
          <select
            name="trainer"
            value={formData.trainer}
            onChange={handleInputChange}
            required
          >
            <option value="">트레이너 선택</option>
            {trainers.map(trainer => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>최대 참여자 수</label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleInputChange}
            min="1"
            max="50"
            required
          />
        </div>

        <div className="form-group">
          <label>설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="일정에 대한 추가 설명"
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? '등록 중...' : '일정 등록'}
        </button>
      </form>
    </div>
  );
};

export default ScheduleForm;