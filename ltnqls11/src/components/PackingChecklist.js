import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CheckSquare, Square, Plus, Trash2, Download, Upload } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const ChecklistHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
  height: 10px;
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background: white;
  height: 100%;
  border-radius: 10px;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
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

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
`;

const CategoryTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryProgress = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ItemList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.5rem;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.checked ? '#e8f5e8' : 'white'};
  border: 2px solid ${props => props.checked ? '#27ae60' : '#eee'};
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  }
`;

const ItemText = styled.span`
  flex: 1;
  text-decoration: ${props => props.checked ? 'line-through' : 'none'};
  color: ${props => props.checked ? '#666' : '#2c3e50'};
  font-weight: ${props => props.checked ? 'normal' : '500'};
`;

const ItemNote = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
`;

const AddItemSection = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const AddItemForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
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

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.variant === 'danger' ? '#e74c3c' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const WeatherTips = styled.div`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TipCard = styled.div`
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const PackingChecklist = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [customItems, setCustomItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '기타', note: '' });

  const defaultCategories = {
    '의류': {
      icon: '👕',
      items: [
        { name: '긴팔 티셔츠 (2-3벌)', note: '일교차 대비' },
        { name: '가디건 또는 얇은 니트', note: '아침저녁 추위 대비' },
        { name: '가벼운 외투/자켓', note: '바람막이 겸용' },
        { name: '청바지 또는 면바지', note: '편안한 활동복' },
        { name: '속옷 (여행일수+1벌)', note: '여분 준비' },
        { name: '양말 (여행일수+1켤레)', note: '면 소재 추천' },
        { name: '잠옷', note: '편안한 숙면용' },
        { name: '운동화', note: '많이 걸을 예정' },
        { name: '슬리퍼', note: '숙소용' }
      ]
    },
    '세면용품': {
      icon: '🧴',
      items: [
        { name: '칫솔/치약', note: '여행용 소용량' },
        { name: '샴푸/린스', note: '소용량 또는 숙소 제공 확인' },
        { name: '바디워시', note: '소용량' },
        { name: '세안용품', note: '클렌징폼 등' },
        { name: '수건', note: '빠른 건조 소재' },
        { name: '기초화장품', note: '스킨케어 세트' },
        { name: '선크림', note: 'SPF30 이상' },
        { name: '립밤', note: '건조한 날씨 대비' }
      ]
    },
    '전자기기': {
      icon: '📱',
      items: [
        { name: '스마트폰', note: '필수품' },
        { name: '충전기', note: '스마트폰용' },
        { name: '보조배터리', note: '10000mAh 이상' },
        { name: '충전케이블', note: '여분 준비' },
        { name: '카메라', note: '추억 기록용' },
        { name: '카메라 배터리/메모리카드', note: '여분 준비' },
        { name: '이어폰', note: '영화 감상용' },
        { name: '멀티탭', note: '숙소에서 유용' }
      ]
    },
    '여행용품': {
      icon: '🎒',
      items: [
        { name: '여행가방/캐리어', note: '적정 크기' },
        { name: '백팩/크로스백', note: '일일 외출용' },
        { name: '우산', note: '접이식 추천' },
        { name: '모자', note: '햇빛 차단용' },
        { name: '선글라스', note: '야외 활동용' },
        { name: '물병', note: '텀블러 또는 페트병' },
        { name: '비닐봉지', note: '젖은 옷 보관용' },
        { name: '여행용 세탁세제', note: '간단한 빨래용' }
      ]
    },
    '서류/금융': {
      icon: '📄',
      items: [
        { name: '신분증', note: '주민등록증/운전면허증' },
        { name: '교통카드', note: '부산 지역 호환' },
        { name: '신용카드/체크카드', note: '2장 이상 준비' },
        { name: '현금', note: '비상용 + 전통시장용' },
        { name: '숙소 예약 확인서', note: '모바일 또는 인쇄본' },
        { name: '교통편 예약 확인서', note: 'KTX/버스 등' },
        { name: '여행 일정표', note: '인쇄본 또는 모바일' },
        { name: '청년패스', note: '할인 혜택용' }
      ]
    },
    '의약품': {
      icon: '💊',
      items: [
        { name: '개인 상비약', note: '평소 복용 약물' },
        { name: '해열진통제', note: '타이레놀 등' },
        { name: '소화제', note: '맛집 탐방 대비' },
        { name: '감기약', note: '일교차 대비' },
        { name: '밴드', note: '상처 치료용' },
        { name: '멀미약', note: '교통편 이용시' },
        { name: '알레르기약', note: '필요시' },
        { name: '마스크', note: '개인 위생용' }
      ]
    },
    'BIFF 특화': {
      icon: '🎬',
      items: [
        { name: 'BIFF 티켓', note: '예매 확인 및 인쇄' },
        { name: '영화 상영 일정표', note: '모바일 또는 인쇄본' },
        { name: '필기구/메모장', note: '영화 후기 작성용' },
        { name: '간식', note: '영화 관람용' },
        { name: '목베개', note: '긴 상영시간 대비' },
        { name: '담요', note: '야외 상영 대비' },
        { name: '포토카드/굿즈 보관함', note: '기념품 보관용' },
        { name: '사인펜', note: '사인 받을 때' }
      ]
    }
  };

  const allItems = Object.entries(defaultCategories).flatMap(([category, data]) =>
    data.items.map(item => ({ ...item, category, id: `${category}-${item.name}` }))
  ).concat(customItems);

  const getFilteredItems = () => {
    if (activeCategory === 'all') return allItems;
    return allItems.filter(item => item.category === activeCategory);
  };

  const getProgress = () => {
    const totalItems = allItems.length;
    const checkedCount = checkedItems.size;
    return totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;
  };

  const getCategoryProgress = (category) => {
    const categoryItems = allItems.filter(item => item.category === category);
    const checkedCount = categoryItems.filter(item => checkedItems.has(item.id)).length;
    return categoryItems.length > 0 ? Math.round((checkedCount / categoryItems.length) * 100) : 0;
  };

  const toggleItem = (itemId) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const addCustomItem = () => {
    if (!newItem.name.trim()) return;

    const customItem = {
      ...newItem,
      id: `custom-${Date.now()}`,
      isCustom: true
    };

    setCustomItems(prev => [...prev, customItem]);
    setNewItem({ name: '', category: '기타', note: '' });
  };

  const removeCustomItem = (itemId) => {
    setCustomItems(prev => prev.filter(item => item.id !== itemId));
    const newCheckedItems = new Set(checkedItems);
    newCheckedItems.delete(itemId);
    setCheckedItems(newCheckedItems);
  };

  const exportChecklist = () => {
    const checklistData = {
      checkedItems: Array.from(checkedItems),
      customItems: customItems,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(checklistData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BIFF_여행_체크리스트_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importChecklist = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.checkedItems) {
          setCheckedItems(new Set(data.checkedItems));
        }
        if (data.customItems) {
          setCustomItems(data.customItems);
        }
      } catch (error) {
        alert('파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  const resetChecklist = () => {
    if (window.confirm('체크리스트를 초기화하시겠습니까?')) {
      setCheckedItems(new Set());
      setCustomItems([]);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('biff-checklist');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCheckedItems(new Set(data.checkedItems || []));
        setCustomItems(data.customItems || []);
      } catch (error) {
        console.error('Failed to load saved checklist:', error);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      checkedItems: Array.from(checkedItems),
      customItems: customItems
    };
    localStorage.setItem('biff-checklist', JSON.stringify(data));
  }, [checkedItems, customItems]);

  const categories = Object.keys(defaultCategories);
  const progress = getProgress();

  return (
    <Container>
      <h2>🧳 BIFF 여행 짐 체크리스트</h2>

      <ChecklistHeader>
        <h3>📋 여행 준비 진행률</h3>
        <div style={{fontSize: '2rem', margin: '1rem 0'}}>
          {progress}% 완료
        </div>
        <div style={{fontSize: '1rem', opacity: '0.9'}}>
          {checkedItems.size} / {allItems.length} 항목 완료
        </div>
        <ProgressBar>
          <ProgressFill percentage={progress} />
        </ProgressBar>
      </ChecklistHeader>

      <ActionButtons>
        <Button onClick={exportChecklist}>
          <Download size={16} />
          체크리스트 내보내기
        </Button>
        <label>
          <Button as="span">
            <Upload size={16} />
            체크리스트 가져오기
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={importChecklist}
            style={{display: 'none'}}
          />
        </label>
        <Button variant="danger" onClick={resetChecklist}>
          <Trash2 size={16} />
          초기화
        </Button>
      </ActionButtons>

      <CategoryTabs>
        <Tab
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        >
          전체 ({allItems.length})
        </Tab>
        {categories.map(category => (
          <Tab
            key={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {defaultCategories[category].icon} {category} ({getCategoryProgress(category)}%)
          </Tab>
        ))}
      </CategoryTabs>

      <AddItemSection>
        <h3><Plus size={20} /> 개인 항목 추가</h3>
        <AddItemForm>
          <div>
            <Input
              type="text"
              placeholder="항목명"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({...prev, name: e.target.value}))}
            />
            <Input
              type="text"
              placeholder="메모 (선택사항)"
              value={newItem.note}
              onChange={(e) => setNewItem(prev => ({...prev, note: e.target.value}))}
              style={{marginTop: '0.5rem'}}
            />
          </div>
          <Select
            value={newItem.category}
            onChange={(e) => setNewItem(prev => ({...prev, category: e.target.value}))}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
            <option value="기타">기타</option>
          </Select>
          <Button onClick={addCustomItem}>
            <Plus size={16} />
            추가
          </Button>
        </AddItemForm>
      </AddItemSection>

      {activeCategory === 'all' ? (
        categories.map(category => (
          <CategorySection key={category}>
            <CategoryHeader>
              <CategoryTitle>
                <span style={{fontSize: '1.5rem'}}>{defaultCategories[category].icon}</span>
                {category}
              </CategoryTitle>
              <CategoryProgress>
                {getCategoryProgress(category)}% 완료
              </CategoryProgress>
            </CategoryHeader>
            <ItemList>
              {allItems
                .filter(item => item.category === category)
                .map(item => (
                  <ChecklistItem
                    key={item.id}
                    checked={checkedItems.has(item.id)}
                    onClick={() => toggleItem(item.id)}
                  >
                    {checkedItems.has(item.id) ? (
                      <CheckSquare size={20} color="#27ae60" />
                    ) : (
                      <Square size={20} color="#ccc" />
                    )}
                    <div style={{flex: 1}}>
                      <ItemText checked={checkedItems.has(item.id)}>
                        {item.name}
                      </ItemText>
                      {item.note && (
                        <ItemNote>{item.note}</ItemNote>
                      )}
                    </div>
                    {item.isCustom && (
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomItem(item.id);
                        }}
                        style={{padding: '0.25rem', minWidth: 'auto'}}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </ChecklistItem>
                ))}
            </ItemList>
          </CategorySection>
        ))
      ) : (
        <CategorySection>
          <ItemList>
            {getFilteredItems().map(item => (
              <ChecklistItem
                key={item.id}
                checked={checkedItems.has(item.id)}
                onClick={() => toggleItem(item.id)}
              >
                {checkedItems.has(item.id) ? (
                  <CheckSquare size={20} color="#27ae60" />
                ) : (
                  <Square size={20} color="#ccc" />
                )}
                <div style={{flex: 1}}>
                  <ItemText checked={checkedItems.has(item.id)}>
                    {item.name}
                  </ItemText>
                  {item.note && (
                    <ItemNote>{item.note}</ItemNote>
                  )}
                </div>
                {item.isCustom && (
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomItem(item.id);
                    }}
                    style={{padding: '0.25rem', minWidth: 'auto'}}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </ChecklistItem>
            ))}
          </ItemList>
        </CategorySection>
      )}

      <WeatherTips>
        <h3>🌤️ 10월 부산 날씨 대비 팁</h3>
        <p>일교차가 큰 가을 날씨에 맞춰 짐을 준비하세요!</p>
        
        <TipsGrid>
          <TipCard>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🧥</div>
            <h4>겹쳐 입기</h4>
            <p>아침저녁 추위와 낮 더위에 대비해 여러 겹으로 입을 수 있는 옷 준비</p>
          </TipCard>
          <TipCard>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>☔</div>
            <h4>우산 필수</h4>
            <p>간헐적인 비에 대비해 접이식 우산이나 우비 준비</p>
          </TipCard>
          <TipCard>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>👟</div>
            <h4>편한 신발</h4>
            <p>많은 걸음과 다양한 지형에 대비해 편안한 운동화 필수</p>
          </TipCard>
          <TipCard>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🧴</div>
            <h4>보습 용품</h4>
            <p>건조한 가을 날씨에 대비해 보습크림, 립밤 등 준비</p>
          </TipCard>
        </TipsGrid>
      </WeatherTips>

      <div style={{background: '#f8f9fa', borderRadius: '10px', padding: '1.5rem', marginTop: '2rem'}}>
        <h3>💡 짐 싸기 꿀팁</h3>
        <ul style={{lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem'}}>
          <li>🎒 <strong>가벼운 짐:</strong> 필수품 위주로 최소한으로 준비</li>
          <li>📦 <strong>압축팩 활용:</strong> 의류는 압축팩으로 부피 줄이기</li>
          <li>🧴 <strong>소용량 용기:</strong> 세면용품은 여행용 소용량으로</li>
          <li>📱 <strong>디지털화:</strong> 서류는 스마트폰에 저장하고 백업</li>
          <li>🎁 <strong>기념품 공간:</strong> 돌아올 때 기념품 넣을 공간 확보</li>
          <li>🔋 <strong>전자기기:</strong> 충전기와 보조배터리는 필수</li>
        </ul>
      </div>
    </Container>
  );
};

export default PackingChecklist;