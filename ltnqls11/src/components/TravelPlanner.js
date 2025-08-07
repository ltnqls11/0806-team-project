import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, MapPin, DollarSign, Download, Save } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const PlannerForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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

const Checkbox = styled.input`
  margin: 0;
`;

const GenerateButton = styled.button`
  padding: 1rem 2rem;
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

const ItineraryContainer = styled.div`
  margin-top: 2rem;
`;

const ItineraryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.variant === 'save' ? '#27ae60' : '#3498db'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const DayCard = styled.div`
  background: white;
  border: 2px solid #eee;
  border-radius: 15px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
`;

const DayHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DayTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DayBudget = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
`;

const ScheduleList = styled.div`
  padding: 1.5rem;
`;

const ScheduleItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-left: 4px solid #4ecdc4;
  background: #f8f9fa;
  border-radius: 0 10px 10px 0;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #e8f4f8;
    transform: translateX(5px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TimeInfo = styled.div`
  min-width: 80px;
  text-align: center;
`;

const Time = styled.div`
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1rem;
`;

const Duration = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActivityDetails = styled.div`
  color: #666;
  margin-bottom: 0.5rem;
`;

const ActivityLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4ecdc4;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ActivityTips = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.9rem;
  color: #856404;
`;

const CostInfo = styled.div`
  min-width: 100px;
  text-align: right;
`;

const Cost = styled.div`
  font-weight: bold;
  color: #e74c3c;
  font-size: 1.1rem;
`;

const Transport = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const SummarySection = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
`;

const SummaryTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #2c3e50;
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SummaryItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
`;

const TravelPlanner = ({ geminiService }) => {
  const [plannerParams, setPlannerParams] = useState({
    days: 3,
    interests: [],
    budget: '보통 (1일 5-10만원)',
    travelStyle: '관광 + 영화 균형'
  });
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const interestOptions = [
    '영화', '맛집', '관광', '쇼핑', '사진', '문화', '예술', '역사', '자연', '휴식'
  ];

  const handleInputChange = (field, value) => {
    setPlannerParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestChange = (interest, checked) => {
    setPlannerParams(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const generateItinerary = async () => {
    if (!geminiService || plannerParams.interests.length === 0) {
      alert('관심사를 하나 이상 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await geminiService.generateItinerary(
        plannerParams.days,
        plannerParams.interests,
        plannerParams.budget,
        plannerParams.travelStyle
      );
      
      if (result) {
        setItinerary(result);
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert('일정 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveItinerary = () => {
    if (itinerary) {
      const savedItineraries = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
      const newItinerary = {
        id: Date.now(),
        ...itinerary,
        savedAt: new Date().toISOString(),
        params: plannerParams
      };
      savedItineraries.push(newItinerary);
      localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries));
      alert('일정이 저장되었습니다!');
    }
  };

  const downloadItinerary = () => {
    if (itinerary) {
      const content = JSON.stringify(itinerary, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BIFF_여행일정_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getActivityIcon = (category) => {
    const icons = {
      '영화': '🎬',
      '관광': '🏛️',
      '식사': '🍽️',
      '쇼핑': '🛍️',
      '휴식': '☕',
      '교통': '🚇',
      '숙박': '🏨'
    };
    return icons[category] || '📍';
  };

  return (
    <Container>
      <h2>📅 여행 계획 생성</h2>
      
      <PlannerForm>
        <FormGroup>
          <Label>여행 기간</Label>
          <Select
            value={plannerParams.days}
            onChange={(e) => handleInputChange('days', parseInt(e.target.value))}
          >
            <option value={2}>2일</option>
            <option value={3}>3일</option>
            <option value={4}>4일</option>
            <option value={5}>5일</option>
            <option value={7}>7일</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>예산 수준</Label>
          <Select
            value={plannerParams.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
          >
            <option value="저예산 (1일 5만원 이하)">저예산 (1일 5만원 이하)</option>
            <option value="보통 (1일 5-10만원)">보통 (1일 5-10만원)</option>
            <option value="고예산 (1일 10만원 이상)">고예산 (1일 10만원 이상)</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>여행 스타일</Label>
          <Select
            value={plannerParams.travelStyle}
            onChange={(e) => handleInputChange('travelStyle', e.target.value)}
          >
            <option value="영화 중심 (BIFF 집중)">영화 중심 (BIFF 집중)</option>
            <option value="관광 + 영화 균형">관광 + 영화 균형</option>
            <option value="영화 + 포토존">영화 + 포토존</option>
            <option value="맛집 + 영화">맛집 + 영화</option>
          </Select>
        </FormGroup>
        
        <FormGroup style={{gridColumn: '1 / -1'}}>
          <Label>관심사 (복수 선택 가능)</Label>
          <CheckboxGroup>
            {interestOptions.map(interest => (
              <CheckboxItem key={interest}>
                <Checkbox
                  type="checkbox"
                  checked={plannerParams.interests.includes(interest)}
                  onChange={(e) => handleInterestChange(interest, e.target.checked)}
                />
                {interest}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FormGroup>
        
        <GenerateButton onClick={generateItinerary} disabled={isLoading}>
          <Calendar size={20} />
          {isLoading ? '일정 생성 중...' : '일정 생성'}
        </GenerateButton>
      </PlannerForm>

      {isLoading && (
        <LoadingMessage>
          AI가 맞춤형 여행 일정을 생성하고 있습니다...
        </LoadingMessage>
      )}

      {itinerary && (
        <ItineraryContainer>
          <ItineraryHeader>
            <h3>🎬 BIFF {plannerParams.days}일 여행 일정</h3>
            <ActionButtons>
              <ActionButton variant="save" onClick={saveItinerary}>
                <Save size={16} />
                저장
              </ActionButton>
              <ActionButton onClick={downloadItinerary}>
                <Download size={16} />
                다운로드
              </ActionButton>
            </ActionButtons>
          </ItineraryHeader>

          {itinerary.itinerary?.map(day => (
            <DayCard key={day.day}>
              <DayHeader>
                <DayTitle>
                  <Calendar size={20} />
                  Day {day.day}: {day.theme}
                </DayTitle>
                <DayBudget>
                  <DollarSign size={16} />
                  {day.daily_budget?.toLocaleString()}원
                </DayBudget>
              </DayHeader>
              
              <ScheduleList>
                {day.schedule?.map((activity, index) => (
                  <ScheduleItem key={index}>
                    <TimeInfo>
                      <Time>{activity.time}</Time>
                      <Duration>
                        <Clock size={14} />
                        {activity.duration}분
                      </Duration>
                    </TimeInfo>
                    
                    <ActivityInfo>
                      <ActivityName>
                        {getActivityIcon(activity.category)}
                        {activity.activity}
                      </ActivityName>
                      <ActivityLocation>
                        <MapPin size={16} />
                        {activity.location}
                      </ActivityLocation>
                      <ActivityDetails>
                        {activity.description}
                      </ActivityDetails>
                      {activity.tips && (
                        <ActivityTips>
                          💡 {activity.tips}
                        </ActivityTips>
                      )}
                    </ActivityInfo>
                    
                    <CostInfo>
                      <Cost>{parseInt(activity.cost || 0).toLocaleString()}원</Cost>
                      <Transport>{activity.transport}</Transport>
                    </CostInfo>
                  </ScheduleItem>
                ))}
              </ScheduleList>
            </DayCard>
          ))}

          <SummarySection>
            <h3>📋 여행 정보 요약</h3>
            <SummaryGrid>
              <SummaryCard>
                <SummaryTitle>💰 총 예산</SummaryTitle>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c'}}>
                  {itinerary.total_budget?.toLocaleString()}원
                </div>
              </SummaryCard>
              
              <SummaryCard>
                <SummaryTitle>🎬 추천 영화</SummaryTitle>
                <SummaryList>
                  {itinerary.recommended_movies?.slice(0, 3).map((movie, index) => (
                    <SummaryItem key={index}>
                      <strong>{movie.title}</strong><br />
                      {movie.venue} - {movie.time}
                    </SummaryItem>
                  ))}
                </SummaryList>
              </SummaryCard>
              
              <SummaryCard>
                <SummaryTitle>💡 여행 팁</SummaryTitle>
                <SummaryList>
                  {itinerary.travel_tips?.slice(0, 3).map((tip, index) => (
                    <SummaryItem key={index}>{tip}</SummaryItem>
                  ))}
                </SummaryList>
              </SummaryCard>
              
              <SummaryCard>
                <SummaryTitle>🎒 준비물</SummaryTitle>
                <SummaryList>
                  {itinerary.packing_checklist?.slice(0, 5).map((item, index) => (
                    <SummaryItem key={index}>{item}</SummaryItem>
                  ))}
                </SummaryList>
              </SummaryCard>
            </SummaryGrid>
          </SummarySection>
        </ItineraryContainer>
      )}

      {!itinerary && !isLoading && (
        <div style={{marginTop: '2rem'}}>
          <h3>📋 샘플 일정 미리보기</h3>
          <div style={{background: '#f8f9fa', borderRadius: '15px', padding: '2rem'}}>
            <h4>🎬 BIFF 3박4일 샘플 일정</h4>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #667eea'}}>
                <h5>📅 Day 1: BIFF 개막 & 센텀시티</h5>
                <ul style={{margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6'}}>
                  <li>09:00 - 센텀시티역 도착 & 체크인</li>
                  <li>10:30 - 영화의전당 투어</li>
                  <li>14:00 - BIFF 개막작 관람</li>
                  <li>17:00 - 센텀시티 맛집 탐방</li>
                  <li>19:30 - 광안대교 야경 감상</li>
                </ul>
              </div>
              
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #4ecdc4'}}>
                <h5>📅 Day 2: 영화 관람 & 해운대</h5>
                <ul style={{margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6'}}>
                  <li>10:00 - 추천 영화 관람</li>
                  <li>13:00 - 해운대 이동 & 점심</li>
                  <li>15:00 - 해운대 해수욕장 산책</li>
                  <li>17:00 - 동백섬 & 누리마루 APEC하우스</li>
                  <li>19:00 - 해운대 맛집 저녁</li>
                </ul>
              </div>
              
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #27ae60'}}>
                <h5>📅 Day 3: 부산 관광 & 영화</h5>
                <ul style={{margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6'}}>
                  <li>09:00 - 감천문화마을 방문</li>
                  <li>12:00 - 자갈치시장 점심</li>
                  <li>14:30 - BIFF 영화 관람</li>
                  <li>17:30 - 남포동 쇼핑</li>
                  <li>19:00 - 부산타워 야경</li>
                </ul>
              </div>
              
              <div style={{background: 'white', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #e74c3c'}}>
                <h5>📅 Day 4: 마지막 영화 & 출발</h5>
                <ul style={{margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6'}}>
                  <li>10:00 - 체크아웃 & 짐 보관</li>
                  <li>11:00 - BIFF 폐막작 관람</li>
                  <li>14:00 - 기념품 쇼핑</li>
                  <li>16:00 - 부산역/공항 이동</li>
                  <li>18:00 - 출발</li>
                </ul>
              </div>
            </div>
            
            <div style={{marginTop: '1.5rem', padding: '1rem', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)', color: 'white', borderRadius: '10px'}}>
              <h4 style={{margin: '0 0 0.5rem 0'}}>💡 일정 계획 팁</h4>
              <ul style={{margin: 0, paddingLeft: '1rem', lineHeight: '1.6'}}>
                <li>🎬 영화 예매는 미리 해두세요</li>
                <li>🚇 청년패스로 교통비 절약</li>
                <li>🍽️ 부산 향토음식 꼭 체험</li>
                <li>📸 포토존에서 인증샷 필수</li>
                <li>☔ 우산 준비 (10월 날씨 변덕)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default TravelPlanner;