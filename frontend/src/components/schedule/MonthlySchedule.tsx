// frontend/src/components/schedule/MonthlySchedule.tsx

import React from 'react';
import { Schedule } from '../../types';
import { formatTime } from '../../utils/dateUtils';
import './MonthlySchedule.css';

interface MonthlyScheduleProps {
  schedules: Schedule[];
  currentDate: Date;
}

const MonthlySchedule: React.FC<MonthlyScheduleProps> = ({
  schedules,
  currentDate
}) => {
  // 스케줄 통계 계산
  const getTotalEvents = () => schedules.length;
  const getPersonalCount = () => schedules.filter(s => s.schedule_type === 'personal').length;
  const getGroupCount = () => schedules.filter(s => s.schedule_type === 'group').length;
  const getConsultationCount = () => schedules.filter(s => s.schedule_type === 'consultation').length;

  // 날짜별로 스케줄 그룹화
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const date = schedule.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  // 날짜순으로 정렬
  const sortedDates = Object.keys(groupedSchedules).sort();

  const getScheduleTypeLabel = (type: string): string => {
    switch (type) {
      case 'personal': return '개인 PT';
      case 'group': return '그룹 수업';
      case 'consultation': return '상담';
      default: return '기타';
    }
  };

  const getScheduleTypeClass = (type: string): string => {
    switch (type) {
      case 'personal': return 'event-type-personal';
      case 'group': return 'event-type-group';
      case 'consultation': return 'event-type-consultation';
      default: return 'event-type-other';
    }
  };

  return (
    <div className="monthly-schedule">
      <h3 className="monthly-schedule-title">
        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 일정 요약
      </h3>
      
      {/* 통계 카드 */}
      <div className="schedule-summary">
        <div className="summary-card">
          <div className="summary-number">{getTotalEvents()}</div>
          <div className="summary-label">총 일정</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{getPersonalCount()}</div>
          <div className="summary-label">개인 PT</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{getGroupCount()}</div>
          <div className="summary-label">그룹 수업</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{getConsultationCount()}</div>
          <div className="summary-label">상담</div>
        </div>
      </div>

      {/* 월별 일정 목록 */}
      <div className="monthly-events">
        {sortedDates.length === 0 ? (
          <p className="empty-events">
            이번 달에 등록된 일정이 없습니다.
          </p>
        ) : (
          sortedDates.map(date => {
            const daySchedules = groupedSchedules[date].sort((a, b) => 
              a.start_time.localeCompare(b.start_time)
            );
            const dateObj = new Date(date);
            const dayName = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
            const formattedDate = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${dayName})`;

            return (
              <div key={date} className="date-group">
                <div className="date-header">{formattedDate}</div>
                {daySchedules.map(schedule => (
                  <div key={schedule.id} className="event-item">
                    <div className="event-header">
                      <div className="event-time">{formatTime(schedule.start_time)}</div>
                      <div className={`event-type-badge ${getScheduleTypeClass(schedule.schedule_type)}`}>
                        {getScheduleTypeLabel(schedule.schedule_type)}
                      </div>
                    </div>
                    <div className="event-title">{schedule.title}</div>
                    <div className="event-details">
                      <span className="event-trainer">담당: {schedule.trainer_name}</span>
                      <span className="event-participants">
                        참여자: {schedule.participant_count}/{schedule.max_participants}명
                      </span>
                    </div>
                    {schedule.description && (
                      <div className="event-description">{schedule.description}</div>
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MonthlySchedule;