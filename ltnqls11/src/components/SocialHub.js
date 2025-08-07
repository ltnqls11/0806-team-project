import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Users, Heart, MessageCircle, Camera, Star, MapPin, Calendar } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 10px;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e9ecef'};
  }
`;

const ProfileForm = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const UserCard = styled.div`
  background: white;
  border: 2px solid #eee;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
`;

const UserAge = styled.span`
  background: #4ecdc4;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
`;

const UserStatus = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const MatchScore = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem;
  border-radius: 10px;
  text-align: center;
  min-width: 60px;
`;

const InterestTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InterestTag = styled.span`
  background: #f8f9fa;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
`;

const MatchReasons = styled.div`
  background: #e8f5e8;
  border: 1px solid #c3e6c3;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
`;

const ContactButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const ReviewCard = styled.div`
  background: white;
  border: 2px solid #eee;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const ReviewDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ReviewTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
`;

const ReviewContent = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    color: #2c3e50;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const PhotoCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
`;

const PhotoImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const PhotoInfo = styled.div`
  padding: 1rem;
`;

const PhotoLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4ecdc4;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PhotoCaption = styled.p`
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const PhotoTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const PhotoTag = styled.span`
  background: #4ecdc4;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
`;

const SocialHub = () => {
  const [activeTab, setActiveTab] = useState('matching');
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    interests: [],
    travelStyle: '관광 + 영화 균형',
    preferredMovies: []
  });
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [photos, setPhotos] = useState([]);

  const interestOptions = ['영화', '맛집', '관광', '쇼핑', '사진', '문화', '예술', '역사'];
  const movieOptions = ['드라마', '코미디', '액션', '로맨스', '스릴러', '독립영화', '아트하우스'];

  useEffect(() => {
    // Initialize sample data
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    setUsers([
      {
        id: 'user_1',
        name: '영화광 김씨',
        age: 25,
        interests: ['영화', '문화', '사진'],
        travelStyle: '영화 중심 (BIFF 집중)',
        preferredMovies: ['드라마', '스릴러', '독립영화'],
        status: '10월 3-5일 동행자 구함',
        contact: 'biff_lover@email.com'
      },
      {
        id: 'user_2',
        name: '부산 토박이 이씨',
        age: 30,
        interests: ['맛집', '관광', '영화'],
        travelStyle: '관광 + 영화 균형',
        preferredMovies: ['코미디', '액션', '로맨스'],
        status: '부산 가이드 가능합니다',
        contact: 'busan_guide@email.com'
      },
      {
        id: 'user_3',
        name: '사진작가 박씨',
        age: 28,
        interests: ['사진', '예술', '영화'],
        travelStyle: '영화 + 포토존',
        preferredMovies: ['아트하우스', '독립영화'],
        status: '포토존 투어 함께해요',
        contact: 'photo_biff@email.com'
      },
      {
        id: 'user_4',
        name: '영화광 김씨',
        age: 25,
        interests: ['영화', '문화', '사진'],
        travelStyle: '영화 중심 (BIFF 집중)',
        preferredMovies: ['드라마', '스릴러', '독립영화'],
        status: '10월 3-5일 동행자 구함',
        contact: 'movie_kim@email.com'
      },
      {
        id: 'user_5',
        name: '부산 토박이 이씨',
        age: 30,
        interests: ['맛집', '관광', '영화'],
        travelStyle: '관광 + 영화 균형',
        preferredMovies: ['코미디', '액션', '로맨스'],
        status: '부산 가이드 가능합니다',
        contact: 'busan_local@email.com'
      },
      {
        id: 'user_6',
        name: '사진작가 박씨',
        age: 28,
        interests: ['사진', '예술', '영화'],
        travelStyle: '영화 + 포토존',
        preferredMovies: ['아트하우스', '독립영화'],
        status: '포토존 투어 함께해요',
        contact: 'photo_park@email.com'
      },
      {
        id: 'user_7',
        name: '영화 평론가 최씨',
        age: 32,
        interests: ['영화', '문화', '예술'],
        travelStyle: '영화 중심 (BIFF 집중)',
        preferredMovies: ['아트하우스', '다큐멘터리', '독립영화'],
        status: '영화 토론 함께하실 분',
        contact: 'critic_choi@email.com'
      },
      {
        id: 'user_8',
        name: '대학생 정씨',
        age: 22,
        interests: ['영화', '맛집', '쇼핑'],
        travelStyle: '관광 + 영화 균형',
        preferredMovies: ['로맨스', '코미디', '액션'],
        status: '같은 또래 친구 찾아요',
        contact: 'student_jung@email.com'
      },
      {
        id: 'user_9',
        name: '여행 블로거 한씨',
        age: 27,
        interests: ['여행', '사진', '영화'],
        travelStyle: '영화 + 포토존',
        preferredMovies: ['드라마', '로맨스', '스릴러'],
        status: '여행 콘텐츠 함께 만들어요',
        contact: 'blogger_han@email.com'
      },
      {
        id: 'user_10',
        name: '직장인 강씨',
        age: 29,
        interests: ['영화', '휴식', '맛집'],
        travelStyle: '휴양 + 영화',
        preferredMovies: ['코미디', '액션', '로맨스'],
        status: '힐링 여행 원해요',
        contact: 'worker_kang@email.com'
      }
    ]);

    setReviews([
      {
        id: 'review_1',
        userName: 'BIFF 마니아',
        rating: 5,
        title: '완벽했던 BIFF 28회 후기',
        content: '작년 BIFF는 정말 최고였어요! 영화의전당에서 본 개막작이 아직도 기억에 남네요. 센텀시티 호텔에 머물면서 도보로 이동할 수 있어서 너무 편했습니다.',
        date: '2023-11-15',
        likes: 24
      },
      {
        id: 'review_2',
        userName: '부산 여행러버',
        rating: 4,
        title: '영화제 + 부산 관광 3박4일',
        content: 'BIFF 기간에 부산 여행을 다녀왔어요. 영화 관람과 함께 해운대, 감천문화마을도 둘러보니 알찬 여행이었습니다. 돼지국밥은 꼭 드세요!',
        date: '2023-10-20',
        likes: 18
      }
    ]);

    setPhotos([
      {
        id: 'photo_1',
        userName: '포토그래퍼',
        location: '영화의전당',
        caption: 'BIFF 메인 상영관에서 📸 #BIFF #영화의전당 #부산여행',
        tags: ['BIFF', '영화의전당', '부산여행'],
        date: '2024-10-03',
        likes: 45
      },
      {
        id: 'photo_2',
        userName: '여행스타그램',
        location: 'BIFF광장',
        caption: '핸드프린팅과 함께 인증샷! ✋ #BIFF광장 #핸드프린팅',
        tags: ['BIFF광장', '핸드프린팅', '인증샷'],
        date: '2024-10-04',
        likes: 32
      },
      {
        id: 'photo_3',
        userName: '부산러버',
        location: '광안대교',
        caption: 'BIFF 관람 후 광안대교 야경 🌉 #광안대교 #부산야경',
        tags: ['광안대교', '부산야경', 'BIFF'],
        date: '2024-10-04',
        likes: 67
      }
    ]);
  };

  const handleProfileSubmit = () => {
    if (!userProfile.name || userProfile.interests.length === 0) {
      alert('이름과 관심사를 입력해주세요.');
      return;
    }
    alert('프로필이 등록되었습니다!');
  };

  const handleInterestChange = (interest, checked) => {
    setUserProfile(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleMovieChange = (movie, checked) => {
    setUserProfile(prev => ({
      ...prev,
      preferredMovies: checked
        ? [...prev.preferredMovies, movie]
        : prev.preferredMovies.filter(m => m !== movie)
    }));
  };

  const findMatches = () => {
    if (userProfile.interests.length === 0) return [];

    return users.map(user => {
      const interestScore = user.interests.filter(interest =>
        userProfile.interests.includes(interest)
      ).length;

      const movieScore = user.preferredMovies.filter(movie =>
        userProfile.preferredMovies.includes(movie)
      ).length;

      const styleScore = user.travelStyle === userProfile.travelStyle ? 1 : 0;

      const totalScore = interestScore + movieScore + styleScore;

      const matchReasons = [];
      if (interestScore > 0) matchReasons.push(`공통 관심사 ${interestScore}개`);
      if (movieScore > 0) matchReasons.push(`선호 영화 ${movieScore}개 일치`);
      if (styleScore > 0) matchReasons.push('여행 스타일 일치');

      return {
        ...user,
        matchScore: totalScore,
        matchReasons
      };
    }).filter(user => user.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const renderMatching = () => (
    <div>
      <ProfileForm>
        <h3>👤 내 프로필 등록</h3>
        <FormGrid>
          <FormGroup>
            <Label>이름</Label>
            <Input
              value={userProfile.name}
              onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="닉네임 입력"
            />
          </FormGroup>

          <FormGroup>
            <Label>나이</Label>
            <Input
              type="number"
              value={userProfile.age}
              onChange={(e) => setUserProfile(prev => ({ ...prev, age: e.target.value }))}
              placeholder="나이 입력"
            />
          </FormGroup>

          <FormGroup>
            <Label>여행 스타일</Label>
            <Select
              value={userProfile.travelStyle}
              onChange={(e) => setUserProfile(prev => ({ ...prev, travelStyle: e.target.value }))}
            >
              <option value="영화 중심 (BIFF 집중)">영화 중심 (BIFF 집중)</option>
              <option value="관광 + 영화 균형">관광 + 영화 균형</option>
              <option value="영화 + 포토존">영화 + 포토존</option>
              <option value="맛집 + 영화">맛집 + 영화</option>
            </Select>
          </FormGroup>
        </FormGrid>

        <FormGroup style={{ marginBottom: '1rem' }}>
          <Label>관심사</Label>
          <CheckboxGroup>
            {interestOptions.map(interest => (
              <CheckboxItem key={interest}>
                <input
                  type="checkbox"
                  checked={userProfile.interests.includes(interest)}
                  onChange={(e) => handleInterestChange(interest, e.target.checked)}
                />
                {interest}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup style={{ marginBottom: '1rem' }}>
          <Label>선호 영화 장르</Label>
          <CheckboxGroup>
            {movieOptions.map(movie => (
              <CheckboxItem key={movie}>
                <input
                  type="checkbox"
                  checked={userProfile.preferredMovies.includes(movie)}
                  onChange={(e) => handleMovieChange(movie, e.target.checked)}
                />
                {movie}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <SubmitButton onClick={handleProfileSubmit}>
          프로필 등록
        </SubmitButton>
      </ProfileForm>

      <div style={{ background: '#f8f9fa', borderRadius: '15px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          👥 등록된 여행자들
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {findMatches().slice(0, 10).map(user => (
            <div key={user.id} style={{
              background: 'white',
              borderRadius: '10px',
              padding: '1rem',
              border: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s ease'
            }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                👤
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ margin: 0, color: '#2c3e50' }}>{user.name} ({user.age})</h4>
                  <span style={{
                    background: user.travelStyle.includes('영화') ? '#e74c3c' : '#4ecdc4',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {user.travelStyle}
                  </span>
                </div>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                  관심사: {user.interests.join(', ')} | 상태: {user.status}
                </p>
                {user.matchReasons.length > 0 && (
                  <p style={{ margin: 0, color: '#27ae60', fontSize: '0.8rem', fontWeight: '600' }}>
                    매칭 이유: {user.matchReasons.join(', ')}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  minWidth: '60px'
                }}>
                  매칭도<br />{user.matchScore}점
                </div>
                <button style={{
                  background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  연락하기
                </button>
              </div>
            </div>
          ))}
        </div>

        {findMatches().length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>프로필을 등록하면 매칭된 동행자를 찾을 수 있습니다!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div>
      <h3>✍️ 여행 후기</h3>
      {reviews.map(review => (
        <ReviewCard key={review.id}>
          <ReviewHeader>
            <ReviewerInfo>
              <ReviewerName>{review.userName}</ReviewerName>
              <ReviewDate>{review.date}</ReviewDate>
            </ReviewerInfo>
            <ReviewRating>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < review.rating ? '#ffd700' : 'none'}
                  color="#ffd700"
                />
              ))}
            </ReviewRating>
          </ReviewHeader>

          <ReviewTitle>{review.title}</ReviewTitle>
          <ReviewContent>{review.content}</ReviewContent>

          <ReviewActions>
            <ActionButton>
              <Heart size={16} />
              {review.likes}
            </ActionButton>
            <ActionButton>
              <MessageCircle size={16} />
              댓글
            </ActionButton>
          </ReviewActions>
        </ReviewCard>
      ))}
    </div>
  );

  const renderPhotos = () => (
    <div>
      <h3>📸 포토존 갤러리</h3>
      <PhotoGrid>
        {photos.map(photo => (
          <PhotoCard key={photo.id}>
            <PhotoImage>
              📸
            </PhotoImage>
            <PhotoInfo>
              <PhotoLocation>
                <MapPin size={16} />
                {photo.location}
              </PhotoLocation>
              <PhotoCaption>{photo.caption}</PhotoCaption>
              <PhotoTags>
                {photo.tags.map(tag => (
                  <PhotoTag key={tag}>#{tag}</PhotoTag>
                ))}
              </PhotoTags>
              <ReviewActions>
                <ActionButton>
                  <Heart size={16} />
                  {photo.likes}
                </ActionButton>
                <ActionButton>
                  <MessageCircle size={16} />
                  댓글
                </ActionButton>
              </ReviewActions>
            </PhotoInfo>
          </PhotoCard>
        ))}
      </PhotoGrid>
    </div>
  );

  return (
    <Container>
      <h2>👥 소셜 허브</h2>

      <TabContainer>
        <Tab
          active={activeTab === 'matching'}
          onClick={() => setActiveTab('matching')}
        >
          <Users size={16} />
          동행자 매칭
        </Tab>
        <Tab
          active={activeTab === 'reviews'}
          onClick={() => setActiveTab('reviews')}
        >
          <Star size={16} />
          여행 후기
        </Tab>
        <Tab
          active={activeTab === 'photos'}
          onClick={() => setActiveTab('photos')}
        >
          <Camera size={16} />
          포토존 갤러리
        </Tab>
      </TabContainer>

      {activeTab === 'matching' && renderMatching()}
      {activeTab === 'reviews' && renderReviews()}
      {activeTab === 'photos' && renderPhotos()}
    </Container>
  );
};

export default SocialHub;