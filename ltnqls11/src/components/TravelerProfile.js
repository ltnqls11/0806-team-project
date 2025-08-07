import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  X, MapPin, Calendar, Star, MessageCircle, Heart, 
  Camera, Coffee, Film, Utensils, Map, Users, 
  Phone, Mail, Instagram, Globe, Award, Clock
} from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 20px 20px 0 0;
  color: white;
  text-align: center;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto 1rem;
  border: 4px solid rgba(255, 255, 255, 0.3);
`;

const Name = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
`;

const TravelDates = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0.9;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 1.1rem;
`;

const ProfileBody = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
`;

const Bio = styled.p`
  color: #495057;
  line-height: 1.6;
  font-size: 1rem;
`;

const InterestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InterestCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const InterestIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
`;

const InterestInfo = styled.div`
  flex: 1;
`;

const InterestName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.2rem;
`;

const InterestDesc = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
`;

const ContactIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ReviewGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const ReviewCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #667eea;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const ReviewerName = styled.div`
  font-weight: 600;
  color: #2c3e50;
`;

const ReviewDate = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
`;

const ReviewText = styled.p`
  color: #495057;
  line-height: 1.5;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid #e9ecef;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;

  &.primary {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: #f8f9fa;
    color: #6c757d;
    border: 2px solid #e9ecef;

    &:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
  }
`;

const TravelerProfile = ({ traveler, onClose }) => {
  if (!traveler) return null;

  const interests = [
    { name: '독립영화', icon: Film, desc: '아트하우스 시네마 애호가' },
    { name: '부산맛집', icon: Utensils, desc: '로컬 푸드 전문가' },
    { name: '카페투어', icon: Coffee, desc: '감성 카페 탐방러' },
    { name: '사진촬영', icon: Camera, desc: '인스타그래머' }
  ];

  const contacts = [
    { type: 'phone', icon: Phone, value: '010-1234-5678', label: '전화번호' },
    { type: 'email', icon: Mail, value: 'youngfilm@email.com', label: '이메일' },
    { type: 'instagram', icon: Instagram, value: '@youngfilm_busan', label: '인스타그램' },
    { type: 'website', icon: Globe, value: 'youngfilm.blog.com', label: '블로그' }
  ];

  const reviews = [
    {
      reviewer: '박시네마',
      date: '2024.09.15',
      rating: 5,
      text: '정말 좋은 분이에요! BIFF 기간 동안 함께 영화 보고 맛집도 가고 너무 즐거웠습니다. 영화에 대한 깊이 있는 대화를 나눌 수 있어서 좋았어요.'
    },
    {
      reviewer: '이필름',
      date: '2024.08.22',
      rating: 5,
      text: '영화 초보인 저에게 친절하게 설명해주시고, 부산의 숨은 명소도 알려주셨어요. 다음에도 꼭 함께 여행하고 싶습니다!'
    },
    {
      reviewer: '최무비',
      date: '2024.07.10',
      rating: 4,
      text: '다큐멘터리에 대한 전문적인 지식이 있으시고, 대화가 정말 재미있어요. 시간 가는 줄 모르고 이야기했네요.'
    }
  ];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <ProfileHeader>
          <Avatar>{traveler.avatar}</Avatar>
          <Name>{traveler.name}</Name>
          <LocationInfo>
            <MapPin size={18} />
            {traveler.location}
          </LocationInfo>
          <TravelDates>
            <Calendar size={18} />
            {traveler.travelDates}
          </TravelDates>
          <Rating>
            <Star size={20} fill="white" />
            {traveler.rating} ({traveler.reviewCount}개 리뷰)
          </Rating>
        </ProfileHeader>

        <ProfileBody>
          <Section>
            <SectionTitle>
              <Users size={20} />
              소개
            </SectionTitle>
            <Bio>{traveler.bio}</Bio>
          </Section>

          <Section>
            <SectionTitle>
              <Heart size={20} />
              관심사 & 전문분야
            </SectionTitle>
            <InterestGrid>
              {interests.map((interest, index) => {
                const IconComponent = interest.icon;
                return (
                  <InterestCard key={index}>
                    <InterestIcon>
                      <IconComponent size={20} />
                    </InterestIcon>
                    <InterestInfo>
                      <InterestName>{interest.name}</InterestName>
                      <InterestDesc>{interest.desc}</InterestDesc>
                    </InterestInfo>
                  </InterestCard>
                );
              })}
            </InterestGrid>
          </Section>

          <Section>
            <SectionTitle>
              <MessageCircle size={20} />
              연락처
            </SectionTitle>
            <ContactGrid>
              {contacts.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <ContactItem key={index}>
                    <ContactIcon>
                      <IconComponent size={20} />
                    </ContactIcon>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                        {contact.label}
                      </div>
                      <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        {contact.value}
                      </div>
                    </div>
                  </ContactItem>
                );
              })}
            </ContactGrid>
          </Section>

          <Section>
            <SectionTitle>
              <Award size={20} />
              여행자 리뷰
            </SectionTitle>
            <ReviewGrid>
              {reviews.map((review, index) => (
                <ReviewCard key={index}>
                  <ReviewHeader>
                    <ReviewerName>{review.reviewer}</ReviewerName>
                    <ReviewDate>{review.date}</ReviewDate>
                  </ReviewHeader>
                  <ReviewRating>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#ffc107" color="#ffc107" />
                    ))}
                  </ReviewRating>
                  <ReviewText>{review.text}</ReviewText>
                </ReviewCard>
              ))}
            </ReviewGrid>
          </Section>
        </ProfileBody>

        <ActionButtons>
          <ActionButton className="primary">
            <MessageCircle size={20} />
            메시지 보내기
          </ActionButton>
          <ActionButton className="secondary">
            <Heart size={20} />
            관심 목록에 추가
          </ActionButton>
        </ActionButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TravelerProfile;