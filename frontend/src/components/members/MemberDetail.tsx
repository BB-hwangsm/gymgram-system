// frontend/src/components/members/MemberDetail.tsx

import React, { useState, useEffect } from 'react';
import { Member, Post, CreatePostData } from '../../types';
import { memberAPI, postAPI, apiUtils } from '../../services/api';
import { getTimeAgo } from '../../utils/dateUtils';
import './MemberDetail.css';

interface MemberDetailProps {
  selectedMember: Member | null;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ selectedMember }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showPostForm, setShowPostForm] = useState<boolean>(false);
  const [postContent, setPostContent] = useState<string>('');
  const [postType, setPostType] = useState<'workout' | 'progress' | 'note'>('workout');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');

  // 회원이 변경될 때마다 포스트 로드
  useEffect(() => {
    if (selectedMember) {
      loadMemberPosts();
    } else {
      setPosts([]);
    }
  }, [selectedMember]);

  const loadMemberPosts = async () => {
    if (!selectedMember) return;

    try {
      const memberPosts = await memberAPI.getMemberPosts(selectedMember.id);
      setPosts(memberPosts);
    } catch (err) {
      console.error('포스트 로드 실패:', err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setImagePreview('');
    const fileInput = document.getElementById('post-image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember || !postContent.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const postData: CreatePostData = {
        member: selectedMember.id,
        post_type: postType,
        content: postContent.trim(),
      };

      if (postImage) {
        postData.image = postImage;
      }

      await postAPI.createPost(postData);

      // 폼 초기화
      setPostContent('');
      setPostType('workout');
      setPostImage(null);
      setImagePreview('');
      setShowPostForm(false);

      // 포스트 목록 새로고침
      loadMemberPosts();

    } catch (err) {
      setError(apiUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = async (postId: number) => {
    if (!confirm('이 기록을 삭제하시겠습니까?')) return;

    try {
      await postAPI.deletePost(postId);
      loadMemberPosts();
    } catch (err) {
      console.error('포스트 삭제 실패:', err);
    }
  };

  const getPostTypeLabel = (type: string): string => {
    switch (type) {
      case 'workout': return '운동 기록';
      case 'progress': return '진행 상황';
      case 'note': return '메모';
      default: return '기록';
    }
  };

  const getPostTypeClass = (type: string): string => {
    switch (type) {
      case 'workout': return 'post-type-workout';
      case 'progress': return 'post-type-progress';
      case 'note': return 'post-type-note';
      default: return 'post-type-other';
    }
  };

  if (!selectedMember) {
    return (
      <div className="member-detail-empty">
        <div className="empty-icon">📝</div>
        <p>회원을 선택하면 기록을 확인할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="member-detail">
      {/* 회원 헤더 */}
      <div className="member-header">
        <div className="member-avatar-large">
          {selectedMember.name.charAt(0)}
        </div>
        <div className="member-header-info">
          <div className="member-header-name">{selectedMember.name}</div>
          <div className="member-header-stats">
            {selectedMember.phone && `📞 ${selectedMember.phone}`}
            {selectedMember.trainer_name && ` | 담당: ${selectedMember.trainer_name}`}
            {selectedMember.join_date && ` | 가입일: ${new Date(selectedMember.join_date).toLocaleDateString('ko-KR')}`}
          </div>
        </div>
      </div>

      {/* 포스트 작성 영역 */}
      <div className="post-composer">
        <div className="composer-header">
          <div className="composer-avatar">T</div>
          <div>
            <div className="composer-name">트레이너</div>
            <div className="composer-subtitle">회원 기록 작성</div>
          </div>
          <button
            className="btn-secondary"
            onClick={() => setShowPostForm(!showPostForm)}
          >
            {showPostForm ? '취소' : '기록 작성'}
          </button>
        </div>

        {showPostForm && (
          <form onSubmit={handlePostSubmit} className="post-form">
            {error && <div className="error">{error}</div>}
            
            <textarea
              className="post-textarea"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="운동 기록, 진행 상황, 특이사항 등을 기록해보세요..."
              rows={4}
            />

            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="미리보기" className="preview-image" />
                <button type="button" className="remove-image" onClick={removeImage}>
                  ×
                </button>
              </div>
            )}

            <div className="post-actions">
              <div className="post-options">
                <input
                  type="file"
                  id="post-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="post-option-btn"
                  onClick={() => document.getElementById('post-image')?.click()}
                >
                  📷 사진
                </button>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as 'workout' | 'progress' | 'note')}
                  className="post-type-select"
                >
                  <option value="workout">운동 기록</option>
                  <option value="progress">진행 상황</option>
                  <option value="note">메모</option>
                </select>
              </div>
              <button
                type="submit"
                className="post-submit"
                disabled={loading || !postContent.trim()}
              >
                {loading ? '게시 중...' : '게시'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 피드 영역 */}
      <div className="feed-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-feed-icon">📝</div>
            <p>{selectedMember.name}님의 첫 번째 기록을 작성해보세요!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="feed-post">
              <div className="post-header">
                <div className="post-avatar">
                  {selectedMember.name.charAt(0)}
                </div>
                <div className="post-info">
                  <div className="post-author">{selectedMember.name}</div>
                  <div className="post-time">{getTimeAgo(post.created_at)}</div>
                </div>
                <div className={`post-type-badge ${getPostTypeClass(post.post_type)}`}>
                  {getPostTypeLabel(post.post_type)}
                </div>
                <button
                  className="post-delete-btn"
                  onClick={() => handlePostDelete(post.id)}
                >
                  🗑️
                </button>
              </div>

              <div className="post-content">
                {post.content && (
                  <div className="post-text">{post.content}</div>
                )}
                {post.image && (
                  <img
                    src={apiUtils.getImageUrl(post.image)}
                    alt="첨부 이미지"
                    className="post-image"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberDetail;