import React, { useState } from 'react';
import styled from 'styled-components';
import { MapPin, Star, DollarSign, Clock, Phone, Filter } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const FilterSection = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: block;
`;

const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const RestaurantCard = styled.div`
  background: white;
  border: 2px solid #eee;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
`;

const RestaurantImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const RestaurantInfo = styled.div`
  padding: 1.5rem;
`;

const RestaurantName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
`;

const RestaurantMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const CategoryTag = styled.span`
  background: #4ecdc4;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
`;

const PriceRange = styled.div`
  background: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  text-align: center;
  margin: 1rem 0;
`;

const SpecialtyList = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`;

const CinemaSection = styled.div`
  margin-top: 2rem;
`;

const CinemaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const CinemaCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  border-left: 4px solid #4ecdc4;
`;

const LocalFoodSection = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FoodCard = styled.div`
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const BusanRestaurants = ({ geminiService }) => {
  const [filters, setFilters] = useState({
    location: 'all',
    category: 'all',
    priceRange: 'all',
    cinema: 'all'
  });
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sampleRestaurants = [
    {
      id: 1,
      name: '자갈치시장 회센터',
      category: '해산물',
      location: '자갈치시장',
      specialty: ['활어회', '해산물탕', '대게'],
      priceRange: '2-4만원',
      rating: 4.5,
      reviewCount: 1250,
      phone: '051-245-1234',
      hours: '06:00-22:00',
      description: '부산 대표 해산물 시장의 신선한 회를 맛볼 수 있는 곳',
      nearCinemas: ['부산시네마센터'],
      address: '부산 중구 자갈치해안로 52'
    },
    {
      id: 2,
      name: '할매 돼지국밥',
      category: '부산향토음식',
      location: '서면',
      specialty: ['돼지국밥', '수육', '순대'],
      priceRange: '8천-1만원',
      rating: 4.7,
      reviewCount: 890,
      phone: '051-802-5678',
      hours: '24시간',
      description: '50년 전통의 진짜 부산 돼지국밥 맛집',
      nearCinemas: ['롯데시네마 센텀시티'],
      address: '부산 부산진구 서면로 123'
    },
    {
      id: 3,
      name: '밀면 전문점',
      category: '부산향토음식',
      location: '남포동',
      specialty: ['밀면', '만두', '비빔밀면'],
      priceRange: '7천-9천원',
      rating: 4.3,
      reviewCount: 650,
      phone: '051-245-9876',
      hours: '11:00-21:00',
      description: '시원하고 쫄깃한 부산식 밀면의 원조',
      nearCinemas: ['부산시네마센터'],
      address: '부산 중구 남포대로 456'
    },
    {
      id: 4,
      name: '해운대 횟집',
      category: '해산물',
      location: '해운대',
      specialty: ['광어회', '대게', '해산물찜'],
      priceRange: '3-5만원',
      rating: 4.4,
      reviewCount: 420,
      phone: '051-731-2468',
      hours: '12:00-24:00',
      description: '해운대 바다를 보며 즐기는 신선한 회',
      nearCinemas: ['CGV 해운대'],
      address: '부산 해운대구 해운대해변로 789'
    },
    {
      id: 5,
      name: '센텀 이탈리안',
      category: '양식',
      location: '센텀시티',
      specialty: ['파스타', '피자', '리조또'],
      priceRange: '1.5-3만원',
      rating: 4.2,
      reviewCount: 380,
      phone: '051-746-1357',
      hours: '11:30-22:00',
      description: '영화 관람 전후 가볍게 즐기기 좋은 이탈리안 레스토랑',
      nearCinemas: ['영화의전당', '롯데시네마 센텀시티', 'CGV 센텀시티'],
      address: '부산 해운대구 센텀중앙로 321'
    }
  ];

  React.useEffect(() => {
    setRestaurants(sampleRestaurants);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getFilteredRestaurants = () => {
    return restaurants.filter(restaurant => {
      if (filters.location !== 'all' && restaurant.location !== filters.location) {
        return false;
      }
      if (filters.category !== 'all' && restaurant.category !== filters.category) {
        return false;
      }
      if (filters.cinema !== 'all' && !restaurant.nearCinemas.includes(filters.cinema)) {
        return false;
      }
      return true;
    });
  };

  const generateAIRecommendations = async () => {
    if (!geminiService) return;

    setIsLoading(true);
    try {
      const prompt = `
부산 맛집 추천을 JSON 형식으로 생성해주세요.

다음 조건을 고려해주세요:
- 부산 대표 향토음식 (돼지국밥, 밀면, 해산물 등)
- 다양한 지역 (센텀시티, 해운대, 서면, 남포동, 자갈치 등)
- 가격대별 다양성
- 영화관 근처 접근성

JSON 형식:
{
  "restaurants": [
    {
      "name": "맛집명",
      "category": "음식종류",
      "location": "지역",
      "specialty": ["대표메뉴1", "대표메뉴2"],
      "priceRange": "가격대",
      "rating": 평점(4.5),
      "reviewCount": 리뷰수,
      "phone": "전화번호",
      "hours": "영업시간",
      "description": "맛집 설명",
      "nearCinemas": ["근처영화관"],
      "address": "주소",
      "recommendation": "추천 이유"
    }
  ]
}

총 10-12개의 맛집을 생성해주세요.
JSON만 응답하고 다른 텍스트는 포함하지 마세요.
      `;

      const response = await geminiService.generateResponse(prompt);
      let cleanResponse = response.trim();
      
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7);
      }
      if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3);
      }
      
      const data = JSON.parse(cleanResponse);
      if (data.restaurants) {
        setRestaurants(data.restaurants.map((restaurant, index) => ({
          ...restaurant,
          id: index + 1
        })));
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRestaurants = getFilteredRestaurants();

  const localFoods = [
    {
      name: '돼지국밥',
      description: '부산의 대표 향토음식',
      price: '8,000-12,000원',
      emoji: '🍜'
    },
    {
      name: '밀면',
      description: '시원하고 쫄깃한 면요리',
      price: '7,000-9,000원',
      emoji: '🍝'
    },
    {
      name: '씨앗호떡',
      description: '부산 길거리 간식',
      price: '1,000-2,000원',
      emoji: '🥞'
    },
    {
      name: '부산어묵',
      description: '따뜻한 국물의 어묵',
      price: '2,000-5,000원',
      emoji: '🍢'
    },
    {
      name: '회',
      description: '신선한 바다 회',
      price: '20,000-50,000원',
      emoji: '🍣'
    },
    {
      name: '대게',
      description: '부산 대표 해산물',
      price: '30,000-80,000원',
      emoji: '🦀'
    }
  ];

  const cinemaRestaurants = {
    '영화의전당': [
      { name: '부산 전통 한정식', distance: '도보 5분', price: '2-3만원' },
      { name: '센텀 이탈리안', distance: '도보 3분', price: '1.5-2.5만원' },
      { name: '해운대 초밥', distance: '도보 7분', price: '3-5만원' },
      { name: '카페 브런치', distance: '도보 2분', price: '1-1.5만원' }
    ],
    '롯데시네마 센텀시티': [
      { name: '센텀 갈비집', distance: '도보 5분', price: '2.5-4만원' },
      { name: '일식 전문점', distance: '도보 3분', price: '2-3만원' },
      { name: '카페 브런치', distance: '도보 2분', price: '1-1.5만원' },
      { name: '패밀리 레스토랑', distance: '도보 4분', price: '1.5-2만원' }
    ],
    'CGV 센텀시티': [
      { name: '중국집', distance: '도보 3분', price: '1.5-2만원' },
      { name: '패밀리 레스토랑', distance: '도보 2분', price: '1.5-2만원' },
      { name: '치킨 전문점', distance: '도보 5분', price: '2-2.5만원' },
      { name: '햄버거 체인', distance: '도보 1분', price: '0.8-1.2만원' }
    ],
    '부산시네마센터': [
      { name: '남포동 밀면', distance: '도보 10분', price: '0.7-0.9만원' },
      { name: '자갈치 회센터', distance: '도보 15분', price: '3-5만원' },
      { name: '부산 돼지국밥', distance: '도보 8분', price: '0.8-1만원' },
      { name: '전통 찻집', distance: '도보 12분', price: '1-1.5만원' }
    ]
  };

  return (
    <Container>
      <h2>🍽️ 부산 맛집 추천</h2>

      <LocalFoodSection>
        <h3>🔥 부산 대표 향토음식</h3>
        <p>부산에 왔다면 꼭 맛봐야 할 특별한 음식들!</p>
        
        <FoodGrid>
          {localFoods.map(food => (
            <FoodCard key={food.name}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{food.emoji}</div>
              <h4>{food.name}</h4>
              <p style={{fontSize: '0.9rem', opacity: '0.9'}}>{food.description}</p>
              <p style={{fontWeight: 'bold'}}>{food.price}</p>
            </FoodCard>
          ))}
        </FoodGrid>
      </LocalFoodSection>

      <FilterSection>
        <h3><Filter size={20} /> 맛집 필터</h3>
        <FilterGrid>
          <div>
            <Label>지역</Label>
            <Select value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
              <option value="all">전체</option>
              <option value="센텀시티">센텀시티</option>
              <option value="해운대">해운대</option>
              <option value="서면">서면</option>
              <option value="남포동">남포동</option>
              <option value="자갈치시장">자갈치시장</option>
            </Select>
          </div>
          
          <div>
            <Label>음식 종류</Label>
            <Select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
              <option value="all">전체</option>
              <option value="부산향토음식">부산향토음식</option>
              <option value="해산물">해산물</option>
              <option value="한식">한식</option>
              <option value="양식">양식</option>
              <option value="일식">일식</option>
              <option value="중식">중식</option>
            </Select>
          </div>
          
          <div>
            <Label>가격대</Label>
            <Select value={filters.priceRange} onChange={(e) => handleFilterChange('priceRange', e.target.value)}>
              <option value="all">전체</option>
              <option value="1만원 이하">1만원 이하</option>
              <option value="1-2만원">1-2만원</option>
              <option value="2-3만원">2-3만원</option>
              <option value="3만원 이상">3만원 이상</option>
            </Select>
          </div>
          
          <div>
            <button
              onClick={generateAIRecommendations}
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1.5rem'
              }}
            >
              {isLoading ? '생성 중...' : '🤖 AI 맛집 추천'}
            </button>
          </div>
        </FilterGrid>
      </FilterSection>

      <h3>🍽️ 추천 맛집 ({filteredRestaurants.length}곳)</h3>
      
      <RestaurantGrid>
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id}>
            <RestaurantImage>
              🍽️
            </RestaurantImage>
            
            <RestaurantInfo>
              <RestaurantName>{restaurant.name}</RestaurantName>
              
              <div style={{marginBottom: '1rem'}}>
                <CategoryTag>{restaurant.category}</CategoryTag>
              </div>
              
              <RestaurantMeta>
                <Star size={16} fill="#ffd700" color="#ffd700" />
                <span>{restaurant.rating}</span>
                <span>({restaurant.reviewCount.toLocaleString()})</span>
              </RestaurantMeta>
              
              <RestaurantMeta>
                <MapPin size={16} />
                <span>{restaurant.location}</span>
              </RestaurantMeta>
              
              <RestaurantMeta>
                <Phone size={16} />
                <span>{restaurant.phone}</span>
              </RestaurantMeta>
              
              <RestaurantMeta>
                <Clock size={16} />
                <span>{restaurant.hours}</span>
              </RestaurantMeta>
              
              <PriceRange>
                <DollarSign size={16} style={{marginRight: '0.5rem'}} />
                {restaurant.priceRange}
              </PriceRange>
              
              <SpecialtyList>
                <h4>🍜 대표 메뉴</h4>
                {restaurant.specialty.map(item => (
                  <span key={item} style={{
                    display: 'inline-block',
                    background: '#4ecdc4',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    margin: '0.25rem 0.25rem 0.25rem 0'
                  }}>
                    {item}
                  </span>
                ))}
              </SpecialtyList>
              
              <p style={{color: '#666', fontSize: '0.9rem', lineHeight: '1.5'}}>
                {restaurant.description}
              </p>
              
              {restaurant.recommendation && (
                <p style={{color: '#4ecdc4', fontSize: '0.9rem', fontWeight: '600'}}>
                  💡 {restaurant.recommendation}
                </p>
              )}
              
              <div style={{marginTop: '1rem'}}>
                <h5>🎬 근처 영화관</h5>
                {restaurant.nearCinemas.map(cinema => (
                  <span key={cinema} style={{
                    display: 'inline-block',
                    background: '#f8f9fa',
                    color: '#666',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    margin: '0.25rem 0.25rem 0.25rem 0'
                  }}>
                    {cinema}
                  </span>
                ))}
              </div>
            </RestaurantInfo>
          </RestaurantCard>
        ))}
      </RestaurantGrid>

      <CinemaSection>
        <h3>🎬 영화관별 근처 맛집</h3>
        <CinemaGrid>
          {Object.entries(cinemaRestaurants).map(([cinema, restaurants]) => (
            <CinemaCard key={cinema}>
              <h4>🎬 {cinema}</h4>
              <p><strong>추천 맛집:</strong></p>
              <div style={{margin: '0.5rem 0'}}>
                {restaurants.map(restaurant => (
                  <div key={restaurant.name} style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    border: '1px solid #eee'
                  }}>
                    <div style={{fontWeight: '600', marginBottom: '0.25rem'}}>
                      🍽️ {restaurant.name}
                    </div>
                    <div style={{fontSize: '0.8rem', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                      <span>📍 {restaurant.distance}</span>
                      <span>💰 {restaurant.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CinemaCard>
          ))}
        </CinemaGrid>
      </CinemaSection>

      <div style={{background: '#f8f9fa', borderRadius: '10px', padding: '1.5rem', marginTop: '2rem'}}>
        <h3>💡 부산 맛집 이용 팁</h3>
        <ul style={{lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem'}}>
          <li>🕐 <strong>점심 특가:</strong> 대부분 맛집에서 점심 특가 메뉴 운영</li>
          <li>🎫 <strong>청년패스:</strong> 참여 음식점에서 5-15% 할인</li>
          <li>📱 <strong>예약 필수:</strong> 인기 맛집은 미리 예약하는 것이 좋음</li>
          <li>🚇 <strong>교통편:</strong> 지하철역 근처 맛집 위주로 선택</li>
          <li>💰 <strong>현금 할인:</strong> 일부 전통 맛집에서 현금 결제시 할인</li>
          <li>🍜 <strong>현지인 추천:</strong> 관광지보다 현지인이 가는 곳이 진짜 맛집</li>
        </ul>
      </div>
    </Container>
  );
};

export default BusanRestaurants;