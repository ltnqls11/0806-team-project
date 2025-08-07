import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Bot, User, ChevronDown, Zap } from 'lucide-react';

const ChatContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  height: 800px;
  display: flex;
  flex-direction: column;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  ${props => props.isUser && 'flex-direction: row-reverse;'}
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: ${props => props.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  background: ${props => props.isUser ? 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)' : '#f1f3f4'};
  color: ${props => props.isUser ? 'white' : '#202124'};
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 0.95rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  white-space: pre-wrap;
`;

const MessageIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.isUser ? 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)' : 'linear-gradient(135deg, #4285f4, #ea4335, #fbbc04, #34a853)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  font-size: 0.8rem;
  font-weight: bold;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 24px;
  margin-top: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #dadce0;
  border-radius: 24px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
  background: #f8f9fa;

  &:focus {
    border-color: #4285f4;
    background: white;
    box-shadow: 0 1px 6px rgba(32,33,36,.28);
  }

  &::placeholder {
    color: #9aa0a6;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem;
  background: ${props => props.disabled ? '#f1f3f4' : '#4285f4'};
  color: ${props => props.disabled ? '#9aa0a6' : 'white'};
  border: none;
  border-radius: 50%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover:not(:disabled) {
    background: #3367d6;
    transform: scale(1.05);
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-style: italic;
`;

const QuickQuestionsContainer = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const QuickQuestionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  margin-bottom: ${props => props.expanded ? '1rem' : '0'};

  &:hover {
    background-color: rgba(255,255,255,0.5);
  }
`;

const QuickQuestionsTitle = styled.h4`
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  transition: transform 0.3s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  padding: 0.25rem;
  border-radius: 50%;

  &:hover {
    background-color: rgba(102, 126, 234, 0.1);
  }
`;

const QuickQuestionsContent = styled.div`
  max-height: ${props => props.expanded ? '350px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const QuickQuestionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
`;

const QuickQuestionButton = styled.button`
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    
    &:before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:before {
      display: none;
    }
  }
`;

const ChatBot = ({ geminiService }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 저는 BIFF 29회 부산 여행 전문 AI 어시스턴트입니다. 🎬\n\n부산국제영화제, 부산 여행, 맛집, 숙소, 교통, 예산 계획 등 무엇이든 자연스럽게 대화하듯 물어보세요!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef(null);

  // 빠른 질문 데이터
  const quickQuestions = {
    "🎬 BIFF 일정 관련": [
      "BIFF 일정 알려줘",
      "영화 티켓 가격은?",
      "상영관 위치 알려줘",
    ],
    "🎉 부산 청년패스 할인": [
      "청년패스 할인 정보",
      "할인 혜택 어떻게 받아?",
      "청년패스 신청 방법",
      "할인 받을 수 있는 곳",
      "청년패스 사용법",
      "할인 혜택 총정리"
    ],
    "💰 3박4일 예산 계산": [
      "3박4일 예산 계산",
      "저예산 여행 팁",
      "숙박비 절약 방법",
      "맛집 가격대 알려줘",
      "일일 예산 얼마?",
      "예산별 일정 추천"
    ],
    "📅 영화+관광 일정 추천": [
      "영화+관광 일정 추천",
      "센텀시티 근처 관광지",
      "영화 보고 갈 만한 곳",
      "하루 일정 짜줘",
      "2박3일 일정표",
      "필수 코스 알려줘"
    ],
    "💡 여행 절약 팁": [
      "여행 절약 팁 알려줘",
      "무료 관광지 추천",
      "교통비 아끼는 법",
      "현지인 맛집 추천",
      "할인 쿠폰 정보",
      "가성비 숙소 찾기"
    ],
    "🚇 부산 교통/숙소": [
      "지하철 노선도 설명",
      "영화관 가는 법",
      "센텀시티 숙소 추천",
      "교통카드 어디서 사?",
      "공항에서 센텀시티",
      "KTX역에서 영화관"
    ],
    "🍽️ 부산 맛집 정보": [
      "돼지국밥 맛집 추천",
      "밀면 어디서 먹지?",
      "자갈치시장 회센터",
      "센텀시티 맛집",
      "해운대 맛집 추천",
      "야식 추천해줘"
    ],
    "🌤️ 날씨/준비물": [
      "10월 부산 날씨",
      "뭘 입고 가야 해?",
      "우산 필요해?",
      "짐 체크리스트",
      "필수 준비물",
      "카메라 추천"
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isLoading || !geminiService) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInputValue('');
    setIsLoading(true);

    try {
      const prompt = `
당신은 BIFF 29회 부산 여행 전문 AI 어시스턴트입니다. Google Gemini처럼 자연스럽고 도움이 되는 대화를 해주세요.

대화 스타일:
- 친근하고 자연스러운 대화체 사용
- 사용자의 질문 의도를 정확히 파악하여 맞춤형 답변
- 구체적이고 실용적인 정보 제공
- 필요시 추가 질문이나 제안 포함
- 이모지 적절히 사용 (과하지 않게)

중요 지침:
- 청년패스 관련 질문 시 반드시 이 링크를 제공하세요: https://www.instagram.com/youthcenterbusan/p/DMy9pRLTzvi/?img_index=3

BIFF 29회 (2024) 정보:
- 기간: 10월 2일(수) ~ 11일(금)
- 주제: "Cinema, Here and Now"
- 주요 상영관: 영화의전당, 롯데시네마 센텀시티, CGV 센텀시티, 부산시네마센터
- 티켓: 일반 7,000원, 학생 5,000원, 갈라 15,000원, 개폐막작 20,000원
- 개막식: 10월 2일 19:00 영화의전당
- 폐막식: 10월 11일 19:00 영화의전당

부산 여행 정보:
- 청년패스 할인: https://www.instagram.com/youthcenterbusan/p/DMy9pRLTzvi/?img_index=3
- 주요 교통: 지하철 2호선 센텀시티역(영화의전당), 1호선 중앙역(부산시네마센터)
- 대표 맛집: 돼지국밥(8,000-12,000원), 밀면(7,000-10,000원), 씨앗호떡(1,000원)
- 예산 가이드(2박3일): 저예산 15-20만원, 중예산 30-40만원, 고예산 50-70만원

사용자 질문: "${textToSend}"

자연스럽고 도움이 되는 답변을 해주세요:
      `;

      const response = await geminiService.generateResponse(prompt);

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4285f4, #ea4335, #fbbc04, #34a853)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.8rem'
        }}>
          AI
        </div>
        <div>
          <h3 style={{ margin: 0, color: '#202124' }}>BIFF 여행 AI 어시스턴트</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#5f6368' }}>부산국제영화제 전문 가이드</p>
        </div>
      </ChatHeader>

      <QuickQuestionsContainer>
        <QuickQuestionsHeader
          expanded={showQuickQuestions}
          onClick={() => setShowQuickQuestions(!showQuickQuestions)}
        >
          <QuickQuestionsTitle>
            <Zap size={20} />
            빠른 질문
          </QuickQuestionsTitle>
          <ToggleButton expanded={showQuickQuestions}>
            <ChevronDown size={20} />
          </ToggleButton>
        </QuickQuestionsHeader>

        <QuickQuestionsContent expanded={showQuickQuestions}>
          <QuickQuestionGrid>
            {Object.entries(quickQuestions).slice(0, 1).map(([category, questions]) =>
              questions.slice(0, 6).map((question, index) => (
                <QuickQuestionButton
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </QuickQuestionButton>
              ))
            )}
          </QuickQuestionGrid>
        </QuickQuestionsContent>
      </QuickQuestionsContainer>

      <ChatMessages>
        {messages.map(message => (
          <Message key={message.id} isUser={message.isUser}>
            <MessageIcon isUser={message.isUser}>
              {message.isUser ? 'U' : 'AI'}
            </MessageIcon>
            <MessageBubble isUser={message.isUser}>
              {message.text}
            </MessageBubble>
          </Message>
        ))}

        {isLoading && (
          <Message isUser={false}>
            <MessageIcon isUser={false}>
              AI
            </MessageIcon>
            <MessageBubble isUser={false}>
              <LoadingMessage>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #e0e0e0',
                    borderTop: '2px solid #4285f4',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  AI가 답변을 생성하고 있습니다...
                </div>
              </LoadingMessage>
            </MessageBubble>
          </Message>
        )}

        <div ref={messagesEndRef} />
      </ChatMessages>

      <InputContainer>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="BIFF나 부산 여행에 대해 자유롭게 질문해보세요... (예: 3박4일 예산 얼마나 들어?, 돼지국밥 맛집 추천해줘)"
          disabled={isLoading}
        />
        <SendButton
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
        >
          <Send size={20} />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatBot;