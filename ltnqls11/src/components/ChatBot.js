import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Bot, User, ChevronDown, Zap } from 'lucide-react';
import BiffDataService from '../services/biffDataService';

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
      text: "안녕하세요! 저는 BIFF 29회 부산 여행 전문 AI 어시스턴트입니다. 🎬\n\n나무위키에서 크롤링한 정확한 정보를 바탕으로 부산국제영화제, 부산 여행, 맛집, 숙소, 교통, 예산 계획 등 무엇이든 자연스럽게 대화하듯 물어보세요!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef(null);
  // BIFF 29회 빠른 질문 데이터 (5개)
  const quickQuestions = [
    {
      "question": "BIFF 전체 일정은 어떻게 되나요?",
      "answer": "2024년 부산국제영화제(BIFF)는 10월 2일부터 10월 11일까지 부산 해운대 일대에서 열렸습니다. 올해는 10일간 전 세계 70여 개국 200편 이상의 영화가 상영되었습니다."
    },
    {
      "question": "영화 상영 시간표는 어디서 확인할 수 있나요?",
      "answer": "BIFF 공식 홈페이지(www.biff.kr)와 모바일 앱을 통해 상영 시간표와 상영관 정보를 확인할 수 있습니다. 일정은 매일 업데이트되며, 영화별 상세정보도 제공됩니다."
    },
    {
      "question": "사전 예약 없이 현장에서도 티켓 구매가 가능한 일정이 있나요?",
      "answer": "네, 상영 당일 잔여 좌석이 있는 경우, 현장 매표소에서 티켓 구매가 가능합니다. 단, 인기 작품은 조기 매진될 수 있으므로 사전 예매를 권장합니다."
    },
    {
      "question": "개막작, 폐막작은 어떤 영화인가요?",
      "answer": "2024년 개막작은 김상만 감독의 '전, 란', 폐막작은 에릭 쿠의 감독의 '영혼의 여행'입니다."
    },
    {
      "question": "BIFF 주변 맛집 추천해줘",
      "answer": "BIFF가 열리는 해운대 일대에는 '원조 조방낙지', '이제모피자', '오반장 밀면', '해운대 암소갈비집' 등 인기 맛집이 많이 있습니다. 영화 관람 전후로 들르기 좋아요!"
    }
  ];

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

  const handleQuickQuestion = (questionObj) => {
    // 질문을 사용자 메시지로 추가
    const userMessage = {
      id: Date.now(),
      text: questionObj.question,
      isUser: true,
      timestamp: new Date()
    };

    // 답변을 AI 메시지로 추가
    const botMessage = {
      id: Date.now() + 1,
      text: questionObj.answer,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
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
            {quickQuestions.map((questionObj, index) => (
              <QuickQuestionButton
                key={index}
                onClick={() => handleQuickQuestion(questionObj)}
                disabled={isLoading}
              >
                {questionObj.question}
              </QuickQuestionButton>
            ))}
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