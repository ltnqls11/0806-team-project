import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, MapPin, Star, Wifi, Car, Coffee, Waves, Heart } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const SearchForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
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

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-self: start;
  align-self: end;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AccommodationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const AccommodationCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
`;

const AccommodationImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const AccommodationInfo = styled.div`
  padding: 1.5rem;
`;

const AccommodationHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const AccommodationName = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const AccommodationType = styled.span`
  background: #4ecdc4;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  margin-bottom: 1rem;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
`;

const Discount = styled.span`
  background: #e74c3c;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
`;

const Amenities = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const AmenityIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #666;
`;

const DistanceInfo = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const DistanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const BookingButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
`;

const AccommodationSearch = ({ geminiService }) => {
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    location: '전체',
    priceRange: '전체'
  });
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    if (!geminiService || !searchParams.checkIn || !searchParams.checkOut) {
      alert('체크인/체크아웃 날짜를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await geminiService.generateAccommodations(
        searchParams.checkIn,
        searchParams.checkOut,
        searchParams.location,
        searchParams.priceRange
      );
      
      if (result && result.accommodations) {
        setAccommodations(result.accommodations);
      }
    } catch (error) {
      console.error('Error searching accommodations:', error);
      alert('숙소 검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (accommodationId) => {
    setFavorites(prev => 
      prev.includes(accommodationId)
        ? prev.filter(id => id !== accommodationId)
        : [...prev, accommodationId]
    );
  };

  const getAccommodationIcon = (type) => {
    const icons = {
      '호텔': '🏨',
      '모텔': '🏩',
      '게스트하우스': '🏠',
      '펜션': '🏡',
      '리조트': '🏖️'
    };
    return icons[type] || '🏨';
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': <Wifi size={16} />,
      '주차': <Car size={16} />,
      '조식': <Coffee size={16} />,
      '수영장': <Waves size={16} />
    };
    return icons[amenity] || null;
  };

  return (
    <Container>
      <h2>🏨 숙소 검색</h2>
      
      <SearchForm>
        <FormGroup>
          <Label>체크인</Label>
          <Input
            type="date"
            value={searchParams.checkIn}
            onChange={(e) => handleInputChange('checkIn', e.target.value)}
            min="2024-10-01"
            max="2024-10-15"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>체크아웃</Label>
          <Input
            type="date"
            value={searchParams.checkOut}
            onChange={(e) => handleInputChange('checkOut', e.target.value)}
            min="2024-10-02"
            max="2024-10-16"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>지역</Label>
          <Select
            value={searchParams.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="센텀시티">센텀시티</option>
            <option value="해운대">해운대</option>
            <option value="서면">서면</option>
            <option value="남포동">남포동</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>가격대</Label>
          <Select
            value={searchParams.priceRange}
            onChange={(e) => handleInputChange('priceRange', e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="3만원 이하">3만원 이하</option>
            <option value="3-7만원">3-7만원</option>
            <option value="7-15만원">7-15만원</option>
            <option value="15만원 이상">15만원 이상</option>
          </Select>
        </FormGroup>
        
        <SearchButton onClick={handleSearch} disabled={isLoading}>
          <Search size={20} />
          {isLoading ? '검색 중...' : '검색'}
        </SearchButton>
      </SearchForm>

      {isLoading && (
        <LoadingMessage>
          AI가 최적의 숙소를 찾고 있습니다...
        </LoadingMessage>
      )}

      {accommodations.length === 0 && !isLoading && (
        <div>
          <div style={{background: '#f8f9fa', borderRadius: '15px', padding: '2rem', textAlign: 'center', marginBottom: '2rem'}}>
            <h3>💡 BIFF 기간 숙소 예약 팁</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #4ecdc4'}}>
                <h4>🎬 영화관 접근성</h4>
                <p>센텀시티 지역이 영화관 밀집도가 높아 편리합니다</p>
              </div>
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #e74c3c'}}>
                <h4>💰 가격 비교</h4>
                <p>여러 예약 사이트를 비교해보세요 (부킹닷컴, 아고다, 야놀자 등)</p>
              </div>
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #f39c12'}}>
                <h4>📅 조기 예약</h4>
                <p>BIFF 기간은 성수기이므로 미리 예약하는 것이 좋습니다</p>
              </div>
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #9b59b6'}}>
                <h4>🚇 교통편</h4>
                <p>지하철역 근처 숙소를 선택하면 이동이 편리합니다</p>
              </div>
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #f1c40f'}}>
                <h4>🔔 가격 알림</h4>
                <p>원하는 숙소의 가격 알림을 설정해두세요</p>
              </div>
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #e67e22'}}>
                <h4>⭐ 리뷰 확인</h4>
                <p>최근 리뷰를 확인하여 숙소 상태를 파악하세요</p>
              </div>
            </div>
          </div>
          
          <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '15px', padding: '2rem', textAlign: 'center'}}>
            <h3>🔥 BIFF 기간 추천 숙소</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
              {[
                { name: '센텀시티 프리미엄 호텔', type: '호텔', location: '센텀시티', price: '12만원/박', rating: '⭐⭐⭐⭐⭐', distance: '영화의전당 도보 3분' },
                { name: '해운대 오션뷰 호텔', type: '호텔', location: '해운대', price: '15만원/박', rating: '⭐⭐⭐⭐⭐', distance: '해운대역 도보 5분' },
                { name: '서면 비즈니스 호텔', type: '호텔', location: '서면', price: '8만원/박', rating: '⭐⭐⭐⭐', distance: '서면역 도보 2분' },
                { name: '남포동 게스트하우스', type: '게스트하우스', location: '남포동', price: '3만원/박', rating: '⭐⭐⭐⭐', distance: '자갈치역 도보 5분' }
              ].map(acc => (
                <div key={acc.name} style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem'}}>
                  <h4>{getAccommodationIcon(acc.type)} {acc.name}</h4>
                  <p><strong>타입:</strong> {acc.type}</p>
                  <p><strong>위치:</strong> {acc.location}</p>
                  <p><strong>가격:</strong> {acc.price}</p>
                  <p><strong>평점:</strong> {acc.rating}</p>
                  <p><strong>교통:</strong> {acc.distance}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {accommodations.length > 0 && (
        <div style={{background: '#f8f9fa', borderRadius: '15px', padding: '1.5rem', marginBottom: '2rem'}}>
          <h3>💡 BIFF 기간 숙소 예약 팁</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
            <div style={{background: 'white', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid #4ecdc4', textAlign: 'center'}}>
              <h4>🎬 영화관 접근성</h4>
              <p style={{fontSize: '0.9rem', margin: '0.5rem 0 0 0'}}>센텀시티 지역이 영화관 밀집도가 높아 편리합니다</p>
            </div>
            <div style={{background: 'white', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid #e74c3c', textAlign: 'center'}}>
              <h4>💰 가격 비교</h4>
              <p style={{fontSize: '0.9rem', margin: '0.5rem 0 0 0'}}>여러 예약 사이트를 비교해보세요</p>
            </div>
            <div style={{background: 'white', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid #f1c40f', textAlign: 'center'}}>
              <h4>🔔 가격 알림</h4>
              <p style={{fontSize: '0.9rem', margin: '0.5rem 0 0 0'}}>원하는 숙소의 가격 알림을 설정해두세요</p>
            </div>
            <div style={{background: 'white', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid #e67e22', textAlign: 'center'}}>
              <h4>⭐ 리뷰 확인</h4>
              <p style={{fontSize: '0.9rem', margin: '0.5rem 0 0 0'}}>최근 리뷰를 확인하여 숙소 상태를 파악하세요</p>
            </div>
          </div>
        </div>
      )}

      <AccommodationGrid>
        {accommodations.map(accommodation => (
          <AccommodationCard key={accommodation.id}>
            <AccommodationImage>
              {getAccommodationIcon(accommodation.type)}
              <FavoriteButton onClick={() => toggleFavorite(accommodation.id)}>
                <Heart 
                  size={20} 
                  fill={favorites.includes(accommodation.id) ? '#e74c3c' : 'none'}
                  color={favorites.includes(accommodation.id) ? '#e74c3c' : '#666'}
                />
              </FavoriteButton>
            </AccommodationImage>
            
            <AccommodationInfo>
              <AccommodationHeader>
                <div>
                  <AccommodationName>
                    {accommodation.name}
                    <AccommodationType>{accommodation.type}</AccommodationType>
                  </AccommodationName>
                  <Rating>
                    <Star size={16} fill="#ffd700" color="#ffd700" />
                    <span>{accommodation.rating}</span>
                    <span style={{color: '#666'}}>({accommodation.review_count})</span>
                  </Rating>
                </div>
              </AccommodationHeader>
              
              <Location>
                <MapPin size={16} />
                {accommodation.location}
              </Location>
              
              <PriceInfo>
                <Price>{accommodation.price_per_night?.toLocaleString()}원</Price>
                {accommodation.original_price && accommodation.original_price > accommodation.price_per_night && (
                  <>
                    <OriginalPrice>{accommodation.original_price?.toLocaleString()}원</OriginalPrice>
                    <Discount>{accommodation.discount_rate}% 할인</Discount>
                  </>
                )}
              </PriceInfo>
              
              <Amenities>
                {accommodation.amenities?.slice(0, 4).map((amenity, index) => (
                  <AmenityIcon key={`${accommodation.id}-amenity-${index}`}>
                    {getAmenityIcon(amenity)}
                    {amenity}
                  </AmenityIcon>
                ))}
              </Amenities>
              
              <DistanceInfo>
                <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem'}}>영화관까지 거리</h4>
                {accommodation.distance_to_cinema && Object.entries(accommodation.distance_to_cinema).map(([cinema, distance]) => (
                  <DistanceItem key={cinema}>
                    <span>{cinema}</span>
                    <span>{distance}</span>
                  </DistanceItem>
                ))}
              </DistanceInfo>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem'}}>
                <button
                  style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => alert(`${accommodation.name}의 가격 알림이 설정되었습니다!`)}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  🔔 가격 알림
                </button>
                <button
                  style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => alert(`${accommodation.name}의 최근 리뷰를 확인하세요!\n\n⭐⭐⭐⭐⭐ "위치가 정말 좋아요!"\n⭐⭐⭐⭐ "깨끗하고 친절합니다"\n⭐⭐⭐⭐⭐ "BIFF 기간 최고의 선택"`)}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  ⭐ 리뷰 확인
                </button>
              </div>
              
              <BookingButton>
                예약하기
              </BookingButton>
            </AccommodationInfo>
          </AccommodationCard>
        ))}
      </AccommodationGrid>

      <div style={{background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white', borderRadius: '15px', padding: '2rem', marginTop: '2rem'}}>
        <h3>🏨 BIFF 기간 숙소 예약 완벽 가이드</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
          <div style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem'}}>
            <h4>🔔 가격 알림 활용법</h4>
            <ul style={{margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6'}}>
              <li>원하는 가격대 설정</li>
              <li>여러 숙소 동시 알림 가능</li>
              <li>할인 정보 실시간 알림</li>
              <li>예약 마감 임박 알림</li>
            </ul>
          </div>
          
          <div style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem'}}>
            <h4>⭐ 리뷰 확인 포인트</h4>
            <ul style={{margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6'}}>
              <li>최근 3개월 리뷰 중점 확인</li>
              <li>청결도와 위치 평가</li>
              <li>BIFF 기간 이용 후기</li>
              <li>사진 리뷰 꼼꼼히 체크</li>
            </ul>
          </div>
          
          <div style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem'}}>
            <h4>💰 예약 사이트별 특징</h4>
            <ul style={{margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6'}}>
              <li>부킹닷컴: 무료 취소 옵션</li>
              <li>아고다: 아시아 숙소 특화</li>
              <li>야놀자: 국내 할인 혜택</li>
              <li>호텔스컴바인: 가격 비교</li>
            </ul>
          </div>
          
          <div style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem'}}>
            <h4>📅 BIFF 기간 예약 팁</h4>
            <ul style={{margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6'}}>
              <li>8월 말부터 예약 시작</li>
              <li>평일 숙박이 더 저렴</li>
              <li>센텀시티 조기 매진 주의</li>
              <li>취소 정책 반드시 확인</li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AccommodationSearch;