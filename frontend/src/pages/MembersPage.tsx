// frontend/src/pages/MembersPage.tsx

import React, { useState, useEffect } from 'react';
import MemberList from '../components/members/MemberList';
import MemberDetail from '../components/members/MemberDetail';
import { Member } from '../types';
import { memberAPI, apiUtils } from '../services/api';

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 회원 데이터 로드
  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await memberAPI.getMembers();
      setMembers(response.results);
      setError('');
    } catch (err) {
      setError(apiUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // 회원 선택
  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
  };

  // 회원 추가 성공 시 목록 새로고침
  const handleMemberAdded = () => {
    loadMembers();
  };

  if (loading) {
    return (
      <div>
        <div className="ig-card">
          <div className="ig-card-header">
            <h2 className="ig-card-title">👥 회원</h2>
          </div>
          <div className="ig-card-content">
            <div className="loading">회원 목록을 불러오는 중...</div>
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
                <div className="story-avatar-inner">👥</div>
              </div>
              <div className="story-username">전체 회원</div>
            </div>
            <div className="story-item">
              <div className="story-avatar">
                <div className="story-avatar-inner">➕</div>
              </div>
              <div className="story-username">회원 추가</div>
            </div>
            <div className="story-item">
              <div className="story-avatar">
                <div className="story-avatar-inner">🏆</div>
              </div>
              <div className="story-username">우수 회원</div>
            </div>
            <div className="story-item">
              <div className="story-avatar">
                <div className="story-avatar-inner">📈</div>
              </div>
              <div className="story-username">진행률</div>
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
              <h3 className="ig-card-title">회원 목록</h3>
              <div className="text-sm text-muted">
                {members.length}명
              </div>
            </div>
            <div className="ig-card-content" style={{ padding: '16px 0' }}>
              <MemberList
                members={members}
                selectedMember={selectedMember}
                onMemberSelect={handleMemberSelect}
                onMemberAdded={handleMemberAdded}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="ig-card">
            <div className="ig-card-header">
              <h3 className="ig-card-title">
                {selectedMember ? `${selectedMember.name}님의 피드` : '회원 피드'}
              </h3>
              {selectedMember && (
                <div className="flex gap-8">
                  <div className="avatar avatar-sm">
                    {selectedMember.name.charAt(0)}
                  </div>
                </div>
              )}
            </div>
            <div className="ig-card-content" style={{ padding: 0 }}>
              <MemberDetail selectedMember={selectedMember} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;