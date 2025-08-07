import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: fadeInDown 1s ease-out;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  color: white;
  margin: 0;
  font-size: 2.5em;
  font-weight: bold;
`;

const Subtitle = styled.p`
  color: white;
  margin: 0.5rem 0 0 0;
  font-size: 1.2em;
  opacity: 0.9;
`;

const InfoTags = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const InfoTag = styled.span`
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.9em;
`;

// 스타일이 적용된 링크 컴포넌트
const InfoTagLink = styled.a`
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.9em;
  text-decoration: none;

  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>🎬 BIFF 29회 여행 가이드</Title>
      <Subtitle>부산국제영화제 & 부산여행 올인원 플랫폼</Subtitle>
      <InfoTags>
        <InfoTag>📅 2024.10.2-11</InfoTag>
        <InfoTag>🎫 7,000원~</InfoTag>
        <InfoTagLink 
          href="https://www.instagram.com/youthcenterbusan/p/DMy9pRLTzvi/?img_index=3" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          🎉 청년패스 할인
        </InfoTagLink>
      </InfoTags>
    </HeaderContainer>
  );
};

export default Header;
