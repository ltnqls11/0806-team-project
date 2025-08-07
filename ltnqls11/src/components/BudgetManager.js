import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Plot from 'react-plotly.js';
import { Plus, Trash2, PieChart, BarChart3, TrendingUp } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const BudgetSetup = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SetupGrid = styled.div`
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const CreateBudgetButton = styled.button`
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

const BudgetOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BudgetCard = styled.div`
  background: ${props => {
    if (props.status === 'over') return 'linear-gradient(135deg, #e74c3c, #c0392b)';
    if (props.status === 'warning') return 'linear-gradient(135deg, #f39c12, #e67e22)';
    return 'linear-gradient(135deg, #27ae60, #2ecc71)';
  }};
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const BudgetCategory = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const BudgetAmount = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const BudgetProgress = styled.div`
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const BudgetProgressBar = styled.div`
  height: 100%;
  background: white;
  border-radius: 10px;
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: width 0.5s ease;
`;

const BudgetPercentage = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ExpenseSection = styled.div`
  margin-bottom: 2rem;
`;

const ExpenseForm = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const ExpenseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AddExpenseButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
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

const ExpenseList = styled.div`
  background: white;
  border: 2px solid #eee;
  border-radius: 10px;
  max-height: 300px;
  overflow-y: auto;
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ExpenseInfo = styled.div`
  flex: 1;
`;

const ExpenseDescription = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
`;

const ExpenseDetails = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ExpenseAmount = styled.div`
  font-weight: bold;
  color: #e74c3c;
  font-size: 1.1rem;
  margin-right: 1rem;
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  border: 2px solid #eee;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
`;

const BudgetManager = () => {
  const [budgetPlan, setBudgetPlan] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgetParams, setBudgetParams] = useState({
    days: 3,
    budgetLevel: '보통 (1일 5-10만원)',
    useYouthPass: false,
    interests: []
  });
  const [expenseForm, setExpenseForm] = useState({
    category: '식사',
    amount: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['숙박', '교통', '식사', '영화', '관광', '쇼핑', '기타'];

  useEffect(() => {
    // Load saved data from localStorage
    const savedBudget = localStorage.getItem('budgetPlan');
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedBudget) {
      setBudgetPlan(JSON.parse(savedBudget));
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever data changes
    if (budgetPlan) {
      localStorage.setItem('budgetPlan', JSON.stringify(budgetPlan));
    }
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [budgetPlan, expenses]);

  const generateInterestRecommendations = (interests, days, useYouthPass) => {
    const baseRecommendations = {
      "영화": {
        description: "BIFF 및 영화 관련 비용",
        items: ["BIFF 티켓", "일반 영화 티켓", "팝콘/음료", "BIFF 굿즈", "프로그램북"],
        dailyAmount: useYouthPass ? 13500 : 15000,
        detailedBreakdown: {
          "BIFF 티켓": useYouthPass ? 9000 : 10000,
          "팝콘/음료": 8000,
          "굿즈/기념품": 5000
        },
        tips: [
          "🎫 BIFF 패키지 티켓으로 20% 할인",
          "🍿 극장 외부에서 음료 구매 시 절약",
          "📚 프로그램북은 기념품으로 추천",
          "🎬 현장 당일권도 고려해보세요"
        ],
        recommendedSpots: ["영화의전당", "CGV 센텀시티", "롯데시네마 부산본점"]
      },
      "맛집": {
        description: "부산 대표 맛집 탐방",
        items: ["돼지국밥", "밀면", "회/해산물", "디저트/카페", "야식"],
        dailyAmount: 28000,
        detailedBreakdown: {
          "아침/브런치": 8000,
          "점심 (돼지국밥/밀면)": 9000,
          "저녁 (회/해산물)": 15000,
          "카페/디저트": 6000
        },
        tips: [
          "🍜 현지인 추천 골목 맛집 위주로",
          "🐟 자갈치시장에서 회 직접 구매",
          "☕ 해운대 카페거리 탐방",
          "🌙 광안리 야식 문화 체험"
        ],
        recommendedSpots: ["자갈치시장", "국제시장", "해운대 카페거리", "광안리 해변"]
      },
      "관광": {
        description: "부산 주요 관광지 입장료",
        items: ["박물관/미술관", "케이블카", "전망대", "테마파크", "체험활동"],
        dailyAmount: useYouthPass ? 12000 : 15000,
        detailedBreakdown: {
          "케이블카 (송도/금강공원)": useYouthPass ? 8000 : 10000,
          "박물관/미술관": useYouthPass ? 3000 : 4000,
          "전망대": 2000,
          "체험활동": 5000
        },
        tips: [
          "🎫 청년패스로 문화시설 30% 할인",
          "🚠 케이블카는 일몰 시간 추천",
          "🏛️ 무료 관광지도 많이 활용",
          "🚌 시티투어버스로 효율적 이동"
        ],
        recommendedSpots: ["감천문화마을", "태종대", "해동용궁사", "송도케이블카"]
      },
      "쇼핑": {
        description: "기념품 및 쇼핑",
        items: ["BIFF 굿즈", "부산 특산품", "K-뷰티", "패션", "전통 기념품"],
        dailyAmount: 25000,
        detailedBreakdown: {
          "BIFF 기념품": 8000,
          "부산 특산품": 10000,
          "화장품/뷰티": 12000,
          "패션 아이템": 15000
        },
        tips: [
          "🛍️ 서면 지하상가에서 저렴한 쇼핑",
          "💄 면세점 할인 쿠폰 미리 준비",
          "🎁 국제시장에서 전통 기념품",
          "📱 온라인 가격 비교 후 구매"
        ],
        recommendedSpots: ["서면 지하상가", "국제시장", "신세계 센텀시티", "롯데백화점"]
      },
      "사진": {
        description: "인생샷 촬영 관련 비용",
        items: ["인스탁스 필름", "포토부스", "프린트", "사진 소품", "드론 대여"],
        dailyAmount: 12000,
        detailedBreakdown: {
          "인스탁스 필름": 6000,
          "포토부스": 4000,
          "사진 프린트": 2000,
          "소품/액세서리": 3000
        },
        tips: [
          "📸 황금시간대 (일출/일몰) 활용",
          "🎞️ 필름은 미리 충분히 준비",
          "📱 휴대폰 보조배터리 필수",
          "🌅 해운대/광안대교 야경 포인트"
        ],
        recommendedSpots: ["광안대교", "해운대 해변", "감천문화마을", "태종대"]
      },
      "카페": {
        description: "부산 감성 카페 투어",
        items: ["시그니처 음료", "디저트", "원두/굿즈", "카페 체험"],
        dailyAmount: 15000,
        detailedBreakdown: {
          "음료 (2-3잔)": 12000,
          "디저트": 8000,
          "원두/굿즈": 10000
        },
        tips: [
          "☕ 로컬 로스터리 카페 추천",
          "🍰 카페별 시그니처 디저트 체험",
          "🌊 오션뷰 카페에서 여유 시간",
          "📷 카페 인테리어도 포토존"
        ],
        recommendedSpots: ["해운대 카페거리", "광안리 해변가", "송정 해변", "영도 카페촌"]
      },
      "야경": {
        description: "부산 야경 명소 투어",
        items: ["전망대 입장료", "야식", "음료", "교통비"],
        dailyAmount: 18000,
        detailedBreakdown: {
          "전망대/전망카페": 8000,
          "야식": 12000,
          "음료/주류": 10000,
          "야간 교통비": 5000
        },
        tips: [
          "🌃 광안대교 야경은 필수 코스",
          "🍻 해변가에서 치킨과 맥주",
          "🚕 야간에는 택시 이용 권장",
          "📱 야경 촬영 앱 미리 설치"
        ],
        recommendedSpots: ["광안대교", "부산타워", "황령산 전망대", "마린시티"]
      }
    };

    const recommendations = {};
    interests.forEach(interest => {
      if (baseRecommendations[interest]) {
        const rec = { ...baseRecommendations[interest] };
        rec.totalAmount = rec.dailyAmount * days;
        recommendations[interest] = rec;
      }
    });

    return recommendations;
  };

  const createBudgetPlan = () => {
    const budgetTemplates = {
      "저예산 (1일 5만원 이하)": {
        "숙박": 25000,
        "교통": 8000,
        "식사": 12000,
        "영화": 7000,
        "관광": 3000,
        "쇼핑": 5000,
        "기타": 5000
      },
      "보통 (1일 5-10만원)": {
        "숙박": 50000,
        "교통": 12000,
        "식사": 25000,
        "영화": 10000,
        "관광": 8000,
        "쇼핑": 10000,
        "기타": 10000
      },
      "고예산 (1일 10만원 이상)": {
        "숙박": 80000,
        "교통": 15000,
        "식사": 40000,
        "영화": 15000,
        "관광": 15000,
        "쇼핑": 20000,
        "기타": 15000
      }
    };

    const dailyBudget = budgetTemplates[budgetParams.budgetLevel];
    
    // Apply youth pass discount
    if (budgetParams.useYouthPass) {
      dailyBudget.교통 = Math.floor(dailyBudget.교통 * 0.8);
      dailyBudget.영화 = Math.floor(dailyBudget.영화 * 0.9);
      dailyBudget.관광 = Math.floor(dailyBudget.관광 * 0.9);
    }

    // Calculate total budget
    const totalBudget = {};
    for (const [category, amount] of Object.entries(dailyBudget)) {
      if (category === '숙박') {
        totalBudget[category] = amount * (budgetParams.days - 1);
      } else {
        totalBudget[category] = amount * budgetParams.days;
      }
    }

    // Generate interest-based recommendations
    const interestRecommendations = generateInterestRecommendations(budgetParams.interests, budgetParams.days, budgetParams.useYouthPass);

    setBudgetPlan({
      dailyBudget,
      totalBudget,
      days: budgetParams.days,
      youthPassApplied: budgetParams.useYouthPass,
      interestRecommendations
    });
  };

  const addExpense = () => {
    if (!expenseForm.amount || !expenseForm.description) {
      alert('금액과 설명을 입력해주세요.');
      return;
    }

    const newExpense = {
      id: Date.now(),
      ...expenseForm,
      amount: parseInt(expenseForm.amount),
      createdAt: new Date().toISOString()
    };

    setExpenses(prev => [...prev, newExpense]);
    setExpenseForm({
      category: '식사',
      amount: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const calculateBudgetStatus = () => {
    if (!budgetPlan) return {};

    const status = {};
    for (const [category, budgeted] of Object.entries(budgetPlan.totalBudget)) {
      const spent = expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      const remaining = budgeted - spent;
      const percentage = budgeted > 0 ? (spent / budgeted * 100) : 0;
      
      status[category] = {
        budgeted,
        spent,
        remaining,
        percentage,
        status: spent > budgeted ? 'over' : percentage > 80 ? 'warning' : 'good'
      };
    }
    return status;
  };

  const budgetStatus = calculateBudgetStatus();

  const createPieChart = () => {
    if (!budgetPlan) return null;

    const data = [{
      values: Object.values(budgetPlan.totalBudget),
      labels: Object.keys(budgetPlan.totalBudget),
      type: 'pie',
      hole: 0.4,
      marker: {
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
      }
    }];

    const layout = {
      title: '💰 카테고리별 예산 분배',
      font: { size: 12 },
      showlegend: true,
      height: 400,
      margin: { t: 50, b: 50, l: 50, r: 50 }
    };

    return <Plot data={data} layout={layout} style={{width: '100%', height: '400px'}} />;
  };

  const createBarChart = () => {
    if (!budgetPlan || Object.keys(budgetStatus).length === 0) return null;

    const categories = Object.keys(budgetStatus);
    const budgeted = categories.map(cat => budgetStatus[cat].budgeted);
    const spent = categories.map(cat => budgetStatus[cat].spent);

    const data = [
      {
        x: categories,
        y: budgeted,
        name: '예산',
        type: 'bar',
        marker: { color: 'lightblue', opacity: 0.7 }
      },
      {
        x: categories,
        y: spent,
        name: '지출',
        type: 'bar',
        marker: { color: 'coral' }
      }
    ];

    const layout = {
      title: '📊 예산 vs 지출 현황',
      barmode: 'group',
      height: 400,
      margin: { t: 50, b: 50, l: 50, r: 50 },
      yaxis: { title: '금액 (원)' },
      xaxis: { title: '카테고리' }
    };

    return <Plot data={data} layout={layout} style={{width: '100%', height: '400px'}} />;
  };

  return (
    <Container>
      <h2>💰 예산 관리</h2>
      
      {!budgetPlan && (
        <BudgetSetup>
          <h3>예산 계획 설정</h3>
          <SetupGrid>
            <FormGroup>
              <Label>여행 기간</Label>
              <Select
                value={budgetParams.days}
                onChange={(e) => setBudgetParams(prev => ({...prev, days: parseInt(e.target.value)}))}
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
                value={budgetParams.budgetLevel}
                onChange={(e) => setBudgetParams(prev => ({...prev, budgetLevel: e.target.value}))}
              >
                <option value="저예산 (1일 5만원 이하)">저예산 (1일 5만원 이하)</option>
                <option value="보통 (1일 5-10만원)">보통 (1일 5-10만원)</option>
                <option value="고예산 (1일 10만원 이상)">고예산 (1일 10만원 이상)</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={budgetParams.useYouthPass}
                  onChange={(e) => setBudgetParams(prev => ({...prev, useYouthPass: e.target.checked}))}
                />
                🎉 부산 청년패스 할인 적용 (교통 20%, 영화/관광 10% 할인)
              </CheckboxLabel>
              {budgetParams.useYouthPass && (
                <div style={{
                  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '10px',
                  marginTop: '0.5rem'
                }}>
                  <h4 style={{margin: '0 0 0.5rem 0'}}>🎉 청년패스 혜택</h4>
                  <ul style={{margin: 0, paddingLeft: '1rem'}}>
                    <li>🚇 교통비 20% 할인 (지하철, 버스)</li>
                    <li>🎬 영화관 10% 할인</li>
                    <li>🏛️ 관광지 10% 할인</li>
                    <li>🍽️ 참여 음식점 5-15% 할인</li>
                    <li>🛍️ 참여 매장 5-20% 할인</li>
                  </ul>
                </div>
              )}
            </FormGroup>
          </SetupGrid>
          
          <div style={{marginTop: '1.5rem'}}>
            <Label>🎯 관심사별 예산 추천 (복수 선택 가능)</Label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              {[
                {key: '영화', icon: '🎬', label: '영화/BIFF'},
                {key: '맛집', icon: '🍽️', label: '맛집 탐방'},
                {key: '관광', icon: '🏛️', label: '관광지'},
                {key: '쇼핑', icon: '🛍️', label: '쇼핑'},
                {key: '사진', icon: '📸', label: '사진 촬영'},
                {key: '카페', icon: '☕', label: '카페 투어'},
                {key: '야경', icon: '🌃', label: '야경 명소'}
              ].map(({key, icon, label}) => (
                <label key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: budgetParams.interests?.includes(key) ? '2px solid #4ecdc4' : '2px solid #eee',
                  backgroundColor: budgetParams.interests?.includes(key) ? '#f0fffe' : 'white',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onMouseOver={(e) => {
                  if (!budgetParams.interests?.includes(key)) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.borderColor = '#ddd';
                  }
                }}
                onMouseOut={(e) => {
                  if (!budgetParams.interests?.includes(key)) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#eee';
                  }
                }}
                >
                  <input
                    type="checkbox"
                    checked={budgetParams.interests?.includes(key) || false}
                    onChange={(e) => {
                      const interests = budgetParams.interests || [];
                      setBudgetParams(prev => ({
                        ...prev,
                        interests: e.target.checked 
                          ? [...interests, key]
                          : interests.filter(i => i !== key)
                      }));
                    }}
                    style={{display: 'none'}}
                  />
                  <span style={{fontSize: '1.2rem'}}>{icon}</span>
                  <span style={{fontWeight: budgetParams.interests?.includes(key) ? '600' : '400'}}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <CreateBudgetButton onClick={createBudgetPlan}>
            예산 계획 생성
          </CreateBudgetButton>
        </BudgetSetup>
      )}

      {budgetPlan && (
        <>
          <BudgetOverview>
            {Object.entries(budgetStatus).map(([category, status]) => (
              <BudgetCard key={category} status={status.status}>
                <BudgetCategory>{category}</BudgetCategory>
                <BudgetAmount>
                  {status.spent.toLocaleString()} / {status.budgeted.toLocaleString()}원
                </BudgetAmount>
                <BudgetProgress>
                  <BudgetProgressBar percentage={status.percentage} />
                </BudgetProgress>
                <BudgetPercentage>
                  {status.percentage.toFixed(1)}% 사용
                </BudgetPercentage>
              </BudgetCard>
            ))}
          </BudgetOverview>

          <ExpenseSection>
            <h3>💳 지출 기록</h3>
            <ExpenseForm>
              <ExpenseGrid>
                <FormGroup>
                  <Label>카테고리</Label>
                  <Select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm(prev => ({...prev, category: e.target.value}))}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label>금액</Label>
                  <Input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm(prev => ({...prev, amount: e.target.value}))}
                    placeholder="금액 입력"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>설명</Label>
                  <Input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm(prev => ({...prev, description: e.target.value}))}
                    placeholder="지출 내용"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>장소</Label>
                  <Input
                    type="text"
                    value={expenseForm.location}
                    onChange={(e) => setExpenseForm(prev => ({...prev, location: e.target.value}))}
                    placeholder="장소 (선택사항)"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>날짜</Label>
                  <Input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm(prev => ({...prev, date: e.target.value}))}
                  />
                </FormGroup>
              </ExpenseGrid>
              
              <AddExpenseButton onClick={addExpense}>
                <Plus size={16} />
                지출 추가
              </AddExpenseButton>
            </ExpenseForm>

            <ExpenseList>
              {expenses.length === 0 ? (
                <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>
                  아직 기록된 지출이 없습니다.
                </div>
              ) : (
                expenses.map(expense => (
                  <ExpenseItem key={expense.id}>
                    <ExpenseInfo>
                      <ExpenseDescription>{expense.description}</ExpenseDescription>
                      <ExpenseDetails>
                        {expense.category} • {expense.location} • {expense.date}
                      </ExpenseDetails>
                    </ExpenseInfo>
                    <ExpenseAmount>{expense.amount.toLocaleString()}원</ExpenseAmount>
                    <DeleteButton onClick={() => deleteExpense(expense.id)}>
                      <Trash2 size={16} />
                    </DeleteButton>
                  </ExpenseItem>
                ))
              )}
            </ExpenseList>
          </ExpenseSection>

          {budgetPlan.interestRecommendations && Object.keys(budgetPlan.interestRecommendations).length > 0 && (
            <div style={{background: '#f8f9fa', borderRadius: '15px', padding: '2rem', marginBottom: '2rem'}}>
              <h3>🎯 관심사별 예산 추천</h3>
              <p style={{color: '#666', marginBottom: '1.5rem'}}>
                선택하신 관심사에 맞는 맞춤형 예산 가이드입니다. 실제 부산 여행 경험을 바탕으로 제작되었습니다.
              </p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1rem'}}>
                {Object.entries(budgetPlan.interestRecommendations).map(([interest, rec]) => {
                  const getInterestIcon = (interest) => {
                    const icons = {
                      '영화': '🎬', '맛집': '🍽️', '관광': '🏛️', 
                      '쇼핑': '🛍️', '사진': '📸', '카페': '☕', '야경': '🌃'
                    };
                    return icons[interest] || '🎯';
                  };

                  return (
                    <div key={interest} style={{
                      background: 'white',
                      borderRadius: '15px',
                      padding: '2rem',
                      borderLeft: '5px solid #4ecdc4',
                      boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                    }}
                    >
                      <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                        <span style={{fontSize: '2rem', marginRight: '0.5rem'}}>{getInterestIcon(interest)}</span>
                        <h4 style={{margin: 0, color: '#2c3e50', fontSize: '1.3rem'}}>
                          {interest} 관련 예산
                        </h4>
                      </div>
                      
                      <p style={{color: '#666', fontSize: '0.95rem', margin: '0 0 1.5rem 0', lineHeight: '1.5'}}>
                        {rec.description}
                      </p>
                      
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                      }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                          <span style={{fontSize: '0.9rem', opacity: 0.9}}>일일 예산</span>
                          <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{rec.dailyAmount.toLocaleString()}원</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <span style={{fontSize: '0.9rem', opacity: 0.9}}>총 예산 ({budgetPlan.days}일)</span>
                          <span style={{fontSize: '1.4rem', fontWeight: 'bold'}}>{rec.totalAmount.toLocaleString()}원</span>
                        </div>
                      </div>

                      {rec.detailedBreakdown && (
                        <div style={{marginBottom: '1.5rem'}}>
                          <h5 style={{margin: '0 0 0.75rem 0', color: '#2c3e50', fontSize: '1rem'}}>💰 세부 예산 분석</h5>
                          <div style={{background: '#f8f9fa', borderRadius: '10px', padding: '1rem'}}>
                            {Object.entries(rec.detailedBreakdown).map(([item, amount]) => (
                              <div key={item} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #eee'
                              }}>
                                <span style={{color: '#555', fontSize: '0.9rem'}}>{item}</span>
                                <span style={{color: '#e74c3c', fontWeight: '600'}}>{amount.toLocaleString()}원</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div style={{marginBottom: '1.5rem'}}>
                        <h5 style={{margin: '0 0 0.75rem 0', color: '#2c3e50', fontSize: '1rem'}}>🎯 주요 항목</h5>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                          {rec.items.map(item => (
                            <span key={item} style={{
                              background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                              color: 'white',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {rec.recommendedSpots && (
                        <div style={{marginBottom: '1.5rem'}}>
                          <h5 style={{margin: '0 0 0.75rem 0', color: '#2c3e50', fontSize: '1rem'}}>📍 추천 장소</h5>
                          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                            {rec.recommendedSpots.map(spot => (
                              <span key={spot} style={{
                                background: '#fff3cd',
                                color: '#856404',
                                padding: '0.4rem 0.7rem',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                border: '1px solid #ffeaa7'
                              }}>
                                📍 {spot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h5 style={{margin: '0 0 0.75rem 0', color: '#2c3e50', fontSize: '1rem'}}>💡 절약 꿀팁</h5>
                        <div style={{background: '#e8f5e8', borderRadius: '10px', padding: '1rem'}}>
                          {rec.tips.map((tip, index) => (
                            <div key={index} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              marginBottom: index < rec.tips.length - 1 ? '0.5rem' : 0,
                              fontSize: '0.9rem',
                              lineHeight: '1.4'
                            }}>
                              <span style={{marginRight: '0.5rem', color: '#27ae60'}}>•</span>
                              <span style={{color: '#2d5a3d'}}>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h4 style={{margin: '0 0 0.5rem 0'}}>💡 예산 관리 팁</h4>
                <p style={{margin: 0, opacity: 0.9, lineHeight: '1.5'}}>
                  예산은 여유있게 10-20% 추가로 준비하시고, 현금과 카드를 적절히 분배해서 사용하세요. 
                  부산 청년패스를 활용하면 더 많은 할인 혜택을 받을 수 있습니다!
                </p>
              </div>
            </div>
          )}

          <ChartsSection>
            <ChartCard>
              {createPieChart()}
            </ChartCard>
            <ChartCard>
              {createBarChart()}
            </ChartCard>
          </ChartsSection>
        </>
      )}
    </Container>
  );
};

export default BudgetManager;