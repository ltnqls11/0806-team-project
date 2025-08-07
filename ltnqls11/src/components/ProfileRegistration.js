import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  User, MapPin, Calendar, Camera, Heart, MessageCircle, 
  Plus, X, Save, Upload, Star, Phone, Mail, Instagram, Globe
} from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  animation: fadeInUp 0.6s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  justify-content: center;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const Section = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr'};
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const AvatarPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  border: 4px solid #e0e6ed;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
  }
`;

const InterestTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const InterestTag = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.selected ? '#667eea' : 'white'};
  color: ${props => props.selected ? 'white' : '#2c3e50'};
  border: 2px solid ${props => props.selected ? '#667eea' : '#e0e6ed'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`;

const AddInterestButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  color: #6c757d;
  border: 2px dashed #e0e6ed;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: #e9ecef;
    border-color: #667eea;
    color: #667eea;
  }
`;

const CustomInterestInput = styled.input`
  padding: 0.5rem 1rem;
  border: 2px solid #667eea;
  border-radius: 20px;
  font-size: 0.9rem;
  min-width: 150px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
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

const ProfileRegistration = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    bio: '',
    interests: [],
    contacts: {
      phone: '',
      email: '',
      instagram: '',
      website: ''
    }
  });

  const [customInterest, setCustomInterest] = useState('');
  const [showCustomInterest, setShowCustomInterest] = useState(false);

  const predefinedInterests = [
    '독립영화', '상업영화', '다큐멘터리', '애니메이션', '단편영화',
    '부산맛집', '카페투어', '야경사진', '해변산책', '문화예술',
    '로컬가이드', '언어교환', '친구만들기', '네트워킹', '쇼핑',
    '전시관람', '공연관람', '역사탐방', '자연관광', '액티비티'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAddCustomInterest = () => {
    if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, customInterest.trim()]
      }));
      setCustomInterest('');
      setShowCustomInterest(false);
    }
  };

  const handleSubmit = () => {
    // 폼 검증
    if (!formData.name || !formData.location || !formData.startDate || !formData.endDate) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    // 새로운 여행자 프로필 생성
    const newProfile = {
      id: Date.now(),
      name: formData.name,
      location: formData.location,
      avatar: formData.name.charAt(0),
      travelDates: `${formData.startDate} - ${formData.endDate}`,
      bio: formData.bio,
      interests: formData.interests,
      rating: 0,
      reviewCount: 0,
      contacts: formData.contacts
    };

    onSave && onSave(newProfile);
    alert('프로필이 성공적으로 등록되었습니다!');
    onClose && onClose();
  };

  return (
    <Container>
      <Title>
        <User size={24} />
        여행자 프로필 등록
      </Title>

      <FormGrid>
        {/* 기본 정보 */}
        <Section>
          <SectionTitle>
            <User size={20} />
            기본 정보
          </SectionTitle>
          
          <AvatarSection>
            <AvatarPreview>
              {formData.name ? formData.name.charAt(0) : '?'}
            </AvatarPreview>
            <UploadButton>
              <Upload size={16} />
              프로필 사진 업로드
            </UploadButton>
          </AvatarSection>

          <FormRow columns="1fr 1fr">
            <FormGroup>
              <Label>이름 *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="실명 또는 닉네임"
              />
            </FormGroup>
            <FormGroup>
              <Label>거주지 *</Label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="예: 서울, 한국"
              />
            </FormGroup>
          </FormRow>
        </Section>

        {/* 여행 일정 */}
        <Section>
          <SectionTitle>
            <Calendar size={20} />
            여행 일정
          </SectionTitle>
          
          <FormRow columns="1fr 1fr">
            <FormGroup>
              <Label>시작일 *</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>종료일 *</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </FormGroup>
          </FormRow>
        </Section>

        {/* 자기소개 */}
        <Section>
          <SectionTitle>
            <MessageCircle size={20} />
            자기소개
          </SectionTitle>
          
          <FormGroup>
            <Label>소개글</Label>
            <TextArea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="자신을 소개하고 어떤 여행을 원하는지 알려주세요..."
            />
          </FormGroup>
        </Section>

        {/* 관심사 */}
        <Section>
          <SectionTitle>
            <Heart size={20} />
            관심사 & 전문분야
          </SectionTitle>
          
          <InterestTags>
            {predefinedInterests.map(interest => (
              <InterestTag
                key={interest}
                selected={formData.interests.includes(interest)}
                onClick={() => handleInterestToggle(interest)}
              >
                {interest}
              </InterestTag>
            ))}
            
            {formData.interests
              .filter(interest => !predefinedInterests.includes(interest))
              .map(interest => (
                <InterestTag key={interest} selected>
                  {interest}
                  <X 
                    size={14} 
                    style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInterestToggle(interest);
                    }}
                  />
                </InterestTag>
              ))
            }

            {showCustomInterest ? (
              <CustomInterestInput
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomInterest()}
                onBlur={handleAddCustomInterest}
                placeholder="관심사 입력"
                autoFocus
              />
            ) : (
              <AddInterestButton onClick={() => setShowCustomInterest(true)}>
                <Plus size={16} />
                직접 입력
              </AddInterestButton>
            )}
          </InterestTags>
        </Section>

        {/* 연락처 */}
        <Section>
          <SectionTitle>
            <Phone size={20} />
            연락처 (선택사항)
          </SectionTitle>
          
          <FormRow columns="1fr 1fr">
            <FormGroup>
              <Label>전화번호</Label>
              <Input
                type="tel"
                value={formData.contacts.phone}
                onChange={(e) => handleInputChange('contacts.phone', e.target.value)}
                placeholder="010-1234-5678"
              />
            </FormGroup>
            <FormGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                value={formData.contacts.email}
                onChange={(e) => handleInputChange('contacts.email', e.target.value)}
                placeholder="example@email.com"
              />
            </FormGroup>
          </FormRow>
          
          <FormRow columns="1fr 1fr">
            <FormGroup>
              <Label>인스타그램</Label>
              <Input
                type="text"
                value={formData.contacts.instagram}
                onChange={(e) => handleInputChange('contacts.instagram', e.target.value)}
                placeholder="@username"
              />
            </FormGroup>
            <FormGroup>
              <Label>웹사이트/블로그</Label>
              <Input
                type="url"
                value={formData.contacts.website}
                onChange={(e) => handleInputChange('contacts.website', e.target.value)}
                placeholder="https://myblog.com"
              />
            </FormGroup>
          </FormRow>
        </Section>
      </FormGrid>

      <ActionButtons>
        <ActionButton className="secondary" onClick={onClose}>
          취소
        </ActionButton>
        <ActionButton className="primary" onClick={handleSubmit}>
          <Save size={20} />
          프로필 등록
        </ActionButton>
      </ActionButtons>
    </Container>
  );
};

export default ProfileRegistration;