import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, User, MapPin, Calendar, Heart, MessageCircle, Star, Filter, Plus } from 'lucide-react';
import TravelerProfile from './TravelerProfile';
import ProfileRegistration from './ProfileRegistration';

const Container = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  animation: fadeInUp 0.6s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchSection = styled.div`
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 1rem;
  border: 2px solid #e0e6ed;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border: 2px solid #667eea;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const FilterTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterTag = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#667eea' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const TravelerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TravelerCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
`;

const TravelDates = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #6c757d;
  font-size: 0.9rem;
`;

const Bio = styled.p`
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 1rem 0;
`;

const Interests = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 1rem 0;
`;

const InterestTag = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &.primary {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a6fd8;
    }
  }

  &.secondary {
    background: #f8f9fa;
    color: #6c757d;

    &:hover {
      background: #e9ecef;
    }
  }
`;

const TravelerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);

  // 샘플 여행자 데이터
  const sampleTravelers = [
    {
      id: 1,
      name: '김영화',
      location: '서울, 한국',
      avatar: '김',
      travelDates: '2024.10.2 - 10.6',
      bio: 'BIFF 단골 관객입니다! 독립영화와 아시아 영화를 좋아해요. 함께 영화 보고 이야기 나눌 분 찾아요 🎬',
      interests: ['독립영화', '아시아영화', '카페투어', '부산맛집', 'BIFF상영작', '영화토론'],
      rating: 4.8,
      reviewCount: 23
    },
    {
      id: 2,
      name: '박시네마',
      location: '부산, 한국',
      avatar: '박',
      travelDates: '2024.10.1 - 10.11',
      bio: '부산 토박이예요! BIFF 기간 동안 숨은 맛집과 포토스팟 안내해드릴 수 있어요. 영화 얘기도 환영! 🌊',
      interests: ['로컬가이드', '사진촬영', '해변산책', 'BIFF', '한국영화', '영화제투어'],
      rating: 4.9,
      reviewCount: 45
    },
    {
      id: 3,
      name: '이필름',
      location: '대구, 한국',
      avatar: '이',
      travelDates: '2024.10.3 - 10.8',
      bio: '첫 BIFF 참가예요! 영화 초보라 가이드해주실 분 찾습니다. 맛있는 거 먹는 것도 좋아해요 😊',
      interests: ['영화입문', '부산여행', '맛집탐방', '친구만들기', '상업영화', '영화추천'],
      rating: 4.7,
      reviewCount: 12
    },
    {
      id: 4,
      name: 'Sarah Kim',
      location: '뉴욕, 미국',
      avatar: 'S',
      travelDates: '2024.10.4 - 10.9',
      bio: 'Korean-American filmmaker visiting BIFF for the first time! Looking for local insights and film discussions 🎭',
      interests: ['국제영화', '문화교류', '영어회화', '네트워킹', '영화제작', '인디영화'],
      rating: 4.6,
      reviewCount: 8
    },
    {
      id: 5,
      name: '최무비',
      location: '광주, 한국',
      avatar: '최',
      travelDates: '2024.10.2 - 10.7',
      bio: '다큐멘터리 전문가입니다. BIFF에서 좋은 다큐 추천받고 싶어요. 야경 사진 찍는 것도 좋아합니다 📸',
      interests: ['다큐멘터리', '야경사진', '독립서점', '전시관람', '사회이슈', '영화비평'],
      rating: 4.8,
      reviewCount: 31
    },
    {
      id: 6,
      name: '정아트',
      location: '인천, 한국',
      avatar: '정',
      travelDates: '2024.10.5 - 10.10',
      bio: '예술영화 마니아예요! 감천문화마을과 부산 현대미술관도 가보고 싶어요. 조용한 카페에서 영화 이야기 나눠요 ☕',
      interests: ['예술영화', '현대미술', '문화마을', '조용한카페', '아트하우스', '실험영화'],
      rating: 4.9,
      reviewCount: 27
    }
  ];

  const filterOptions = [
    '영화애호가', '로컬가이드', '첫방문', '국제교류', '맛집탐방', 
    '사진촬영', '문화예술', '친구만들기', '언어교환', '네트워킹',
    '독립영화', '상업영화', '다큐멘터리', '아시아영화', '한국영화',
    'BIFF', '영화제작', '영화비평', '영화토론', '아트하우스'
  ];

  useEffect(() => {
    setTravelers(sampleTravelers);
  }, []);

  const handleSaveProfile = (newProfile) => {
    setTravelers(prev => [newProfile, ...prev]);
  };

  const handleFilterToggle = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredTravelers = travelers.filter(traveler => {
    const matchesSearch = traveler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         traveler.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         traveler.interests.some(interest => 
                           interest.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesFilters = activeFilters.length === 0 || 
                          activeFilters.some(filter => 
                            traveler.interests.some(interest => 
                              interest.includes(filter) || filter.includes(interest)
                            )
                          );

    return matchesSearch && matchesFilters;
  });

  return (
    <Container>
      <Title>
        <Search size={24} />
        여행자 검색 & 프로필
      </Title>

      <SearchSection>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="이름, 관심사, 지역으로 검색해보세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterButton 
            active={showFilters}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            필터
          </FilterButton>
          <FilterButton onClick={() => setShowRegistration(true)}>
            <Plus size={20} />
            프로필 등록
          </FilterButton>
        </SearchContainer>

        {showFilters && (
          <FilterTags>
            {filterOptions.map(filter => (
              <FilterTag
                key={filter}
                active={activeFilters.includes(filter)}
                onClick={() => handleFilterToggle(filter)}
              >
                {filter}
              </FilterTag>
            ))}
          </FilterTags>
        )}
      </SearchSection>

      <TravelerGrid>
        {filteredTravelers.map(traveler => (
          <TravelerCard key={traveler.id} onClick={() => setSelectedTraveler(traveler)}>
            <ProfileHeader>
              <Avatar>{traveler.avatar}</Avatar>
              <ProfileInfo>
                <Name>{traveler.name}</Name>
                <Location>
                  <MapPin size={14} />
                  {traveler.location}
                </Location>
                <TravelDates>
                  <Calendar size={14} />
                  {traveler.travelDates}
                </TravelDates>
              </ProfileInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Star size={16} fill="#ffc107" color="#ffc107" />
                <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                  {traveler.rating} ({traveler.reviewCount})
                </span>
              </div>
            </ProfileHeader>

            <Bio>{traveler.bio}</Bio>

            <Interests>
              {traveler.interests.map(interest => (
                <InterestTag key={interest}>{interest}</InterestTag>
              ))}
            </Interests>

            <ActionButtons>
              <ActionButton className="primary">
                <MessageCircle size={16} />
                메시지
              </ActionButton>
              <ActionButton className="secondary">
                <Heart size={16} />
                관심
              </ActionButton>
            </ActionButtons>
          </TravelerCard>
        ))}
      </TravelerGrid>

      {filteredTravelers.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#6c757d' 
        }}>
          <User size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>검색 조건에 맞는 여행자를 찾을 수 없습니다.</p>
          <p>다른 키워드로 검색해보세요!</p>
        </div>
      )}

      {selectedTraveler && (
        <TravelerProfile 
          traveler={selectedTraveler} 
          onClose={() => setSelectedTraveler(null)} 
        />
      )}

      {showRegistration && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <ProfileRegistration 
              onClose={() => setShowRegistration(false)}
              onSave={handleSaveProfile}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default TravelerSearch;