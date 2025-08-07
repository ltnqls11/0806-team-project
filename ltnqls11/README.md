# BIFF 29회 여행 가이드 - React 버전

부산국제영화제(BIFF) 29회를 위한 종합 여행 가이드 웹 애플리케이션입니다. Streamlit에서 React로 변환되었습니다.

## 주요 기능

### 🤖 AI 챗봇
- Google Gemini AI를 활용한 BIFF 및 부산 여행 정보 제공
- 실시간 질의응답
- 맞춤형 여행 추천

### 🎬 BIFF 상영일정
- 영화제 상영 스케줄 확인
- 영화별 상영관 및 시간 정보
- 장르별, 날짜별 필터링
- AI 기반 영화 추천

### 🚇 부산 교통
- 지하철 노선도 및 요금 정보
- 영화관별 교통편 안내
- 경로 검색 기능
- 청년패스 할인 혜택 정보

### 🍽️ 부산 맛집
- 부산 대표 향토음식 소개
- 영화관 근처 맛집 추천
- 가격대별, 지역별 필터링
- AI 기반 맛집 추천

### 🏨 숙소 검색
- AI 기반 숙소 추천
- 영화관 접근성 고려
- 가격 비교 및 할인 정보
- 즐겨찾기 기능

### 📅 여행 계획 생성
- 개인 맞춤형 일정 생성
- 관심사 기반 추천
- 예산별 계획
- 일정 저장 및 다운로드

### 👥 소셜 허브
- 동행자 매칭 시스템
- 여행 후기 공유
- 포토존 갤러리
- 커뮤니티 기능

### 💰 예산 관리
- 카테고리별 예산 설정
- 실시간 지출 추적
- 시각적 차트 제공
- 청년패스 할인 적용

### 🌤️ 부산 날씨
- BIFF 기간 일기예보
- 옷차림 추천
- 날씨별 활동 가이드
- 실내 활동 추천

### 🧳 짐 체크리스트
- 카테고리별 짐 체크리스트
- 개인 항목 추가 기능
- 진행률 추적
- 체크리스트 내보내기/가져오기

### 🛍️ 여행용품 쇼핑
- BIFF 여행 맞춤 용품 추천
- 가격 비교 및 할인 정보
- 카테고리별 상품 필터링
- AI 기반 상품 추천

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일에 다음 내용을 설정하세요:
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_COUPANG_PARTNERS_ID=your_coupang_partners_id_here
```

### 3. 개발 서버 실행
```bash
npm start
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 4. 빌드
```bash
npm run build
```

## 기술 스택

- **Frontend**: React 18, Styled Components
- **AI**: Google Generative AI (Gemini)
- **Charts**: Plotly.js, React-Plotly.js
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Styling**: Styled Components

## 주요 컴포넌트

- `App.js`: 메인 애플리케이션 컴포넌트
- `Header.js`: 헤더 및 브랜딩
- `TabNavigation.js`: 탭 네비게이션
- `ChatBot.js`: AI 챗봇 인터페이스
- `BiffSchedule.js`: BIFF 상영일정 관리
- `BusanTransport.js`: 부산 교통 정보
- `BusanRestaurants.js`: 부산 맛집 추천
- `AccommodationSearch.js`: 숙소 검색 기능
- `TravelPlanner.js`: 여행 계획 생성
- `SocialHub.js`: 소셜 기능
- `BudgetManager.js`: 예산 관리 도구
- `BusanWeather.js`: 부산 날씨 정보
- `PackingChecklist.js`: 짐 체크리스트
- `TravelShopping.js`: 여행용품 쇼핑

## API 서비스

- `GeminiService`: Google Gemini AI API 연동 서비스

## 특징

### 반응형 디자인
- 모바일, 태블릿, 데스크톱 지원
- 유연한 그리드 레이아웃

### 사용자 경험
- 부드러운 애니메이션
- 직관적인 인터페이스
- 실시간 피드백

### 데이터 관리
- 로컬 스토리지 활용
- 세션 상태 관리
- 데이터 지속성

## 개발 가이드

### 새로운 컴포넌트 추가
1. `src/components/` 폴더에 컴포넌트 파일 생성
2. Styled Components를 사용한 스타일링
3. `App.js`에서 컴포넌트 import 및 사용

### 스타일 가이드
- 일관된 색상 팔레트 사용
- 그라데이션과 그림자 효과
- 호버 애니메이션 적용

### 상태 관리
- React Hooks (useState, useEffect) 사용
- 로컬 스토리지를 통한 데이터 지속성
- 컴포넌트 간 props를 통한 데이터 전달

## 배포

### Netlify 배포
1. 빌드 명령어: `npm run build`
2. 배포 폴더: `build`
3. 환경 변수 설정 필요

### Vercel 배포
1. GitHub 연동
2. 자동 빌드 및 배포
3. 환경 변수 설정

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.