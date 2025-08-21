// frontend/src/utils/dateUtils.ts

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  export const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  
  export const formatDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  export const getTimeAgo = (dateTimeString: string): string => {
    const now = new Date();
    const date = new Date(dateTimeString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return '방금 전';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    } else {
      return formatDate(dateTimeString);
    }
  };
  
  export const getTodayString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  export const getCurrentTimeString = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  export const generateCalendar = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const calendar = [];
    
    // 이전 달의 날짜들
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i;
      calendar.push({
        day,
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    // 현재 달의 날짜들
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendar.push({
        day,
        date,
        isCurrentMonth: true,
        isToday: isCurrentMonth && today.getDate() === day,
      });
    }
    
    // 다음 달의 날짜들 (6주 완성)
    const totalCells = 42; // 6주 * 7일
    const remainingCells = totalCells - calendar.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      calendar.push({
        day,
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    return calendar;
  };
  
  // 한국어 요일 이름
  export const KOREAN_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  
  // 한국어 월 이름
  export const KOREAN_MONTHS = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];