import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import ChatBot from './components/ChatBot';
import BiffSchedule from './components/BiffSchedule';
import BusanTransport from './components/BusanTransport';
import BusanRestaurants from './components/BusanRestaurants';
import AccommodationSearch from './components/AccommodationSearch';
import TravelPlanner from './components/TravelPlanner';
import SocialHub from './components/SocialHub';
import BudgetManager from './components/BudgetManager';
import BusanWeather from './components/BusanWeather';
import PackingChecklist from './components/PackingChecklist';
import TravelShopping from './components/TravelShopping';
import TravelerSearch from './components/TravelerSearch';
import { GeminiService } from './services/geminiService';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [geminiService, setGeminiService] = useState(null);

  useEffect(() => {
    // Initialize Gemini service
    const initGemini = async () => {
      try {
        const service = new GeminiService();
        await service.initialize();
        setGeminiService(service);
      } catch (error) {
        console.error('Failed to initialize Gemini service:', error);
      }
    };

    initGemini();
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chatbot':
        return <ChatBot geminiService={geminiService} />;
      case 'schedule':
        return <BiffSchedule geminiService={geminiService} />;
      case 'transport':
        return <BusanTransport />;
      case 'restaurants':
        return <BusanRestaurants geminiService={geminiService} />;
      case 'accommodation':
        return <AccommodationSearch geminiService={geminiService} />;
      case 'planner':
        return <TravelPlanner geminiService={geminiService} />;
      case 'social':
        return <SocialHub />;
      case 'travelers':
        return <TravelerSearch />;
      case 'budget':
        return <BudgetManager />;
      case 'weather':
        return <BusanWeather />;
      case 'checklist':
        return <PackingChecklist />;
      case 'shopping':
        return <TravelShopping geminiService={geminiService} />;
      default:
        return <ChatBot geminiService={geminiService} />;
    }
  };

  return (
    <AppContainer>
      <ContentContainer>
        <Header />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderActiveTab()}
      </ContentContainer>
    </AppContainer>
  );
}

export default App;