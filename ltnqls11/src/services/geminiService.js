import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  constructor() {
    this.model = null;
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  }

  async initialize() {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    try {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('Gemini service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
      throw error;
    }
  }

  async generateResponse(prompt) {
    if (!this.model) {
      throw new Error('Gemini model not initialized');
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  async generateAccommodations(checkIn, checkOut, location = '전체', priceRange = '전체') {
    const prompt = `
부산의 숙소 정보를 JSON 형식으로 생성해주세요.
체크인: ${checkIn}, 체크아웃: ${checkOut}

필터 조건:
- 지역: ${location}
- 가격대: ${priceRange}

다음 JSON 형식으로 응답해주세요:

{
    "accommodations": [
        {
            "id": "hotel_id",
            "name": "숙소명",
            "type": "호텔/모텔/게스트하우스/펜션",
            "location": "구체적위치",
            "distance_to_cinema": {
                "영화의전당": "도보 5분",
                "롯데시네마 센텀시티": "지하철 10분",
                "CGV 센텀시티": "도보 3분",
                "부산시네마센터": "지하철 20분"
            },
            "price_per_night": 가격(원),
            "original_price": 원래가격(원),
            "discount_rate": 할인율,
            "rating": 평점(4.5),
            "review_count": 리뷰수,
            "amenities": ["WiFi", "주차", "조식", "수영장"],
            "room_type": "객실타입",
            "address": "상세주소",
            "phone": "전화번호",
            "booking_sites": [
                {
                    "site": "예약사이트명",
                    "price": 가격(원),
                    "url": "예약링크(가상)"
                }
            ],
            "images": ["이미지URL(가상)"],
            "check_in_time": "15:00",
            "check_out_time": "11:00",
            "cancellation": "무료취소 가능",
            "breakfast_included": true,
            "near_attractions": ["해운대해수욕장", "광안대교"]
        }
    ]
}

부산 숙소 특징:
- 해운대, 서면, 남포동, 센텀시티 지역별 특색
- 영화관 접근성 고려
- 가격대별 다양한 옵션 (3만원~30만원)
- 부산 관광지 근처 위치

총 8-10개의 숙소를 생성해주세요.
JSON만 응답하고 다른 텍스트는 포함하지 마세요.
    `;

    try {
      const response = await this.generateResponse(prompt);
      let cleanResponse = response.trim();
      
      // Remove markdown code blocks if present
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7);
      }
      if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3);
      }
      
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error generating accommodations:', error);
      throw error;
    }
  }

  async generateItinerary(days, interests, budget, travelStyle) {
    const prompt = `
부산 BIFF 29회 여행 일정을 JSON 형식으로 생성해주세요.

여행 조건:
- 여행 기간: ${days}일
- 관심사: ${interests.join(', ')}
- 예산: ${budget}
- 여행 스타일: ${travelStyle}
- BIFF 기간: 2024년 10월 2일-11일

다음 JSON 형식으로 응답해주세요:

{
    "itinerary": [
        {
            "day": 1,
            "date": "2024-10-03",
            "theme": "BIFF 개막 & 센텀시티 탐방",
            "schedule": [
                {
                    "time": "09:00",
                    "activity": "활동명",
                    "location": "장소명",
                    "duration": "소요시간(분)",
                    "cost": "예상비용(원)",
                    "description": "상세설명",
                    "tips": "팁",
                    "transport": "교통수단",
                    "category": "영화/관광/식사/쇼핑"
                }
            ],
            "daily_budget": 총일일예산(원),
            "highlights": ["하이라이트1", "하이라이트2"]
        }
    ],
    "total_budget": 총예산(원),
    "travel_tips": ["팁1", "팁2", "팁3"],
    "recommended_movies": [
        {
            "title": "영화제목",
            "time": "상영시간",
            "venue": "상영관",
            "reason": "추천이유"
        }
    ],
    "packing_checklist": ["준비물1", "준비물2"],
    "emergency_contacts": [
        {
            "name": "연락처명",
            "phone": "전화번호",
            "purpose": "용도"
        }
    ]
}

부산 BIFF 여행 특징:
- 영화 상영 일정과 관광 일정 조화
- 센텀시티, 해운대, 남포동, 서면 주요 지역
- 부산 향토음식 체험 포함
- 대중교통 이용 최적화
- 청년패스 할인 활용

${days}일 일정을 상세히 생성해주세요.
JSON만 응답하고 다른 텍스트는 포함하지 마세요.
    `;

    try {
      const response = await this.generateResponse(prompt);
      let cleanResponse = response.trim();
      
      // Remove markdown code blocks if present
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7);
      }
      if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3);
      }
      
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  }
}