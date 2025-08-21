// frontend/src/pages/SchedulePage.tsx

import React, { useState, useEffect } from 'react';
import Calendar from '../components/schedule/Calendar';
import ScheduleForm from '../components/schedule/ScheduleForm';
import MonthlySchedule from '../components/schedule/MonthlySchedule';
import { Schedule } from '../types';
import { scheduleAPI, apiUtils } from '../services/api';

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 스케줄 데이터 로드
  const loadSchedules = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const response = await scheduleAPI.getSchedules({
        year: year,
        month: month
      });
      
      setSchedules(response.results);
      setError('');
    } catch (err) {
      setError(apiUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, [currentDate]);

  // 스케줄 추가 성공 시 목록 새로고침
  const handleScheduleAdded = () => {
    loadSchedules();
  };

  // 월 변경
  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // 날짜 선택
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div>
        <div className="ig-card">
          <div className="ig-card-header">
            <h2 className="ig-card-title">📅 스케줄</h2>
          </div>
          <div className="ig-card-content">
            <div className="loading">스케줄을 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 스토리 스타일 퀵 액세스 */}
      <div className="ig-card mb-24">
        <div className="ig-card-content">
          <div className="story-container">
            <div className="story-item">
              <div className="story-avatar">
                <div className="story-avatar-inner">📅</div>
              </div>
              <div className="story-username">오늘 일정</div>
            </div>
            <div className="story-item">
              <div className="story-avatar">
                <div className="story-avatar-inner">➕</div>
              </div>
              <div className="story-username">일정 추가</div>
            </div>
            <div className="story-item">
              <div className="story-avatar">
                <div className="story-avatar-inner">📊</div>
              </div>
              <div className="story-username">통계</div>
            </div>
            <div className="story-item">
              <div className="story-avatar">
                <div className="story-avatar-inner">🏋️</div>
              </div>
              <div className="story-username">PT</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error mb-24">
          {error}
        </div>
      )}

      <div className="grid grid-2 gap-24">
        <div>
          <div className="ig-card">
            <div className="ig-card-header">
              <h3 className="ig-card-title">달력</h3>
              <div className="text-sm text-muted">
                {schedules.length}개의 일정
              </div>
            </div>
            <div className="ig-card-content" style={{ padding: 0 }}>
              <Calendar
                currentDate={currentDate}
                schedules={schedules}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onMonthChange={changeMonth}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="ig-card">
            <div className="ig-card-header">
              <h3 className="ig-card-title">새 일정</h3>
              <div className="text-sm text-muted">
                {new Date(selectedDate).toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="ig-card-content">
              <ScheduleForm
                selectedDate={selectedDate}
                onScheduleAdded={handleScheduleAdded}
              />
            </div>
          </div>
        </div>
      </div>

      <MonthlySchedule
        schedules={schedules}
        currentDate={currentDate}
      />
    </div>
  );
};

export default SchedulePage;