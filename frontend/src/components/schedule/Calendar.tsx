// frontend/src/components/schedule/Calendar.tsx

import React from 'react';
import { Schedule } from '../../types';
import { generateCalendar, KOREAN_DAYS, KOREAN_MONTHS } from '../../utils/dateUtils';
import './Calendar.css';

interface CalendarProps {
  currentDate: Date;
  schedules: Schedule[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onMonthChange: (direction: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  schedules,
  selectedDate,
  onDateSelect,
  onMonthChange
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendar = generateCalendar(year, month);

  // 특정 날짜의 스케줄 가져오기
  const getSchedulesForDate = (date: Date): Schedule[] => {
    const dateString = date.toISOString().split('T')[0];
    return schedules.filter(schedule => schedule.date === dateString);
  };

  // 스케줄 유형별 CSS 클래스
  const getScheduleClass = (scheduleType: string): string => {
    switch (scheduleType) {
      case 'personal': return 'calendar-event personal';
      case 'group': return 'calendar-event group';
      case 'consultation': return 'calendar-event consultation';
      default: return 'calendar-event other';
    }
  };

  const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      const dateString = date.toISOString().split('T')[0];
      onDateSelect(dateString);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button 
          className="calendar-nav" 
          onClick={() => onMonthChange(-1)}
        >
          ◀ 이전
        </button>
        <div className="calendar-title">
          {year}년 {KOREAN_MONTHS[month]}
        </div>
        <button 
          className="calendar-nav" 
          onClick={() => onMonthChange(1)}
        >
          다음 ▶
        </button>
      </div>

      <div className="calendar-grid">
        {/* 요일 헤더 */}
        {KOREAN_DAYS.map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {/* 날짜 칸들 */}
        {calendar.map((dateInfo, index) => {
          const daySchedules = getSchedulesForDate(dateInfo.date);
          const dateString = dateInfo.date.toISOString().split('T')[0];
          const isSelected = dateString === selectedDate;

          let dayClasses = 'calendar-day';
          if (!dateInfo.isCurrentMonth) dayClasses += ' other-month';
          if (dateInfo.isToday) dayClasses += ' today';
          if (isSelected && dateInfo.isCurrentMonth) dayClasses += ' selected';
          if (daySchedules.length > 0) dayClasses += ' has-event';

          return (
            <div
              key={index}
              className={dayClasses}
              onClick={() => handleDateClick(dateInfo.date, dateInfo.isCurrentMonth)}
            >
              <div className="calendar-day-number">{dateInfo.day}</div>
              
              {/* 스케줄 표시 (최대 3개) */}
              {daySchedules.slice(0, 3).map((schedule, idx) => (
                <div
                  key={schedule.id}
                  className={getScheduleClass(schedule.schedule_type)}
                  title={`${schedule.start_time} - ${schedule.title}`}
                >
                  {schedule.start_time} {schedule.title}
                </div>
              ))}
              
              {/* 더 많은 스케줄이 있을 때 */}
              {daySchedules.length > 3 && (
                <div className="calendar-event more">
                  +{daySchedules.length - 3}개 더
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;