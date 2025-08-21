// frontend/src/components/members/MemberList.tsx

import React, { useState, useEffect } from 'react';
import { Member, User, CreateMemberData } from '../../types';
import { memberAPI, userAPI, apiUtils } from '../../services/api';
import { getTodayString } from '../../utils/dateUtils';
import './MemberList.css';

interface MemberListProps {
  members: Member[];
  selectedMember: Member | null;
  onMemberSelect: (member: Member) => void;
  onMemberAdded: () => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  selectedMember,
  onMemberSelect,
  onMemberAdded
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateMemberData>({
    name: '',
    phone: '',
    email: '',
    gender: undefined,
    birth_date: '',
    join_date: getTodayString(),
    trainer: undefined,
    goals: '',
    health_notes: '',
    emergency_contact: ''
  });
  const [trainers, setTrainers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // 트레이너 목록 로드
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const response = await userAPI.getTrainers();
        setTrainers(response.results);
      } catch (err) {
        console.error('트레이너 로드 실패:', err);
      }
    };

    loadTrainers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'trainer' ? (value ? parseInt(value) : undefined) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.join_date) {
      setError('이름, 전화번호, 가입일은 필수 입력사항입니다.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await memberAPI.createMember(formData);
      
      // 폼 초기화
      setFormData({
        name: '',
        phone: '',
        email: '',
        gender: undefined,
        birth_date: '',
        join_date: getTodayString(),
        trainer: undefined,
        goals: '',
        health_notes: '',
        emergency_contact: ''
      });
      
      setShowAddForm(false);
      onMemberAdded();
      
    } catch (err) {
      setError(apiUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="member-list">
      {/* 회원 추가 폼 */}
      <div className="member-add-form">
        <div className="form-header">
          <h4>새 회원 등록</h4>
          <button
            className="btn-secondary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '취소' : '회원 추가'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="add-form">
            {error && <div className="error">{error}</div>}
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="회원 이름*"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="전화번호*"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일"
                />
              </div>
              <div className="form-group">
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                >
                  <option value="">성별 선택</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>생년월일</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>가입일</label>
                <input
                  type="date"
                  name="join_date"
                  value={formData.join_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <select
                name="trainer"
                value={formData.trainer || ''}
                onChange={handleInputChange}
              >
                <option value="">담당 트레이너 선택</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.full_name}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? '등록 중...' : '회원 추가'}
            </button>
          </form>
        )}
      </div>

      {/* 회원 목록 */}
      <div className="member-list-header">
        <h4>회원 목록 ({members.length}명)</h4>
      </div>

      <div className="member-list-container">
        {members.length === 0 ? (
          <p className="empty-message">등록된 회원이 없습니다.</p>
        ) : (
          members.map(member => (
            <div
              key={member.id}
              className={`member-item ${selectedMember?.id === member.id ? 'active' : ''}`}
              onClick={() => onMemberSelect(member)}
            >
              <div className="member-avatar">
                {member.name.charAt(0)}
              </div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-details">
                  📞 {member.phone}
                  {member.trainer_name && ` | 담당: ${member.trainer_name}`}
                </div>
                <div className="member-join-date">
                  가입일: {new Date(member.join_date).toLocaleDateString('ko-KR')}
                </div>
              </div>
              {!member.is_active && (
                <div className="inactive-badge">비활성</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberList;