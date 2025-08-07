import React, { useState } from 'react';
import styled from 'styled-components';
import { Train, Bus, MapPin, CreditCard, Clock, Navigation } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const TransportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TransportCard = styled.div`
  background: ${props => props.bgColor || '#f8f9fa'};
  color: ${props => props.textColor || '#2c3e50'};
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
`;

const SubwayLine = styled.div`
  background: ${props => props.color};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin: 0.5rem 0;
  font-weight: 600;
  text-align: center;
`;

const RouteInfo = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const PriceCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const CinemaRouteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const CinemaCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  border-left: 4px solid #4ecdc4;
`;

const YouthPassSection = styled.div`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const BenefitList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const BenefitItem = styled.div`
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const RouteCalculator = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
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

const Button = styled.button`
  padding: 0.75rem 1.5rem;
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

const ResultCard = styled.div`
  background: white;
  border: 2px solid #4ecdc4;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
`;

const BusanTransport = () => {
  const [routeCalculator, setRouteCalculator] = useState({
    from: '',
    to: '',
    result: null
  });

  const subwayLines = [
    { number: 1, color: '#FF6B35', name: '1호선', route: '다대포해수욕장 ↔ 노포' },
    { number: 2, color: '#4ECDC4', name: '2호선', route: '장산 ↔ 양산' },
    { number: 3, color: '#8B4513', name: '3호선', route: '수영 ↔ 대저' },
    { number: 4, color: '#4169E1', name: '4호선', route: '미남 ↔ 안평' }
  ];

  const transportPrices = {
    subway: { adult: 1370, student: 1000, senior: 1000 },
    bus: { adult: 1200, student: 800, senior: 800 },
    youthPass: { discount: 20 }
  };

  const cinemaRoutes = [
    {
      name: '영화의전당',
      route: '지하철 2호선 센텀시티역 3번 출구',
      walkTime: '도보 3분',
      busRoutes: ['1003', '1005', '139', '140']
    },
    {
      name: '롯데시네마 센텀시티',
      route: '지하철 2호선 센텀시티역 4번 출구',
      walkTime: '도보 5분',
      busRoutes: ['1003', '1005', '139']
    },
    {
      name: 'CGV 센텀시티',
      route: '지하철 2호선 센텀시티역 1번 출구',
      walkTime: '도보 2분',
      busRoutes: ['1003', '1005']
    },
    {
      name: '부산시네마센터',
      route: '지하철 1호선 중앙역 7번 출구',
      walkTime: '도보 10분',
      busRoutes: ['2', '6', '7', '15']
    }
  ];

  const majorStations = [
    '부산역', '서면역', '해운대역', '센텀시티역', '남포역', '중앙역',
    '사상역', '덕천역', '동래역', '연산역', '수영역', '광안역'
  ];

  const calculateRoute = () => {
    if (!routeCalculator.from || !routeCalculator.to) {
      alert('출발지와 도착지를 선택해주세요.');
      return;
    }

    // 간단한 경로 계산 시뮬레이션
    const routes = [
      {
        type: '지하철',
        time: '25분',
        cost: '1,370원',
        transfers: 1,
        description: `${routeCalculator.from} → 서면역 → ${routeCalculator.to}`
      },
      {
        type: '버스',
        time: '35분',
        cost: '1,200원',
        transfers: 0,
        description: `직행버스 이용`
      },
      {
        type: '지하철+버스',
        time: '30분',
        cost: '2,570원',
        transfers: 1,
        description: `${routeCalculator.from} → 지하철 → 버스 → ${routeCalculator.to}`
      }
    ];

    setRouteCalculator(prev => ({
      ...prev,
      result: routes
    }));
  };

  return (
    <Container>
      <h2>🚇 부산 교통 정보</h2>

      <TransportGrid>
        <TransportCard bgColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" textColor="white">
          <h3><Train size={24} /> 지하철 노선</h3>
          {subwayLines.map(line => (
            <SubwayLine key={line.number} color={line.color}>
              {line.name}: {line.route}
            </SubwayLine>
          ))}
        </TransportCard>

        <TransportCard bgColor="linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)" textColor="white">
          <h3><Bus size={24} /> 버스 정보</h3>
          <div style={{marginTop: '1rem'}}>
            <p><strong>🚌 일반버스:</strong> 1,200원</p>
            <p><strong>🚐 마을버스:</strong> 1,000원</p>
            <p><strong>🚌 급행버스:</strong> 1,700원</p>
            <p><strong>🌙 심야버스:</strong> 1,800원</p>
          </div>
        </TransportCard>
      </TransportGrid>

      <PriceCard>
        <h3><CreditCard size={24} /> 교통비 안내</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
          <div>
            <h4>🚇 지하철</h4>
            <p>일반: {transportPrices.subway.adult.toLocaleString()}원</p>
            <p>학생: {transportPrices.subway.student.toLocaleString()}원</p>
          </div>
          <div>
            <h4>🚌 버스</h4>
            <p>일반: {transportPrices.bus.adult.toLocaleString()}원</p>
            <p>학생: {transportPrices.bus.student.toLocaleString()}원</p>
          </div>
          <div>
            <h4>🎉 청년패스</h4>
            <p>{transportPrices.youthPass.discount}% 할인</p>
            <p>지하철: {Math.floor(transportPrices.subway.adult * 0.8).toLocaleString()}원</p>
          </div>
        </div>
      </PriceCard>

      <YouthPassSection>
        <h3>🎉 부산 청년패스 혜택</h3>
        <p>만 19~34세 청년을 위한 특별 할인 혜택!</p>
        
        <BenefitList>
          <BenefitItem>
            <h4>🚇 교통 할인</h4>
            <p>지하철·버스 20% 할인</p>
          </BenefitItem>
          <BenefitItem>
            <h4>🎬 문화 할인</h4>
            <p>영화관·박물관 10% 할인</p>
          </BenefitItem>
          <BenefitItem>
            <h4>🍽️ 식당 할인</h4>
            <p>참여 음식점 5-15% 할인</p>
          </BenefitItem>
          <BenefitItem>
            <h4>🛍️ 쇼핑 할인</h4>
            <p>참여 매장 5-20% 할인</p>
          </BenefitItem>
        </BenefitList>
      </YouthPassSection>

      <div>
        <h3>🎬 영화관별 교통편</h3>
        <CinemaRouteGrid>
          {cinemaRoutes.map(cinema => (
            <CinemaCard key={cinema.name}>
              <h4><MapPin size={16} /> {cinema.name}</h4>
              <p><strong>🚇 지하철:</strong> {cinema.route}</p>
              <p><strong>🚶‍♀️ 도보:</strong> {cinema.walkTime}</p>
              <p><strong>🚌 버스:</strong> {cinema.busRoutes.join(', ')}번</p>
            </CinemaCard>
          ))}
        </CinemaRouteGrid>
      </div>

      <RouteCalculator>
        <h3><Navigation size={20} /> 경로 검색</h3>
        <CalculatorGrid>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>출발지</label>
            <Select 
              value={routeCalculator.from} 
              onChange={(e) => setRouteCalculator(prev => ({...prev, from: e.target.value}))}
            >
              <option value="">선택하세요</option>
              {majorStations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </Select>
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>도착지</label>
            <Select 
              value={routeCalculator.to} 
              onChange={(e) => setRouteCalculator(prev => ({...prev, to: e.target.value}))}
            >
              <option value="">선택하세요</option>
              {majorStations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </Select>
          </div>
          
          <div style={{alignSelf: 'end'}}>
            <Button onClick={calculateRoute}>
              🔍 경로 검색
            </Button>
          </div>
        </CalculatorGrid>

        {routeCalculator.result && (
          <div style={{marginTop: '1rem'}}>
            <h4>📍 검색 결과: {routeCalculator.from} → {routeCalculator.to}</h4>
            {routeCalculator.result.map((route, index) => (
              <ResultCard key={index}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                  <h5>{route.type}</h5>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <span><Clock size={16} /> {route.time}</span>
                    <span><CreditCard size={16} /> {route.cost}</span>
                  </div>
                </div>
                <p>{route.description}</p>
                <p><strong>환승:</strong> {route.transfers}회</p>
              </ResultCard>
            ))}
          </div>
        )}
      </RouteCalculator>

      <RouteInfo>
        <h3>💡 교통 이용 팁</h3>
        <ul style={{lineHeight: '1.8'}}>
          <li>🎫 <strong>1일 교통카드:</strong> 4회 이상 이용시 경제적</li>
          <li>🕐 <strong>러시아워 피하기:</strong> 오전 7-9시, 오후 6-8시 혼잡</li>
          <li>📱 <strong>부산교통공사 앱:</strong> 실시간 지하철 정보 확인</li>
          <li>🚇 <strong>센텀시티 집중:</strong> 주요 영화관이 모여있어 도보 이동 가능</li>
          <li>🌙 <strong>막차 시간:</strong> 지하철 오후 11:30, 버스 오후 11:00</li>
          <li>💳 <strong>교통카드:</strong> 현금보다 100원 저렴</li>
        </ul>
      </RouteInfo>

      <div style={{background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white', borderRadius: '15px', padding: '1.5rem', marginTop: '2rem'}}>
        <h3>📱 실시간 교통 정보</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
          <div style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center'}}>
            <h4>🚇 지하철 앱</h4>
            <p>부산교통공사 앱</p>
            <p style={{fontSize: '0.8rem', opacity: '0.9'}}>실시간 도착정보</p>
          </div>
          <div style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center'}}>
            <h4>🚌 버스 앱</h4>
            <p>부산버스 앱</p>
            <p style={{fontSize: '0.8rem', opacity: '0.9'}}>버스 위치 추적</p>
          </div>
          <div style={{background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center'}}>
            <h4>🗺️ 네비게이션</h4>
            <p>카카오맵, 네이버맵</p>
            <p style={{fontSize: '0.8rem', opacity: '0.9'}}>최적 경로 안내</p>
          </div>
        </div>
      </div>

      <div style={{background: '#f8f9fa', borderRadius: '10px', padding: '1rem', marginTop: '2rem'}}>
        <h4>📞 교통 관련 문의</h4>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div>
            <strong>🚇 부산교통공사</strong><br />
            전화: 1577-5555<br />
            홈페이지: www.humetro.busan.kr
          </div>
          <div>
            <strong>🚌 부산시 버스정보</strong><br />
            전화: 120<br />
            홈페이지: bus.busan.go.kr
          </div>
          <div>
            <strong>🎉 청년패스 문의</strong><br />
            전화: 051-888-1234<br />
            홈페이지: youth.busan.go.kr
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BusanTransport;