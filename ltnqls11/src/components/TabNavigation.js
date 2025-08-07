import React from 'react';
import styled from 'styled-components';
import { MessageCircle, Hotel, Calendar, DollarSign, Users, Film, Train, UtensilsCrossed, Cloud, Package, ShoppingBag, Search } from 'lucide-react';

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #667eea #f8f9fa;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 3px;
  }
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 50px;
  padding: 0px 15px;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  border-radius: 10px;
  color: ${props => props.active ? 'white' : '#2c3e50'};
  font-weight: 600;
  font-size: 0.9rem;
  border: 2px solid ${props => props.active ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'chatbot', label: 'AI 챗봇', icon: MessageCircle },
    { id: 'schedule', label: 'BIFF 상영일정', icon: Film },
    { id: 'transport', label: '부산 교통', icon: Train },
    { id: 'restaurants', label: '부산 맛집', icon: UtensilsCrossed },
    { id: 'accommodation', label: '숙소 검색', icon: Hotel },
    { id: 'planner', label: '여행 계획', icon: Calendar },
    { id: 'social', label: '소셜 허브', icon: Users },
    { id: 'travelers', label: '여행자 검색', icon: Search },
    { id: 'budget', label: '예산 관리', icon: DollarSign },
    { id: 'weather', label: '부산 날씨', icon: Cloud },
    { id: 'checklist', label: '짐 체크리스트', icon: Package },
    { id: 'shopping', label: '여행용품 쇼핑', icon: ShoppingBag }
  ];

  return (
    <TabContainer>
      {tabs.map(tab => {
        const IconComponent = tab.icon;
        return (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <IconComponent size={20} />
            {tab.label}
          </Tab>
        );
      })}
    </TabContainer>
  );
};

export default TabNavigation;