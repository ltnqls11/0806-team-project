import React, { useState } from 'react';
import styled from 'styled-components';
import { ShoppingCart, Star, DollarSign, Truck, Filter, ExternalLink } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  }
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled.div`
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

const ProductImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #e74c3c;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.8rem;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
`;

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const FeatureItem = styled.li`
  padding: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;

  &:before {
    content: '✓';
    color: #27ae60;
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const BuyButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const RecommendationSection = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const RecommendationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const RecommendationCard = styled.div`
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const TravelShopping = ({ geminiService }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filters, setFilters] = useState({
    priceRange: 'all',
    brand: 'all',
    rating: 'all'
  });
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 쿠팡 파트너스 ID 가져오기
  const coupangPartnersId = process.env.REACT_APP_COUPANG_PARTNERS_ID;

  const categories = {
    'all': '전체',
    'luggage': '여행가방',
    'clothing': '여행복',
    'electronics': '전자기기',
    'accessories': '여행용품',
    'camera': '카메라',
    'comfort': '편의용품'
  };

  // 쿠팡 검색 링크 생성 함수
  const generateCoupangLink = (product) => {
    // 상품에 검색 키워드가 있으면 우선 사용, 없으면 상품명 사용
    let searchKeyword = product.searchKeywords || product.name;

    // URL 인코딩
    const encodedKeyword = encodeURIComponent(searchKeyword.trim());

    // 쿠팡 검색 페이지로 직접 이동 (파트너스 링크 없이 일반 검색)
    const coupangSearchUrl = `https://www.coupang.com/np/search?q=${encodedKeyword}&channel=user`;

    return coupangSearchUrl;
  };

  // 구매 버튼 클릭 처리
  const handlePurchase = (product) => {
    const coupangLink = generateCoupangLink(product);

    // 구매 확인 팝업
    const confirmMessage = `🛒 쿠팡에서 "${product.name}" 검색 결과로 이동합니다!

💰 참고가격: ${product.price.toLocaleString()}원
⭐ 참고평점: ${product.rating} (${product.reviewCount.toLocaleString()}개 리뷰)
🚚 배송정보: ${product.shipping}
🔍 검색어: ${product.searchKeywords || product.name}

💡 쿠팡 구매 팁:
- 여러 판매자의 상품을 비교해보세요
- 리뷰와 평점을 꼼꼼히 확인하세요
- 로켓배송 상품을 우선 선택하세요
- 쿠폰과 적립금을 활용하세요
- 가격은 실시간으로 변동될 수 있습니다

확인을 누르면 쿠팡 검색 페이지로 이동합니다.`;

    const userConfirmed = window.confirm(confirmMessage);

    if (userConfirmed) {
      // 새 창에서 쿠팡 파트너스 링크 열기
      window.open(coupangLink, '_blank', 'noopener,noreferrer');
    }
  };

  const sampleProducts = [
    {
      id: 1,
      name: '여행용 캐리어 20인치',
      category: 'luggage',
      price: 89000,
      originalPrice: 120000,
      discount: 26,
      rating: 4.5,
      reviewCount: 1250,
      brand: '삼소나이트',
      features: ['TSA 잠금장치', '360도 회전 바퀴', '확장 지퍼', '경량 소재'],
      description: 'BIFF 3박4일 여행에 최적화된 크기의 캐리어',
      shipping: '무료배송',
      icon: '🧳',
      searchKeywords: '여행용 캐리어 20인치 기내용 TSA 잠금 하드케이스'
    },
    {
      id: 2,
      name: '여행용 백팩 30L',
      category: 'luggage',
      price: 45000,
      originalPrice: 65000,
      discount: 31,
      rating: 4.3,
      reviewCount: 890,
      brand: '노스페이스',
      features: ['방수 소재', '노트북 수납', '등판 쿠션', '사이드 포켓'],
      description: '일일 여행과 영화관 이동에 편리한 백팩',
      shipping: '무료배송',
      icon: '🎒',
      searchKeywords: '여행용 백팩 30L 등산 배낭 노트북 수납 방수'
    },
    {
      id: 3,
      name: '여행용 파우치 세트',
      category: 'accessories',
      price: 25000,
      originalPrice: 35000,
      discount: 29,
      rating: 4.7,
      reviewCount: 650,
      brand: '무인양품',
      features: ['다양한 크기', '방수 소재', '투명창', '압축 기능'],
      description: '의류와 세면용품을 깔끔하게 정리할 수 있는 파우치',
      shipping: '무료배송',
      icon: '👝',
      searchKeywords: '여행용 파우치 세트 정리 수납 방수 압축'
    },
    {
      id: 4,
      name: '보조배터리 20000mAh',
      category: 'electronics',
      price: 35000,
      originalPrice: 50000,
      discount: 30,
      rating: 4.4,
      reviewCount: 420,
      brand: '아이폰',
      features: ['고속충전', '멀티포트', 'LED 표시', '안전인증'],
      description: '하루 종일 영화 관람과 사진 촬영을 위한 대용량 배터리',
      shipping: '무료배송',
      icon: '🔋',
      searchKeywords: '보조배터리 20000mAh 대용량 고속충전 휴대용'
    },
    {
      id: 5,
      name: '여행용 우산',
      category: 'accessories',
      price: 15000,
      originalPrice: 25000,
      discount: 40,
      rating: 4.2,
      reviewCount: 380,
      brand: '장우산',
      features: ['자동 개폐', '강화 프레임', '컴팩트 사이즈', 'UV 차단'],
      description: '부산의 변덕스러운 날씨에 대비한 튼튼한 우산',
      shipping: '무료배송',
      icon: '☂️',
      searchKeywords: '여행용 우산 자동 접이식 컴팩트 UV차단'
    },
    {
      id: 6,
      name: '여행용 카메라',
      category: 'camera',
      price: 450000,
      originalPrice: 550000,
      discount: 18,
      rating: 4.8,
      reviewCount: 280,
      brand: '소니',
      features: ['4K 동영상', '손떨림 보정', '와이파이 연결', '컴팩트 디자인'],
      description: 'BIFF 추억을 고화질로 기록할 수 있는 미러리스 카메라',
      shipping: '무료배송',
      icon: '📷',
      searchKeywords: '미러리스 카메라 4K 손떨림보정 여행용 컴팩트'
    }
  ];

  React.useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getFilteredProducts = () => {
    let filtered = products;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    return filtered;
  };

  const generateAIRecommendations = async () => {
    if (!geminiService) return;

    setIsLoading(true);
    try {
      const prompt = `
BIFF 여행을 위한 여행용품 추천을 JSON 형식으로 생성해주세요.

다음 조건을 고려해주세요:
- 3박4일 부산 여행
- 10월 가을 날씨 (일교차 큼, 간헐적 비)
- 영화 관람 위주의 여행
- 다양한 가격대의 상품

JSON 형식:
{
  "products": [
    {
      "name": "상품명",
      "category": "luggage/clothing/electronics/accessories/camera/comfort",
      "price": 가격(원),
      "originalPrice": 원래가격(원),
      "discount": 할인율,
      "rating": 평점(4.5),
      "reviewCount": 리뷰수,
      "brand": "브랜드명",
      "features": ["특징1", "특징2", "특징3"],
      "description": "상품 설명",
      "shipping": "배송정보",
      "icon": "이모지",
      "recommendation": "추천 이유"
    }
  ]
}

총 12-15개의 여행용품을 생성해주세요.
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
      if (data.products) {
        setProducts(data.products.map((product, index) => ({
          ...product,
          id: index + 1
        })));
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = getFilteredProducts();

  const travelRecommendations = [
    {
      title: '필수 아이템',
      items: ['캐리어/백팩', '우산', '보조배터리', '편한 신발'],
      icon: '⭐'
    },
    {
      title: '날씨 대비',
      items: ['가벼운 외투', '우산', '보온용품', '선크림'],
      icon: '🌤️'
    },
    {
      title: '영화 관람용',
      items: ['목베개', '담요', '간식통', '이어폰'],
      icon: '🎬'
    },
    {
      title: '사진 촬영용',
      items: ['카메라', '삼각대', '셀카봉', '추가 배터리'],
      icon: '📸'
    }
  ];

  return (
    <Container>
      <h2>🛍️ 여행용품 쇼핑</h2>

      <RecommendationSection>
        <h3>🎯 BIFF 여행 맞춤 추천</h3>
        <p>3박4일 부산 영화제 여행에 꼭 필요한 아이템들을 카테고리별로 추천해드려요!</p>

        <RecommendationGrid>
          {travelRecommendations.map(rec => (
            <RecommendationCard key={rec.title}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{rec.icon}</div>
              <h4>{rec.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0 0' }}>
                {rec.items.map(item => (
                  <li key={item} style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                    • {item}
                  </li>
                ))}
              </ul>
            </RecommendationCard>
          ))}
        </RecommendationGrid>
      </RecommendationSection>

      <CategoryTabs>
        {Object.entries(categories).map(([key, label]) => (
          <Tab
            key={key}
            active={activeCategory === key}
            onClick={() => setActiveCategory(key)}
          >
            {label}
          </Tab>
        ))}
      </CategoryTabs>

      <FilterSection>
        <h3><Filter size={20} /> 상품 필터</h3>
        <FilterGrid>
          <div>
            <Label>가격대</Label>
            <Select value={filters.priceRange} onChange={(e) => handleFilterChange('priceRange', e.target.value)}>
              <option value="all">전체</option>
              <option value="0-30000">3만원 이하</option>
              <option value="30000-100000">3-10만원</option>
              <option value="100000-300000">10-30만원</option>
              <option value="300000">30만원 이상</option>
            </Select>
          </div>

          <div>
            <Label>평점</Label>
            <Select value={filters.rating} onChange={(e) => handleFilterChange('rating', e.target.value)}>
              <option value="all">전체</option>
              <option value="4.5">4.5점 이상</option>
              <option value="4.0">4.0점 이상</option>
              <option value="3.5">3.5점 이상</option>
            </Select>
          </div>

          <div>
            <Label>브랜드</Label>
            <Select value={filters.brand} onChange={(e) => handleFilterChange('brand', e.target.value)}>
              <option value="all">전체</option>
              <option value="삼소나이트">삼소나이트</option>
              <option value="노스페이스">노스페이스</option>
              <option value="무인양품">무인양품</option>
              <option value="소니">소니</option>
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
              {isLoading ? '생성 중...' : '🤖 AI 상품 추천'}
            </button>
          </div>
        </FilterGrid>
      </FilterSection>

      <h3>🛒 추천 상품 ({filteredProducts.length}개)</h3>

      <ProductGrid>
        {filteredProducts.map(product => (
          <ProductCard key={product.id}>
            <ProductImage>
              {product.icon}
              {product.discount > 0 && (
                <DiscountBadge>
                  -{product.discount}%
                </DiscountBadge>
              )}
            </ProductImage>

            <ProductInfo>
              <ProductName>{product.name}</ProductName>

              <ProductMeta>
                <Star size={16} fill="#ffd700" color="#ffd700" />
                <span>{product.rating}</span>
                <span>({product.reviewCount.toLocaleString()})</span>
                <span>• {product.brand}</span>
              </ProductMeta>

              <ProductMeta>
                <Truck size={16} />
                <span>{product.shipping}</span>
              </ProductMeta>

              <PriceSection>
                <CurrentPrice>{product.price.toLocaleString()}원</CurrentPrice>
                {product.originalPrice > product.price && (
                  <OriginalPrice>{product.originalPrice.toLocaleString()}원</OriginalPrice>
                )}
              </PriceSection>

              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                {product.description}
              </p>

              {product.recommendation && (
                <p style={{ color: '#4ecdc4', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>
                  💡 {product.recommendation}
                </p>
              )}

              <FeatureList>
                {product.features.map(feature => (
                  <FeatureItem key={feature}>{feature}</FeatureItem>
                ))}
              </FeatureList>

              <BuyButton onClick={() => handlePurchase(product)}>
                <ShoppingCart size={16} />
                구매하기
                <ExternalLink size={14} />
              </BuyButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>

      <div style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', color: 'white', borderRadius: '15px', padding: '2rem', marginTop: '2rem' }}>
        <h3>🛒 쿠팡에서 간편하게 구매하세요!</h3>
        <p style={{ margin: '0 0 1.5rem 0', opacity: '0.9' }}>
          추천 상품들을 쿠팡에서 바로 구매할 수 있습니다. 로켓배송으로 빠르고 안전하게 받아보세요!
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
            <h4>로켓배송</h4>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>당일/익일 배송으로 빠른 수령</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
            <h4>간편결제</h4>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>다양한 결제 수단 지원</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
            <h4>할인혜택</h4>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>쿠폰 및 적립금 활용</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
            <h4>안심보장</h4>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>쉬운 반품/교환 서비스</p>
          </div>
        </div>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            🔍 구매하기 버튼을 클릭하면 쿠팡에서 해당 상품을 검색한 결과 페이지로 이동합니다.<br />
            � 표시된전 가격은 참고용이며, 실제 쿠팡 가격과 다를 수 있습니다.<br />
            📦 여행 전 충분한 시간을 두고 주문하시기 바랍니다.
          </p>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', borderRadius: '15px', padding: '1.5rem', marginTop: '2rem' }}>
        <h3>💡 여행용품 구매 팁</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '10px', padding: '1rem' }}>
            <h4>🛒 온라인 쇼핑</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6' }}>
              <li>여러 쇼핑몰 가격 비교</li>
              <li>리뷰와 평점 꼼꼼히 확인</li>
              <li>배송 기간 여유있게 주문</li>
              <li>반품/교환 정책 확인</li>
            </ul>
          </div>

          <div style={{ background: 'white', borderRadius: '10px', padding: '1rem' }}>
            <h4>🏪 오프라인 매장</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6' }}>
              <li>직접 체험하고 구매</li>
              <li>매장 할인 혜택 활용</li>
              <li>AS 서비스 편리함</li>
              <li>즉시 가져갈 수 있음</li>
            </ul>
          </div>

          <div style={{ background: 'white', borderRadius: '10px', padding: '1rem' }}>
            <h4>💰 할인 혜택</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6' }}>
              <li>카드사 할인 이벤트</li>
              <li>쿠폰 및 적립금 활용</li>
              <li>시즌 세일 기간 이용</li>
              <li>묶음 구매 할인</li>
            </ul>
          </div>

          <div style={{ background: 'white', borderRadius: '10px', padding: '1rem' }}>
            <h4>📦 배송 관련</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6' }}>
              <li>여행 전 충분한 시간 확보</li>
              <li>무료배송 조건 확인</li>
              <li>택배함 이용 고려</li>
              <li>배송 추적 서비스 활용</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white', borderRadius: '15px', padding: '1.5rem', marginTop: '2rem' }}>
        <h3>🎁 BIFF 기념품 쇼핑 가이드</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎬</div>
            <h4>BIFF 굿즈</h4>
            <p>공식 기념품, 포스터, 엽서 등</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍯</div>
            <h4>부산 특산품</h4>
            <p>어묵, 김, 멸치젓갈 등</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👕</div>
            <h4>부산 의류</h4>
            <p>부산 로고 티셔츠, 모자 등</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎨</div>
            <h4>수공예품</h4>
            <p>도자기, 전통 공예품 등</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TravelShopping;