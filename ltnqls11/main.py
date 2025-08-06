import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime

# 환경변수 로드
load_dotenv()

# 페이지 설정
st.set_page_config(
    page_title="BIFF 29회 여행 챗봇",
    page_icon="🎬",
    layout="wide"
)

# Gemini 모델 설정
@st.cache_resource
def setup_gemini():
    """Gemini API 설정"""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            st.error("GEMINI_API_KEY가 환경변수에 설정되지 않았습니다.")
            return None
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        return model
    except Exception as e:
        st.error(f"Gemini API 설정 오류: {e}")
        return None

# BIFF 정보
BIFF_INFO = {
    "dates": "2024년 10월 2일(수) ~ 10월 11일(금)",
    "venues": ["영화의전당", "롯데시네마 센텀시티", "CGV 센텀시티", "부산시네마센터"],
    "ticket_prices": {"일반": "7,000원", "학생/경로": "5,000원", "갈라/특별상영": "15,000원"}
}

# 메인 헤더
st.markdown("""
<div style="background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%); padding: 1.5rem; border-radius: 10px; text-align: center; margin-bottom: 2rem;">
    <h1 style="color: white; margin: 0;">🎬 BIFF 29회 여행 챗봇</h1>
    <p style="color: white; margin: 0.5rem 0 0 0;">부산국제영화제 & 부산여행 전문 가이드</p>
</div>
""", unsafe_allow_html=True)

# Gemini 모델 설정
model = setup_gemini()

if not model:
    st.stop()

# 숙소 정보 생성 함수
@st.cache_data(ttl=3600)  # 1시간 캐시
def get_busan_accommodations_with_gemini(_model, check_in_date, check_out_date, location="전체", price_range="전체"):
    """Gemini AI로 부산 숙소 정보 생성"""
    try:
        accommodation_prompt = f"""
부산의 숙소 정보를 JSON 형식으로 생성해주세요.
체크인: {check_in_date}, 체크아웃: {check_out_date}

필터 조건:
- 지역: {location}
- 가격대: {price_range}

다음 JSON 형식으로 응답해주세요:

{{
    "accommodations": [
        {{
            "id": "hotel_id",
            "name": "숙소명",
            "type": "호텔/모텔/게스트하우스/펜션",
            "location": "구체적위치",
            "distance_to_cinema": {{
                "영화의전당": "도보 5분",
                "롯데시네마 센텀시티": "지하철 10분",
                "CGV 센텀시티": "도보 3분",
                "부산시네마센터": "지하철 20분"
            }},
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
                {{
                    "site": "예약사이트명",
                    "price": 가격(원),
                    "url": "예약링크(가상)"
                }}
            ],
            "images": ["이미지URL(가상)"],
            "check_in_time": "15:00",
            "check_out_time": "11:00",
            "cancellation": "무료취소 가능",
            "breakfast_included": true,
            "near_attractions": ["해운대해수욕장", "광안대교"]
        }}
    ]
}}

부산 숙소 특징:
- 해운대, 서면, 남포동, 센텀시티 지역별 특색
- 영화관 접근성 고려
- 가격대별 다양한 옵션 (3만원~30만원)
- 부산 관광지 근처 위치

총 10-12개의 숙소를 생성해주세요.
JSON만 응답하고 다른 텍스트는 포함하지 마세요.
        """
        
        response = _model.generate_content(accommodation_prompt)
        
        if response.text:
            # JSON 파싱
            accommodation_text = response.text.strip()
            if accommodation_text.startswith("```json"):
                accommodation_text = accommodation_text[7:]
            if accommodation_text.endswith("```"):
                accommodation_text = accommodation_text[:-3]
            
            accommodation_data = json.loads(accommodation_text.strip())
            return accommodation_data
        
        return None
        
    except Exception as e:
        st.error(f"숙소 정보 생성 오류: {e}")
        return None

# 숙소 관련 유틸리티 함수들
def calculate_nights(check_in, check_out):
    """체크인/체크아웃 날짜로 숙박일수 계산"""
    try:
        from datetime import datetime
        check_in_date = datetime.strptime(check_in, "%Y-%m-%d")
        check_out_date = datetime.strptime(check_out, "%Y-%m-%d")
        return (check_out_date - check_in_date).days
    except:
        return 1

def get_accommodation_type_icon(acc_type):
    """숙소 타입별 아이콘 반환"""
    icons = {
        "호텔": "🏨",
        "모텔": "🏩", 
        "게스트하우스": "🏠",
        "펜션": "🏡",
        "리조트": "🏖️"
    }
    return icons.get(acc_type, "🏨")

def format_price(price):
    """가격 포맷팅"""
    return f"{price:,}원"

def get_distance_color(distance_text):
    """거리에 따른 색상 반환"""
    if "도보" in distance_text:
        return "🟢"  # 초록색 - 가까움
    elif "지하철" in distance_text and ("5분" in distance_text or "10분" in distance_text):
        return "🟡"  # 노란색 - 보통
    else:
        return "🔴"  # 빨간색 - 멀음

# 세션 상태 초기화
if "favorite_accommodations" not in st.session_state:
    st.session_state.favorite_accommodations = []

if "price_alerts" not in st.session_state:
    st.session_state.price_alerts = []

# 여행 일정 생성 함수
@st.cache_data(ttl=1800)  # 30분 캐시
def generate_travel_itinerary_with_gemini(_model, travel_days, interests, budget, travel_style):
    """Gemini AI로 부산 여행 일정 생성"""
    try:
        itinerary_prompt = f"""
부산 BIFF 29회 여행 일정을 JSON 형식으로 생성해주세요.

여행 조건:
- 여행 기간: {travel_days}일
- 관심사: {', '.join(interests)}
- 예산: {budget}
- 여행 스타일: {travel_style}
- BIFF 기간: 2024년 10월 2일-11일

다음 JSON 형식으로 응답해주세요:

{{
    "itinerary": [
        {{
            "day": 1,
            "date": "2024-10-03",
            "theme": "BIFF 개막 & 센텀시티 탐방",
            "schedule": [
                {{
                    "time": "09:00",
                    "activity": "활동명",
                    "location": "장소명",
                    "duration": "소요시간(분)",
                    "cost": "예상비용(원)",
                    "description": "상세설명",
                    "tips": "팁",
                    "transport": "교통수단",
                    "category": "영화/관광/식사/쇼핑"
                }}
            ],
            "daily_budget": 총일일예산(원),
            "highlights": ["하이라이트1", "하이라이트2"]
        }}
    ],
    "total_budget": 총예산(원),
    "travel_tips": ["팁1", "팁2", "팁3"],
    "recommended_movies": [
        {{
            "title": "영화제목",
            "time": "상영시간",
            "venue": "상영관",
            "reason": "추천이유"
        }}
    ],
    "packing_checklist": ["준비물1", "준비물2"],
    "emergency_contacts": [
        {{
            "name": "연락처명",
            "phone": "전화번호",
            "purpose": "용도"
        }}
    ]
}}

부산 BIFF 여행 특징:
- 영화 상영 일정과 관광 일정 조화
- 센텀시티, 해운대, 남포동, 서면 주요 지역
- 부산 향토음식 체험 포함
- 대중교통 이용 최적화
- 청년패스 할인 활용

{travel_days}일 일정을 상세히 생성해주세요.
JSON만 응답하고 다른 텍스트는 포함하지 마세요.
        """
        
        response = _model.generate_content(itinerary_prompt)
        
        if response.text:
            # JSON 파싱
            itinerary_text = response.text.strip()
            if itinerary_text.startswith("```json"):
                itinerary_text = itinerary_text[7:]
            if itinerary_text.endswith("```"):
                itinerary_text = itinerary_text[:-3]
            
            itinerary_data = json.loads(itinerary_text.strip())
            return itinerary_data
        
        return None
        
    except Exception as e:
        st.error(f"일정 생성 오류: {e}")
        return None

# PDF 생성 함수
def create_itinerary_pdf(itinerary_data, user_info):
    """여행 일정을 PDF로 생성"""
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
        from reportlab.lib.units import inch
        from reportlab.pdfbase import pdfutils
        from reportlab.pdfbase.ttfonts import TTFont
        from reportlab.pdfbase import pdfmetrics
        import io
        
        # PDF 버퍼 생성
        buffer = io.BytesIO()
        
        # PDF 캔버스 생성
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # 제목
        p.setFont("Helvetica-Bold", 20)
        p.drawString(50, height - 50, f"BIFF 29th Travel Itinerary")
        
        # 사용자 정보
        p.setFont("Helvetica", 12)
        y_position = height - 100
        p.drawString(50, y_position, f"Traveler: {user_info.get('name', 'BIFF Traveler')}")
        y_position -= 20
        p.drawString(50, y_position, f"Duration: {user_info.get('days', 3)} days")
        y_position -= 20
        p.drawString(50, y_position, f"Budget: {user_info.get('budget', 'Medium')}")
        y_position -= 40
        
        # 일정 내용
        if itinerary_data and "itinerary" in itinerary_data:
            for day_info in itinerary_data["itinerary"]:
                # 날짜별 제목
                p.setFont("Helvetica-Bold", 14)
                p.drawString(50, y_position, f"Day {day_info.get('day', 1)}: {day_info.get('theme', '')}")
                y_position -= 25
                
                # 일정 항목들
                p.setFont("Helvetica", 10)
                for activity in day_info.get("schedule", []):
                    if y_position < 100:  # 페이지 끝에 가까우면 새 페이지
                        p.showPage()
                        y_position = height - 50
                    
                    time_str = activity.get('time', '')
                    activity_str = activity.get('activity', '')
                    location_str = activity.get('location', '')
                    
                    p.drawString(70, y_position, f"{time_str} - {activity_str} ({location_str})")
                    y_position -= 15
                
                y_position -= 20
        
        # PDF 완료
        p.save()
        buffer.seek(0)
        return buffer
        
    except ImportError:
        st.error("PDF 생성을 위해 reportlab 라이브러리가 필요합니다.")
        return None
    except Exception as e:
        st.error(f"PDF 생성 오류: {e}")
        return None

# 일정 관련 유틸리티 함수들
def get_activity_icon(category):
    """활동 카테고리별 아이콘 반환"""
    icons = {
        "영화": "🎬",
        "관광": "🏛️",
        "식사": "🍽️",
        "쇼핑": "🛍️",
        "휴식": "☕",
        "교통": "🚇",
        "숙박": "🏨"
    }
    return icons.get(category, "📍")

def format_time_duration(duration_minutes):
    """분을 시간으로 포맷팅"""
    if duration_minutes < 60:
        return f"{duration_minutes}분"
    else:
        hours = duration_minutes // 60
        minutes = duration_minutes % 60
        if minutes == 0:
            return f"{hours}시간"
        else:
            return f"{hours}시간 {minutes}분"

def calculate_daily_total(schedule):
    """일일 총 비용 계산"""
    total = 0
    for activity in schedule:
        cost_str = str(activity.get('cost', '0'))
        # 숫자만 추출
        cost_num = ''.join(filter(str.isdigit, cost_str))
        if cost_num:
            total += int(cost_num)
    return total

# 세션 상태 초기화
if "saved_itineraries" not in st.session_state:
    st.session_state.saved_itineraries = []

# 탭으로 섹션 구분
tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8, tab9 = st.tabs([
    "💬 AI 채팅", 
    "🎬 BIFF 상영일정", 
    "🚇 부산 교통", 
    "🍽️ 부산 맛집", 
    "🏨 부산 숙소", 
    "📅 여행 일정", 
    "🌤️ 부산 날씨", 
    "🧳 짐 체크리스트", 
    "🛍️ 여행용품 쇼핑"
])

with tab1:
    st.markdown("### 💬 AI 채팅")
    
    # 빠른 질문 버튼
    st.markdown("#### 🚀 빠른 질문")
    quick_questions = [
        "BIFF 일정 알려줘",
        "추천 영화 알려줘", 
        "3박4일 일정 생성",
        "부산 청년패스 혜택",
        "영화+관광 일정 추천",
        "센텀시티 호텔 추천"
    ]
    
    cols = st.columns(3)
    for i, question in enumerate(quick_questions):
        with cols[i % 3]:
            if st.button(question, key=f"quick_{i}"):
                st.session_state.last_question = question
    
    # 채팅 입력
    if prompt := st.chat_input("BIFF나 부산 여행에 대해 궁금한 것을 물어보세요!"):
        try:
            with st.spinner("답변 생성 중..."):
                biff_prompt = f"""
당신은 부산국제영화제(BIFF) 29회 전문 여행 가이드 챗봇입니다.

BIFF 29회 정보:
- 일정: {BIFF_INFO['dates']}
- 주요 상영관: {', '.join(BIFF_INFO['venues'])}
- 티켓 가격: 일반 {BIFF_INFO['ticket_prices']['일반']}, 학생/경로 {BIFF_INFO['ticket_prices']['학생/경로']}

답변 스타일:
- 친근하고 도움이 되는 톤
- 구체적이고 실용적인 정보 제공
- 이모지 적절히 사용
- 한국어로 답변

사용자 질문: {prompt}
"""
                response = model.generate_content(biff_prompt)
                if response.text:
                    st.markdown(f"**🤖 BIFF 가이드:** {response.text}")
        except Exception as e:
            st.error(f"오류가 발생했습니다: {e}")
    
    # 빠른 질문 처리
    if hasattr(st.session_state, 'last_question'):
        question = st.session_state.last_question
        try:
            with st.spinner("답변 생성 중..."):
                biff_prompt = f"""
당신은 부산국제영화제(BIFF) 29회 전문 여행 가이드 챗봇입니다.

BIFF 29회 정보:
- 일정: {BIFF_INFO['dates']}
- 주요 상영관: {', '.join(BIFF_INFO['venues'])}
- 티켓 가격: 일반 {BIFF_INFO['ticket_prices']['일반']}, 학생/경로 {BIFF_INFO['ticket_prices']['학생/경로']}

사용자 질문: {question}
"""
                response = model.generate_content(biff_prompt)
                if response.text:
                    st.markdown(f"**🤖 BIFF 가이드:** {response.text}")
                del st.session_state.last_question
        except Exception as e:
            st.error(f"오류가 발생했습니다: {e}")

with tab2:
    st.markdown("### 🎬 BIFF 29회 상영일정")
    st.markdown(f"**📅 일정:** {BIFF_INFO['dates']}")
    st.markdown("**🏛️ 주요 상영관:**")
    for venue in BIFF_INFO['venues']:
        st.markdown(f"- 🎬 {venue}")
    
    st.markdown("**🎫 티켓 가격:**")
    for ticket_type, price in BIFF_INFO['ticket_prices'].items():
        st.markdown(f"- {ticket_type}: {price}")
    
    st.markdown("**🌐 공식 사이트:** [www.biff.kr](https://www.biff.kr)")

with tab3:
    st.markdown("### 🚇 부산 교통 정보")
    st.markdown("**🚇 지하철 노선:**")
    st.markdown("- 🟠 1호선: 다대포해수욕장 ↔ 노포")
    st.markdown("- 🟢 2호선: 장산 ↔ 양산") 
    st.markdown("- 🟤 3호선: 수영 ↔ 대저")
    st.markdown("- 🔵 4호선: 미남 ↔ 안평")
    
    st.markdown("**💰 교통비:**")
    st.markdown("- 지하철: 1,370원")
    st.markdown("- 버스: 1,200원")
    st.markdown("- 청년패스 할인: 20% 할인")
    
    st.markdown("**🎬 영화관별 교통편:**")
    transport_info = {
        "영화의전당": "지하철 2호선 센텀시티역 3번 출구",
        "롯데시네마 센텀시티": "지하철 2호선 센텀시티역 4번 출구", 
        "CGV 센텀시티": "지하철 2호선 센텀시티역 1번 출구",
        "부산시네마센터": "지하철 1호선 중앙역 7번 출구"
    }
    
    for cinema, transport in transport_info.items():
        st.markdown(f"- **{cinema}**: {transport}")

with tab4:
    st.markdown("### 🍽️ 부산 맛집 추천")
    st.markdown("**🔥 부산 대표 맛집:**")
    
    restaurants = [
        {
            "name": "자갈치시장 회센터",
            "type": "해산물",
            "location": "자갈치시장",
            "specialty": "활어회, 해산물탕",
            "price": "2-4만원",
            "rating": "⭐⭐⭐⭐⭐"
        },
        {
            "name": "할매 돼지국밥",
            "type": "부산향토음식",
            "location": "서면",
            "specialty": "돼지국밥, 수육",
            "price": "8천-1만원",
            "rating": "⭐⭐⭐⭐⭐"
        },
        {
            "name": "밀면 전문점",
            "type": "부산향토음식",
            "location": "남포동",
            "specialty": "밀면, 만두",
            "price": "7천-9천원",
            "rating": "⭐⭐⭐⭐"
        },
        {
            "name": "해운대 횟집",
            "type": "해산물",
            "location": "해운대",
            "specialty": "광어회, 대게",
            "price": "3-5만원",
            "rating": "⭐⭐⭐⭐"
        }
    ]
    
    for restaurant in restaurants:
        st.markdown(f"""
        **🍽️ {restaurant['name']}** {restaurant['rating']}
        - 🏷️ 종류: {restaurant['type']}
        - 📍 위치: {restaurant['location']}
        - 🍜 대표메뉴: {restaurant['specialty']}
        - 💰 가격: {restaurant['price']}
        """)
    
    st.markdown("**🗺️ 영화관 근처 맛집:**")
    cinema_restaurants = {
        "영화의전당": ["부산 전통 한정식", "센텀 이탈리안", "해운대 초밥"],
        "롯데시네마 센텀시티": ["센텀 갈비집", "일식 전문점", "카페 브런치"],
        "CGV 센텀시티": ["중국집", "패밀리 레스토랑", "치킨 전문점"],
        "부산시네마센터": ["남포동 밀면", "자갈치 회센터", "부산 돼지국밥"]
    }
    
    selected_cinema = st.selectbox("🎬 영화관 선택", list(cinema_restaurants.keys()))
    st.markdown(f"**{selected_cinema} 근처 추천 맛집:**")
    for restaurant in cinema_restaurants[selected_cinema]:
        st.markdown(f"• 🍽️ {restaurant}")

with tab5:
    # 부산 숙소 정보
    st.markdown("### 🏨 부산 숙소 & 가격 비교")
    
    # 날짜 및 필터 선택
    col1, col2 = st.columns(2)
    
    with col1:
        check_in_date = st.date_input(
            "📅 체크인 날짜",
            value=datetime(2024, 10, 2).date(),
            min_value=datetime(2024, 10, 1).date(),
            max_value=datetime(2024, 10, 15).date()
        )
    
    with col2:
        check_out_date = st.date_input(
            "📅 체크아웃 날짜", 
            value=datetime(2024, 10, 5).date(),
            min_value=datetime(2024, 10, 2).date(),
            max_value=datetime(2024, 10, 16).date()
        )
    
    # 숙박일수 계산
    nights = calculate_nights(str(check_in_date), str(check_out_date))
    if nights > 0:
        st.info(f"🌙 총 {nights}박 {nights+1}일")
    
    # 필터링 옵션
    col3, col4 = st.columns(2)
    
    with col3:
        location_filter = st.selectbox("📍 지역 선택", [
            "전체", "센텀시티 (영화관 밀집)", "해운대", "서면", "남포동", 
            "광안리", "부산역 근처", "김해공항 근처"
        ])
    
    with col4:
        price_filter = st.selectbox("💰 1박 가격대", [
            "전체", "3만원 이하", "3-7만원", "7-15만원", "15만원 이상"
        ])
    
    # 숙소 검색 버튼
    if st.button("🔍 숙소 검색", type="primary"):
        if check_in_date < check_out_date:
            with st.spinner("숙소 정보를 찾는 중..."):
                accommodation_data = get_busan_accommodations_with_gemini(
                    model, str(check_in_date), str(check_out_date), location_filter, price_filter
                )
                
                if accommodation_data and "accommodations" in accommodation_data:
                    st.session_state.accommodation_data = accommodation_data
                    st.session_state.check_in = str(check_in_date)
                    st.session_state.check_out = str(check_out_date)
                    st.session_state.nights = nights
                else:
                    st.error("숙소 정보를 가져올 수 없습니다.")
        else:
            st.warning("체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.")
    
    # 저장된 숙소 정보 표시
    if hasattr(st.session_state, 'accommodation_data') and st.session_state.accommodation_data:
        accommodation_data = st.session_state.accommodation_data
        accommodations = accommodation_data.get("accommodations", [])
        nights = st.session_state.get('nights', 1)
        
        st.markdown(f"**📊 총 {len(accommodations)}개의 숙소가 검색되었습니다.**")
        
        # 가격 알림 설정
        if st.session_state.price_alerts:
            st.markdown("### 🔔 가격 알림")
            for alert in st.session_state.price_alerts:
                st.markdown(f"""
                <div style="background: #e8f5e8; padding: 1rem; border-radius: 10px; margin: 0.5rem 0; border-left: 4px solid #4caf50;">
                    🏨 <strong>{alert['name']}</strong><br>
                    💰 목표가격: {format_price(alert['target_price'])} 이하<br>
                    📅 알림 설정일: {alert['date']}
                </div>
                """, unsafe_allow_html=True)
        
        # 정렬 옵션
        sort_option = st.selectbox("📊 정렬 기준", [
            "가격 낮은 순", "가격 높은 순", "평점 높은 순", "영화관 접근성"
        ])
        
        # 정렬 적용
        if sort_option == "가격 낮은 순":
            accommodations = sorted(accommodations, key=lambda x: x.get('price_per_night', 0))
        elif sort_option == "가격 높은 순":
            accommodations = sorted(accommodations, key=lambda x: x.get('price_per_night', 0), reverse=True)
        elif sort_option == "평점 높은 순":
            accommodations = sorted(accommodations, key=lambda x: x.get('rating', 0), reverse=True)
        
        st.markdown("---")
        
        # 숙소 카드 표시
        for accommodation in accommodations:
            # 숙소 이름과 기본 정보
            acc_type = accommodation.get('type', '호텔')
            icon = get_accommodation_type_icon(acc_type)
            
            st.markdown(f"### {icon} {accommodation.get('name', 'Unknown')}")
            
            # 숙소 정보를 컬럼으로 나누어 표시
            col1, col2 = st.columns([2, 1])
            
            with col1:
                # 기본 정보
                rating = accommodation.get('rating', 0)
                review_count = accommodation.get('review_count', 0)
                price_per_night = accommodation.get('price_per_night', 0)
                original_price = accommodation.get('original_price', price_per_night)
                discount_rate = accommodation.get('discount_rate', 0)
                
                st.markdown(f"""
                **🏷️ 숙소 타입:** {acc_type}  
                **📍 위치:** {accommodation.get('location', 'Unknown')}  
                **⭐ 평점:** {'⭐' * int(rating)} {rating} ({review_count:,}개 리뷰)  
                **🛏️ 객실:** {accommodation.get('room_type', '스탠다드룸')}  
                **📞 전화:** {accommodation.get('phone', '정보없음')}  
                **🕐 체크인/아웃:** {accommodation.get('check_in_time', '15:00')} / {accommodation.get('check_out_time', '11:00')}
                """)
                
                # 편의시설
                amenities = accommodation.get('amenities', [])
                if amenities:
                    amenity_text = " ".join([f"✅ {amenity}" for amenity in amenities])
                    st.markdown(f"**🏨 편의시설:** {amenity_text}")
                
                # 근처 관광지
                attractions = accommodation.get('near_attractions', [])
                if attractions:
                    st.markdown(f"**🎯 근처 관광지:** {', '.join(attractions)}")
            
            with col2:
                # 가격 정보
                total_price = price_per_night * nights
                
                if discount_rate > 0:
                    st.markdown(f"""
                    <div style="background: #ff6b6b; color: white; padding: 1rem; border-radius: 10px; text-align: center;">
                        <h4>💰 특가 {discount_rate}% 할인!</h4>
                        <p style="text-decoration: line-through; opacity: 0.8;">{format_price(original_price)}/박</p>
                        <h3>{format_price(price_per_night)}/박</h3>
                        <h2>{format_price(total_price)} ({nights}박)</h2>
                    </div>
                    """, unsafe_allow_html=True)
                else:
                    st.markdown(f"""
                    <div style="background: #74b9ff; color: white; padding: 1rem; border-radius: 10px; text-align: center;">
                        <h4>💰 숙박 요금</h4>
                        <h3>{format_price(price_per_night)}/박</h3>
                        <h2>{format_price(total_price)} ({nights}박)</h2>
                    </div>
                    """, unsafe_allow_html=True)
                
                # 즐겨찾기 버튼
                is_favorite = accommodation.get("id") in st.session_state.favorite_accommodations
                if st.button(
                    "⭐ 즐겨찾기 해제" if is_favorite else "⭐ 즐겨찾기 추가", 
                    key=f"fav_acc_{accommodation.get('id')}"
                ):
                    if is_favorite:
                        st.session_state.favorite_accommodations.remove(accommodation.get("id"))
                    else:
                        st.session_state.favorite_accommodations.append(accommodation.get("id"))
                    st.rerun()
                
                # 가격 알림 설정
                if st.button("🔔 가격 알림 설정", key=f"alert_{accommodation.get('id')}"):
                    alert_info = {
                        "id": accommodation.get("id"),
                        "name": accommodation.get("name"),
                        "target_price": int(price_per_night * 0.9),  # 현재가의 90%
                        "date": datetime.now().strftime("%Y-%m-%d")
                    }
                    st.session_state.price_alerts.append(alert_info)
                    st.success(f"가격 알림이 설정되었습니다! (목표: {format_price(alert_info['target_price'])} 이하)")
            
            # 영화관별 접근성
            st.markdown("**🎬 영화관별 접근성:**")
            distance_info = accommodation.get('distance_to_cinema', {})
            
            cols = st.columns(4)
            for i, (cinema, distance) in enumerate(distance_info.items()):
                with cols[i]:
                    color = get_distance_color(distance)
                    st.markdown(f"""
                    <div style="background: #f8f9fa; padding: 0.5rem; border-radius: 8px; text-align: center; margin: 0.2rem;">
                        {color} <strong>{cinema}</strong><br>
                        <small>{distance}</small>
                    </div>
                    """, unsafe_allow_html=True)
            
            # 예약 사이트별 가격 비교
            booking_sites = accommodation.get('booking_sites', [])
            if booking_sites:
                st.markdown("**💻 예약 사이트별 가격 비교:**")
                
                site_cols = st.columns(len(booking_sites))
                for i, site in enumerate(booking_sites):
                    with site_cols[i]:
                        site_total = site.get('price', price_per_night) * nights
                        st.markdown(f"""
                        <div style="background: white; border: 1px solid #ddd; padding: 1rem; border-radius: 8px; text-align: center;">
                            <h5>{site.get('site', '예약사이트')}</h5>
                            <p><strong>{format_price(site.get('price', price_per_night))}/박</strong></p>
                            <p>총 {format_price(site_total)}</p>
                            <a href="https://www.booking.com" target="_blank" style="background: #0984e3; color: white; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none; font-size: 0.9em;">
                                예약하기
                            </a>
                        </div>
                        """, unsafe_allow_html=True)
            
            st.markdown("---")
    
    else:
        # 기본 추천 숙소 정보
        st.markdown("### 🔥 BIFF 기간 추천 숙소")
        
        default_accommodations = [
            {
                "name": "센텀시티 프리미엄 호텔",
                "type": "호텔",
                "location": "센텀시티",
                "price": "12만원/박",
                "rating": "⭐⭐⭐⭐⭐",
                "distance": "영화의전당 도보 3분"
            },
            {
                "name": "해운대 오션뷰 호텔", 
                "type": "호텔",
                "location": "해운대",
                "price": "15만원/박",
                "rating": "⭐⭐⭐⭐⭐",
                "distance": "해운대역 도보 5분"
            },
            {
                "name": "서면 비즈니스 호텔",
                "type": "호텔", 
                "location": "서면",
                "price": "8만원/박",
                "rating": "⭐⭐⭐⭐",
                "distance": "서면역 도보 2분"
            },
            {
                "name": "남포동 게스트하우스",
                "type": "게스트하우스",
                "location": "남포동",
                "price": "3만원/박",
                "rating": "⭐⭐⭐⭐",
                "distance": "자갈치역 도보 5분"
            }
        ]
        
        for acc in default_accommodations:
            icon = get_accommodation_type_icon(acc['type'])
            st.markdown(f"""
            **{icon} {acc['name']}** {acc['rating']}
            - 🏷️ 타입: {acc['type']}
            - 📍 위치: {acc['location']}
            - 💰 가격: {acc['price']}
            - 🚇 교통: {acc['distance']}
            """)
    
    # 숙소 예약 팁
    st.markdown("---")
    st.markdown("### 💡 BIFF 기간 숙소 예약 팁")
    
    tips = [
        "🎬 **영화관 접근성**: 센텀시티 지역이 영화관 밀집도가 높아 편리합니다",
        "💰 **가격 비교**: 여러 예약 사이트를 비교해보세요 (부킹닷컴, 아고다, 야놀자 등)",
        "📅 **조기 예약**: BIFF 기간은 성수기이므로 미리 예약하는 것이 좋습니다",
        "🚇 **교통편**: 지하철역 근처 숙소를 선택하면 이동이 편리합니다",
        "🔔 **가격 알림**: 원하는 숙소의 가격 알림을 설정해두세요",
        "⭐ **리뷰 확인**: 최근 리뷰를 확인하여 숙소 상태를 파악하세요"
    ]
    
    for tip in tips:
        st.markdown(f"- {tip}")
    
    # 새로고침 버튼
    if st.button("🔄 숙소 정보 새로고침"):
        if hasattr(st.session_state, 'accommodation_data'):
            del st.session_state.accommodation_data
        st.cache_data.clear()
        st.rerun()

with tab6:
    # 여행 일정 자동 생성
    st.markdown("### 📅 BIFF 여행 일정 자동 생성")
    
    # 일정 생성 설정
    st.markdown("#### ⚙️ 여행 설정")
    
    col1, col2 = st.columns(2)
    
    with col1:
        travel_days = st.selectbox("📅 여행 기간", [2, 3, 4, 5, 6, 7], index=1)
        budget_level = st.selectbox("💰 예산 수준", [
            "저예산 (1일 5만원 이하)",
            "보통 (1일 5-10만원)", 
            "고예산 (1일 10만원 이상)"
        ])
    
    with col2:
        travel_style = st.selectbox("🎯 여행 스타일", [
            "영화 중심 (BIFF 집중)",
            "관광 + 영화 균형",
            "먹방 + 영화",
            "쇼핑 + 영화",
            "휴양 + 영화"
        ])
        
        companion = st.selectbox("👥 동행자", [
            "혼자 여행",
            "친구와 함께",
            "연인과 함께", 
            "가족과 함께"
        ])
    
    # 관심사 선택
    st.markdown("#### 🎯 관심사 선택 (복수 선택 가능)")
    
    interests = []
    interest_options = {
        "🎬 영화 감상": "영화",
        "🏛️ 문화/역사 탐방": "문화",
        "🍽️ 맛집 탐방": "맛집",
        "🏖️ 해변/자연": "자연",
        "🛍️ 쇼핑": "쇼핑",
        "📸 사진 촬영": "사진",
        "🎨 예술/전시": "예술",
        "🌃 야경/카페": "야경"
    }
    
    cols = st.columns(4)
    for i, (display_name, value) in enumerate(interest_options.items()):
        with cols[i % 4]:
            if st.checkbox(display_name, key=f"interest_{value}"):
                interests.append(value)
    
    # 사용자 정보 입력
    st.markdown("#### 👤 여행자 정보 (PDF 생성용)")
    user_name = st.text_input("이름", placeholder="홍길동")
    
    # 일정 생성 버튼
    if st.button("🚀 맞춤 일정 생성", type="primary"):
        if interests:
            with st.spinner("AI가 최적의 여행 일정을 생성하는 중..."):
                itinerary_data = generate_travel_itinerary_with_gemini(
                    model, travel_days, interests, budget_level, travel_style
                )
                
                if itinerary_data and "itinerary" in itinerary_data:
                    st.session_state.current_itinerary = itinerary_data
                    st.session_state.user_info = {
                        "name": user_name or "BIFF 여행자",
                        "days": travel_days,
                        "budget": budget_level,
                        "style": travel_style,
                        "companion": companion
                    }
                    st.success("✅ 맞춤 여행 일정이 생성되었습니다!")
                else:
                    st.error("일정 생성에 실패했습니다. 다시 시도해주세요.")
        else:
            st.warning("관심사를 최소 1개 이상 선택해주세요.")
    
    # 생성된 일정 표시
    if hasattr(st.session_state, 'current_itinerary') and st.session_state.current_itinerary:
        itinerary_data = st.session_state.current_itinerary
        user_info = st.session_state.get('user_info', {})
        
        st.markdown("---")
        st.markdown("### 🗓️ 생성된 여행 일정")
        
        # 일정 요약
        total_budget = itinerary_data.get('total_budget', 0)
        st.markdown(f"""
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 15px; margin: 1rem 0;">
            <h3>📋 여행 요약</h3>
            <p><strong>👤 여행자:</strong> {user_info.get('name', 'BIFF 여행자')}</p>
            <p><strong>📅 기간:</strong> {user_info.get('days', 3)}일</p>
            <p><strong>💰 총 예산:</strong> {total_budget:,}원</p>
            <p><strong>🎯 스타일:</strong> {user_info.get('style', '영화 중심')}</p>
        </div>
        """, unsafe_allow_html=True)
        
        # 추천 영화
        recommended_movies = itinerary_data.get('recommended_movies', [])
        if recommended_movies:
            st.markdown("#### 🎬 추천 영화")
            for movie in recommended_movies:
                st.markdown(f"""
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin: 0.5rem 0; border-left: 4px solid #ff6b6b;">
                    <strong>🎬 {movie.get('title', '')}</strong><br>
                    📅 {movie.get('time', '')} | 🏛️ {movie.get('venue', '')}<br>
                    💡 {movie.get('reason', '')}
                </div>
                """, unsafe_allow_html=True)
        
        # 일별 일정
        st.markdown("#### 📅 일별 상세 일정")
        
        for day_info in itinerary_data.get('itinerary', []):
            day_num = day_info.get('day', 1)
            date = day_info.get('date', '')
            theme = day_info.get('theme', '')
            daily_budget = day_info.get('daily_budget', 0)
            
            # 날짜별 헤더
            st.markdown(f"""
            <div style="background: #74b9ff; color: white; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                <h4>📅 Day {day_num} - {date}</h4>
                <p><strong>테마:</strong> {theme}</p>
                <p><strong>일일 예산:</strong> {daily_budget:,}원</p>
            </div>
            """, unsafe_allow_html=True)
            
            # 일정 항목들
            schedule = day_info.get('schedule', [])
            
            for activity in schedule:
                time = activity.get('time', '')
                activity_name = activity.get('activity', '')
                location = activity.get('location', '')
                duration = activity.get('duration', 0)
                cost = activity.get('cost', '0원')
                description = activity.get('description', '')
                tips = activity.get('tips', '')
                transport = activity.get('transport', '')
                category = activity.get('category', '관광')
                
                icon = get_activity_icon(category)
                duration_text = format_time_duration(int(str(duration).replace('분', '').replace('시간', '')) if str(duration).replace('분', '').replace('시간', '').isdigit() else 60)
                
                st.markdown(f"""
                <div style="background: white; border: 1px solid #ddd; border-radius: 10px; padding: 1rem; margin: 0.5rem 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h5>{icon} {time} - {activity_name}</h5>
                        <span style="background: #e74c3c; color: white; padding: 0.2rem 0.6rem; border-radius: 15px; font-size: 0.8em;">{cost}</span>
                    </div>
                    <p><strong>📍 위치:</strong> {location}</p>
                    <p><strong>⏱️ 소요시간:</strong> {duration_text}</p>
                    <p><strong>🚇 교통:</strong> {transport}</p>
                    <p><strong>📝 설명:</strong> {description}</p>
                    {f"<p><strong>💡 팁:</strong> {tips}</p>" if tips else ""}
                </div>
                """, unsafe_allow_html=True)
            
            # 하이라이트
            highlights = day_info.get('highlights', [])
            if highlights:
                st.markdown("**✨ 오늘의 하이라이트:**")
                for highlight in highlights:
                    st.markdown(f"- 🌟 {highlight}")
        
        # 여행 팁
        travel_tips = itinerary_data.get('travel_tips', [])
        if travel_tips:
            st.markdown("#### 💡 여행 팁")
            for tip in travel_tips:
                st.markdown(f"- 💡 {tip}")
        
        # 준비물 체크리스트
        packing_checklist = itinerary_data.get('packing_checklist', [])
        if packing_checklist:
            st.markdown("#### 🧳 추천 준비물")
            for item in packing_checklist:
                st.markdown(f"- ✅ {item}")
        
        # 비상 연락처
        emergency_contacts = itinerary_data.get('emergency_contacts', [])
        if emergency_contacts:
            st.markdown("#### 🚨 비상 연락처")
            for contact in emergency_contacts:
                st.markdown(f"- **{contact.get('name', '')}**: {contact.get('phone', '')} ({contact.get('purpose', '')})")
        
        # PDF 다운로드 및 저장 버튼
        st.markdown("---")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            # PDF 다운로드
            if st.button("📄 PDF 다운로드"):
                pdf_buffer = create_itinerary_pdf(itinerary_data, user_info)
                if pdf_buffer:
                    st.download_button(
                        label="💾 PDF 파일 다운로드",
                        data=pdf_buffer,
                        file_name=f"BIFF_여행일정_{user_info.get('name', 'traveler')}_{travel_days}일.pdf",
                        mime="application/pdf"
                    )
                else:
                    st.info("PDF 다운로드 기능은 reportlab 라이브러리가 필요합니다.")
        
        with col2:
            # 일정 저장
            if st.button("💾 일정 저장"):
                saved_itinerary = {
                    "id": len(st.session_state.saved_itineraries) + 1,
                    "name": f"{user_info.get('name', 'BIFF 여행자')}의 {travel_days}일 일정",
                    "created_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "data": itinerary_data,
                    "user_info": user_info
                }
                st.session_state.saved_itineraries.append(saved_itinerary)
                st.success("✅ 일정이 저장되었습니다!")
        
        with col3:
            # 일정 수정
            if st.button("✏️ 일정 수정"):
                st.info("일정 수정 기능은 개발 중입니다. 새로운 설정으로 다시 생성해주세요.")
    
    # 저장된 일정 목록
    if st.session_state.saved_itineraries:
        st.markdown("---")
        st.markdown("### 💾 저장된 일정")
        
        for saved in st.session_state.saved_itineraries:
            with st.expander(f"📋 {saved['name']} (생성일: {saved['created_date']})"):
                saved_data = saved['data']
                saved_user = saved['user_info']
                
                st.markdown(f"""
                **👤 여행자:** {saved_user.get('name', '')}  
                **📅 기간:** {saved_user.get('days', 0)}일  
                **💰 예산:** {saved_data.get('total_budget', 0):,}원  
                **🎯 스타일:** {saved_user.get('style', '')}
                """)
                
                col1, col2 = st.columns(2)
                with col1:
                    if st.button(f"📄 PDF 다운로드", key=f"pdf_{saved['id']}"):
                        pdf_buffer = create_itinerary_pdf(saved_data, saved_user)
                        if pdf_buffer:
                            st.download_button(
                                label="💾 PDF 파일 다운로드",
                                data=pdf_buffer,
                                file_name=f"BIFF_여행일정_{saved['id']}.pdf",
                                mime="application/pdf",
                                key=f"download_{saved['id']}"
                            )
                
                with col2:
                    if st.button(f"🗑️ 삭제", key=f"delete_{saved['id']}"):
                        st.session_state.saved_itineraries = [
                            s for s in st.session_state.saved_itineraries if s['id'] != saved['id']
                        ]
                        st.rerun()
    
    # 샘플 일정 (기본 표시)
    else:
        st.markdown("### 📋 샘플 일정 미리보기")
        
        sample_itinerary = [
            {
                "day": 1,
                "theme": "BIFF 개막 & 센텀시티",
                "activities": [
                    "09:00 - 센텀시티역 도착 & 체크인",
                    "10:30 - 영화의전당 투어",
                    "14:00 - BIFF 개막작 관람",
                    "17:00 - 센텀시티 맛집 탐방",
                    "19:30 - 광안대교 야경 감상"
                ]
            },
            {
                "day": 2, 
                "theme": "부산 문화 & 영화",
                "activities": [
                    "09:00 - 감천문화마을 방문",
                    "12:00 - 자갈치시장 점심",
                    "14:30 - BIFF 경쟁작 관람",
                    "17:00 - 남포동 BIFF광장",
                    "19:00 - 부산 향토음식 저녁"
                ]
            },
            {
                "day": 3,
                "theme": "해운대 & 마무리",
                "activities": [
                    "09:00 - 해운대 해수욕장 산책",
                    "11:00 - 동백섬 카페",
                    "14:00 - BIFF 폐막작 관람", 
                    "17:00 - 기념품 쇼핑",
                    "19:00 - 부산역 출발"
                ]
            }
        ]
        
        for day in sample_itinerary:
            st.markdown(f"**📅 Day {day['day']}: {day['theme']}**")
            for activity in day['activities']:
                st.markdown(f"- {activity}")
            st.markdown("")

with tab7:
    st.markdown("### 🌤️ 부산 날씨")
    st.markdown("**📊 10월 부산 일반적인 날씨:**")
    st.markdown("- 🌡️ 평균 기온: 15-22°C")
    st.markdown("- 🍂 계절: 가을, 선선한 날씨")
    st.markdown("- ☔ 강수: 간헐적 비, 우산 준비 권장")
    st.markdown("- 💨 바람: 약간 바람, 얇은 외투 추천")
    st.markdown("- 🏊‍♀️ 해수욕: 수온이 낮아 수영보다는 산책 추천")
    
    st.markdown("**👕 추천 옷차림:**")
    st.markdown("- 🧥 가벼운 외투나 자켓")
    st.markdown("- 👕 긴팔 + 가디건 조합")
    st.markdown("- 🧥 저녁용 얇은 겉옷")
    
    st.markdown("**🎒 준비물:**")
    st.markdown("- ☂️ 우산 (간헐적 비 대비)")
    st.markdown("- 🧥 얇은 외투")
    st.markdown("- 💧 물티슈, 수건")

with tab8:
    st.markdown("### 🧳 BIFF 여행 짐 체크리스트")
    
    checklist_categories = {
        "👜 기본용 짐": [
            "캐리어/여행가방", "여권/신분증", "항공권/기차표", "숙소 예약 확인서",
            "현금/카드", "휴대폰 충전기", "보조배터리", "여행용 어댑터"
        ],
        "👕 의류": [
            "속옷 (여행일수+1벌)", "양말 (여행일수+1켤레)", "편한 운동화", "슬리퍼",
            "가벼운 외투/카디건", "긴팔 티셔츠", "반팔 티셔츠", "바지/치마", "잠옷"
        ],
        "🎬 BIFF 특화": [
            "영화 티켓 예매 확인", "상영 시간표 저장", "카메라/스마트폰", "휴대용 방석",
            "목베개", "간식/물", "우산 (10월 날씨 대비)", "마스크"
        ],
        "🏖️ 부산 특화": [
            "수영복 (해운대 방문시)", "비치타올", "선글라스", "모자",
            "편한 걷기 신발", "배낭/크로스백", "부산 지하철 앱", "번역 앱"
        ]
    }
    
    # 체크리스트 초기화
    if "checklist" not in st.session_state:
        st.session_state.checklist = {}
        for category, items in checklist_categories.items():
            st.session_state.checklist[category] = {item: False for item in items}
    
    # 진행률 표시
    total_items = sum(len(items) for items in checklist_categories.values())
    checked_items = sum(sum(category.values()) for category in st.session_state.checklist.values())
    progress = checked_items / total_items if total_items > 0 else 0
    
    col1, col2, col3 = st.columns([2, 1, 1])
    with col1:
        st.progress(progress)
    with col2:
        st.metric("완료", f"{checked_items}/{total_items}")
    with col3:
        st.metric("진행률", f"{progress:.1%}")
    
    # 카테고리별 체크리스트
    for category, items in checklist_categories.items():
        st.markdown(f"#### {category}")
        for item in items:
            checked = st.checkbox(
                item,
                value=st.session_state.checklist[category][item],
                key=f"check_{category}_{item}"
            )
            st.session_state.checklist[category][item] = checked

with tab9:
    st.markdown("### 🛍️ 여행용품 쇼핑")
    st.markdown("**🎒 추천 여행용품:**")
    
    products = [
        {
            "name": "20인치 기내용 캐리어",
            "desc": "BIFF 단기 여행용",
            "price": "10-15만원",
            "category": "캐리어"
        },
        {
            "name": "미러리스 카메라",
            "desc": "BIFF 인증샷 필수",
            "price": "80-150만원",
            "category": "카메라"
        },
        {
            "name": "보조배터리 20000mAh",
            "desc": "하루종일 외출용",
            "price": "3-5만원",
            "category": "여행용품"
        },
        {
            "name": "여행용 목베개",
            "desc": "장거리 이동시",
            "price": "1-3만원",
            "category": "여행용품"
        },
        {
            "name": "인스탁스 즉석카메라",
            "desc": "추억 남기기",
            "price": "8-12만원",
            "category": "카메라"
        },
        {
            "name": "여행용 세면도구 세트",
            "desc": "휴대용 완벽 세트",
            "price": "2-4만원",
            "category": "여행용품"
        }
    ]
    
    # 카테고리별 상품 표시
    categories = list(set(product["category"] for product in products))
    selected_category = st.selectbox("🏷️ 카테고리 선택", ["전체"] + categories)
    
    filtered_products = products if selected_category == "전체" else [p for p in products if p["category"] == selected_category]
    
    for product in filtered_products:
        st.markdown(f"""
        **🛍️ {product['name']}**
        - 📝 설명: {product['desc']}
        - 💰 가격: {product['price']}
        - 🏷️ 카테고리: {product['category']}
        """)

# 푸터
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 1rem;">
    <p>🎬 제29회 부산국제영화제 여행 챗봇</p>
    <p><small>※ 정확한 영화제 정보는 <a href="https://www.biff.kr" target="_blank">BIFF 공식 홈페이지</a>를 확인해주세요.</small></p>
    <p><small>💡 청년패스 정보: <a href="https://www.busan.go.kr/mayor/news/1691217" target="_blank">부산시 공식 발표</a></small></p>
</div>
""", unsafe_allow_html=True)