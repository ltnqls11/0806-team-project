import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Umbrella } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const WeatherHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const CurrentWeather = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const WeatherCard = styled.div`
  background: ${props => props.bgColor || '#f8f9fa'};
  color: ${props => props.textColor || '#2c3e50'};
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
`;

const WeatherIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const WeatherValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const WeatherLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ForecastSection = styled.div`
  margin: 2rem 0;
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ForecastCard = styled.div`
  background: white;
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
`;

const ClothingSection = styled.div`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const ClothingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ClothingCard = styled.div`
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const TipsSection = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
`;

const TipItem = styled.li`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid #4ecdc4;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const ActivitySection = styled.div`
  margin: 2rem 0;
`;

const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ActivityCard = styled.div`
  background: ${props => props.suitable ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'};
  color: white;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const BusanWeather = () => {
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 18,
    humidity: 65,
    windSpeed: 12,
    visibility: 8,
    condition: 'partly-cloudy',
    description: '구름 많음'
  });

  const [forecast, setForecast] = useState([
    { date: '10/2', day: '수', high: 22, low: 15, condition: 'sunny', rain: 10 },
    { date: '10/3', day: '목', high: 20, low: 14, condition: 'cloudy', rain: 30 },
    { date: '10/4', day: '금', high: 19, low: 13, condition: 'rainy', rain: 70 },
    { date: '10/5', day: '토', high: 21, low: 16, condition: 'partly-cloudy', rain: 20 },
    { date: '10/6', day: '일', high: 23, low: 17, condition: 'sunny', rain: 5 },
    { date: '10/7', day: '월', high: 24, low: 18, condition: 'sunny', rain: 0 },
    { date: '10/8', day: '화', high: 22, low: 16, condition: 'cloudy', rain: 40 }
  ]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'partly-cloudy':
        return '⛅';
      case 'rainy':
        return '🌧️';
      default:
        return '🌤️';
    }
  };

  const getWeatherColor = (condition) => {
    switch (condition) {
      case 'sunny':
        return 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
      case 'cloudy':
        return 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
      case 'partly-cloudy':
        return 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
      case 'rainy':
        return 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const clothingRecommendations = [
    {
      category: '상의',
      items: ['긴팔 티셔츠', '가디건', '얇은 니트'],
      icon: '👕'
    },
    {
      category: '외투',
      items: ['가벼운 자켓', '바람막이', '얇은 코트'],
      icon: '🧥'
    },
    {
      category: '하의',
      items: ['청바지', '면바지', '레깅스'],
      icon: '👖'
    },
    {
      category: '신발',
      items: ['운동화', '로퍼', '부츠'],
      icon: '👟'
    },
    {
      category: '액세서리',
      items: ['우산', '가벼운 스카프', '모자'],
      icon: '🎒'
    }
  ];

  const weatherTips = [
    {
      icon: '🌡️',
      title: '일교차 주의',
      description: '아침저녁과 낮의 온도차가 크니 겹쳐 입기를 추천합니다.'
    },
    {
      icon: '☔',
      title: '우산 필수',
      description: '10월은 간헐적인 비가 내리니 접이식 우산을 준비하세요.'
    },
    {
      icon: '💨',
      title: '바람 대비',
      description: '해안가는 바람이 강하니 바람막이나 외투를 준비하세요.'
    },
    {
      icon: '🌊',
      title: '해수욕 비추천',
      description: '수온이 낮아 해수욕보다는 해변 산책을 추천합니다.'
    },
    {
      icon: '📸',
      title: '사진 촬영 좋음',
      description: '맑은 날이 많아 야외 사진 촬영하기 좋은 계절입니다.'
    },
    {
      icon: '🍂',
      title: '가을 정취',
      description: '단풍이 아름다운 계절이니 공원이나 산 관광을 추천합니다.'
    }
  ];

  const activities = [
    {
      name: '해변 산책',
      suitable: true,
      description: '해운대, 광안리 해변 산책하기 좋은 날씨'
    },
    {
      name: '야외 영화 관람',
      suitable: true,
      description: '야외 상영관에서 영화 감상하기 적절한 온도'
    },
    {
      name: '등산/트레킹',
      suitable: true,
      description: '금정산, 태종대 등 야외 활동하기 좋음'
    },
    {
      name: '해수욕',
      suitable: false,
      description: '수온이 낮아 해수욕은 권장하지 않음'
    },
    {
      name: '야외 카페',
      suitable: true,
      description: '테라스나 야외 카페에서 시간 보내기 좋음'
    },
    {
      name: '야시장 탐방',
      suitable: true,
      description: '저녁 시간 야시장 구경하기 적당한 날씨'
    }
  ];

  return (
    <Container>
      <h2>🌤️ 부산 날씨</h2>

      <WeatherHeader>
        <WeatherIcon>{getWeatherIcon(currentWeather.condition)}</WeatherIcon>
        <h3>현재 부산 날씨</h3>
        <p style={{fontSize: '1.2rem', margin: '0.5rem 0'}}>{currentWeather.description}</p>
        <p style={{fontSize: '0.9rem', opacity: '0.8'}}>BIFF 기간 (10월 2일-11일) 날씨 정보</p>
      </WeatherHeader>

      <CurrentWeather>
        <WeatherCard bgColor="linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)" textColor="white">
          <Thermometer size={40} />
          <WeatherValue>{currentWeather.temperature}°C</WeatherValue>
          <WeatherLabel>현재 기온</WeatherLabel>
        </WeatherCard>

        <WeatherCard bgColor="linear-gradient(135deg, #3498db 0%, #2980b9 100%)" textColor="white">
          <Droplets size={40} />
          <WeatherValue>{currentWeather.humidity}%</WeatherValue>
          <WeatherLabel>습도</WeatherLabel>
        </WeatherCard>

        <WeatherCard bgColor="linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)" textColor="white">
          <Wind size={40} />
          <WeatherValue>{currentWeather.windSpeed}km/h</WeatherValue>
          <WeatherLabel>풍속</WeatherLabel>
        </WeatherCard>

        <WeatherCard bgColor="linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)" textColor="white">
          <Eye size={40} />
          <WeatherValue>{currentWeather.visibility}km</WeatherValue>
          <WeatherLabel>가시거리</WeatherLabel>
        </WeatherCard>
      </CurrentWeather>

      <ForecastSection>
        <h3>📅 BIFF 기간 일기예보</h3>
        <ForecastGrid>
          {forecast.map((day, index) => (
            <ForecastCard key={index}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>
                {getWeatherIcon(day.condition)}
              </div>
              <div style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>
                {day.date} ({day.day})
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{color: '#e74c3c', fontWeight: 'bold'}}>{day.high}°</span>
                <span style={{color: '#3498db'}}>{day.low}°</span>
              </div>
              <div style={{fontSize: '0.8rem', color: '#666'}}>
                <Droplets size={12} style={{marginRight: '0.25rem'}} />
                {day.rain}%
              </div>
            </ForecastCard>
          ))}
        </ForecastGrid>
      </ForecastSection>

      <ClothingSection>
        <h3>👕 10월 부산 추천 옷차림</h3>
        <p>평균 기온 15-22°C, 일교차가 큰 가을 날씨에 맞는 옷차림을 준비하세요!</p>
        
        <ClothingGrid>
          {clothingRecommendations.map(category => (
            <ClothingCard key={category.category}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{category.icon}</div>
              <h4>{category.category}</h4>
              <ul style={{listStyle: 'none', padding: 0, margin: '0.5rem 0 0 0'}}>
                {category.items.map(item => (
                  <li key={item} style={{marginBottom: '0.25rem', fontSize: '0.9rem'}}>
                    • {item}
                  </li>
                ))}
              </ul>
            </ClothingCard>
          ))}
        </ClothingGrid>
      </ClothingSection>

      <TipsSection>
        <h3>💡 부산 날씨 대비 팁</h3>
        <TipsList>
          {weatherTips.map((tip, index) => (
            <TipItem key={index}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '1.5rem'}}>{tip.icon}</span>
                <strong>{tip.title}</strong>
              </div>
              <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>{tip.description}</p>
            </TipItem>
          ))}
        </TipsList>
      </TipsSection>

      <ActivitySection>
        <h3>🎯 날씨별 추천 활동</h3>
        <ActivityGrid>
          {activities.map((activity, index) => (
            <ActivityCard key={index} suitable={activity.suitable}>
              <h4>{activity.name}</h4>
              <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: '0.9'}}>
                {activity.description}
              </p>
              <div style={{marginTop: '0.5rem', fontSize: '1.2rem'}}>
                {activity.suitable ? '✅ 추천' : '❌ 비추천'}
              </div>
            </ActivityCard>
          ))}
        </ActivityGrid>
      </ActivitySection>

      <div style={{background: '#f8f9fa', borderRadius: '10px', padding: '1.5rem', marginTop: '2rem'}}>
        <h3>📊 10월 부산 날씨 특징</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div>
            <h4>🌡️ 기온</h4>
            <p>평균 최고: 22°C</p>
            <p>평균 최저: 15°C</p>
            <p>일교차: 7-8°C</p>
          </div>
          <div>
            <h4>☔ 강수</h4>
            <p>강수일수: 6-8일</p>
            <p>강수량: 60-80mm</p>
            <p>습도: 60-70%</p>
          </div>
          <div>
            <h4>💨 바람</h4>
            <p>평균 풍속: 10-15km/h</p>
            <p>주풍향: 북동풍</p>
            <p>해안가 바람 강함</p>
          </div>
          <div>
            <h4>🌅 일조</h4>
            <p>일출: 06:50</p>
            <p>일몰: 18:20</p>
            <p>일조시간: 6-7시간</p>
          </div>
        </div>
      </div>

      <div style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)', color: 'white', borderRadius: '10px', padding: '1.5rem', marginTop: '2rem'}}>
        <h3><Umbrella size={24} /> 비 오는 날 실내 활동 추천</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
          <div>
            <h4>🎬 영화 관람</h4>
            <p>BIFF 상영작 감상</p>
            <p>실내 영화관 이용</p>
          </div>
          <div>
            <h4>🏛️ 박물관/미술관</h4>
            <p>부산시립미술관</p>
            <p>국립해양박물관</p>
          </div>
          <div>
            <h4>🛍️ 쇼핑</h4>
            <p>센텀시티 몰</p>
            <p>서면 지하상가</p>
          </div>
          <div>
            <h4>☕ 카페/찻집</h4>
            <p>실내 카페에서 휴식</p>
            <p>전통 찻집 체험</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BusanWeather;