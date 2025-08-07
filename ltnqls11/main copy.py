import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

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

# 개선된 CSS 스타일
st.markdown("""
<style>
    /* 전체 앱 스타일 */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
    
    /* 메인 헤더 */
    .main-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: fadeInDown 1s ease-out;
    }
    
    /* 카드 스타일 */
    .info-card {
        background: white;
        border-radius: 15px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        border-left: 5px solid #4ecdc4;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .info-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    
    /* 메트릭 카드 */
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        text-align: center;
        margin: 0.5rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    /* 진행률 바 */
    .progress-container {
        background: #f0f0f0;
        border-radius: 10px;
        height: 20px;
        margin: 0.5rem 0;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        border-radius: 10px;
        transition: width 0.5s ease;
    }
    
    .progress-good { background: linear-gradient(90deg, #27ae60, #2ecc71); }
    .progress-warning { background: linear-gradient(90deg, #f39c12, #e67e22); }
    .progress-danger { background: linear-gradient(90deg, #e74c3c, #c0392b); }
    
    /* 탭 스타일 개선 */
    .stTabs [data-baseweb="tab-list"] {
        gap: 0.5rem;
        background: #f8f9fa;
        padding: 0.5rem;
        border-radius: 15px;
    }
    
    .stTabs [data-baseweb="tab"] {
        height: 60px;
        padding: 0px 20px;
        background: white;
        border-radius: 10px;
        color: #2c3e50;
        font-weight: 600;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: #667eea;
    }
    
    /* 버튼 스타일 */
    .stButton > button {
        border-radius: 10px;
        border: none;
        padding: 0.5rem 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    /* 애니메이션 */
    @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out;
    }
    
    /* 알림 스타일 */
    .alert-success {
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    
    .alert-warning {
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    
    .alert-danger {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# 시각화 함수들
def create_budget_pie_chart(budget_data):
    """예산 분배 파이 차트 생성"""
    if not budget_data:
        return None
    
    categories = list(budget_data.keys())
    values = list(budget_data.values())
    
    fig = go.Figure(data=[go.Pie(
        labels=categories,
        values=values,
        hole=0.4,
        textinfo='label+percent',
        textfont_size=12,
        marker=dict(
            colors=['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
            line=dict(color='#FFFFFF', width=2)
        )
    )])
    
    fig.update_layout(
        title={
            'text': '💰 카테고리별 예산 분배',
            'x': 0.5,
            'font': {'size': 18, 'color': '#2c3e50'}
        },
        font=dict(size=12),
        showlegend=True,
        height=400,
        margin=dict(t=50, b=50, l=50, r=50)
    )
    
    return fig

def create_expense_timeline(expense_records):
    """지출 타임라인 차트 생성"""
    if not expense_records:
        return None
    
    df = pd.DataFrame(expense_records)
    df['date'] = pd.to_datetime(df['date_time']).dt.date
    daily_expenses = df.groupby(['date', 'category'])['amount'].sum().reset_index()
    
    fig = px.line(daily_expenses, x='date', y='amount', color='category',
                  title='📈 일별 지출 현황',
                  labels={'amount': '지출 금액 (원)', 'date': '날짜', 'category': '카테고리'})
    
    fig.update_layout(
        title_font_size=18,
        title_x=0.5,
        height=400,
        margin=dict(t=50, b=50, l=50, r=50)
    )
    
    return fig

def create_budget_status_chart(budget_status):
    """예산 현황 바 차트 생성"""
    if not budget_status:
        return None
    
    categories = list(budget_status.keys())
    budgeted = [status['budgeted'] for status in budget_status.values()]
    spent = [status['spent'] for status in budget_status.values()]
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        name='예산',
        x=categories,
        y=budgeted,
        marker_color='lightblue',
        opacity=0.7
    ))
    
    fig.add_trace(go.Bar(
        name='지출',
        x=categories,
        y=spent,
        marker_color='coral'
    ))
    
    fig.update_layout(
        title={
            'text': '📊 예산 vs 지출 현황',
            'x': 0.5,
            'font': {'size': 18}
        },
        barmode='group',
        height=400,
        margin=dict(t=50, b=50, l=50, r=50),
        yaxis_title='금액 (원)',
        xaxis_title='카테고리'
    )
    
    return fig

def create_rating_distribution(reviews):
    """리뷰 평점 분포 차트"""
    if not reviews:
        return None
    
    ratings = [review['rating'] for review in reviews]
    rating_counts = pd.Series(ratings).value_counts().sort_index()
    
    fig = go.Figure(data=[go.Bar(
        x=[f"{i}점" for i in rating_counts.index],
        y=rating_counts.values,
        marker_color=['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60'][:len(rating_counts)]
    )])
    
    fig.update_layout(
        title={
            'text': '⭐ 여행 후기 평점 분포',
            'x': 0.5,
            'font': {'size': 18}
        },
        height=300,
        margin=dict(t=50, b=50, l=50, r=50),
        yaxis_title='후기 수',
        xaxis_title='평점'
    )
    
    return fig

def create_photo_location_chart(photos):
    """포토존 인기도 차트"""
    if not photos:
        return None
    
    locations = [photo['location'] for photo in photos]
    location_counts = pd.Series(locations).value_counts()
    
    fig = go.Figure(data=[go.Bar(
        x=location_counts.values,
        y=location_counts.index,
        orientation='h',
        marker_color='#4ECDC4'
    )])
    
    fig.update_layout(
        title={
            'text': '📸 인기 포토존 순위',
            'x': 0.5,
            'font': {'size': 18}
        },
        height=400,
        margin=dict(t=50, b=50, l=50, r=50),
        xaxis_title='사진 수',
        yaxis_title='장소'
    )
    
    return fig

# 메인 헤더 (개선된 디자인)
st.markdown("""
<div class="main-header">
    <h1 style="color: white; margin: 0; font-size: 2.5em;">🎬 BIFF 29회 여행 가이드</h1>
    <p style="color: white; margin: 0.5rem 0 0 0; font-size: 1.2em; opacity: 0.9;">부산국제영화제 & 부산여행 올인원 플랫폼</p>
    <div style="margin-top: 1rem;">
        <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; margin: 0 0.5rem;">📅 2024.10.2-11</span>
        <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; margin: 0 0.5rem;">🎫 7,000원~</span>
        <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; margin: 0 0.5rem;">🎉 청년패스 할인</span>
    </div>
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

# 소셜 기능 관련 함수들
def create_user_profile(name, age, interests, travel_style, preferred_movies):
    """사용자 프로필 생성"""
    return {
        "id": f"user_{len(st.session_state.get('user_profiles', []))+1}",
        "name": name,
        "age": age,
        "interests": interests,
        "travel_style": travel_style,
        "preferred_movies": preferred_movies,
        "created_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": "여행 동행자 찾는 중",
        "contact": "채팅으로 연락하세요"
    }

def find_matching_users(user_interests, user_movies, user_style):
    """관심사 기반 매칭 사용자 찾기"""
    if 'user_profiles' not in st.session_state:
        return []
    
    matches = []
    for profile in st.session_state.user_profiles:
        # 관심사 매칭 점수
        interest_score = len(set(user_interests) & set(profile['interests']))
        # 영화 매칭 점수  
        movie_score = len(set(user_movies) & set(profile['preferred_movies']))
        # 여행 스타일 매칭
        style_score = 1 if user_style == profile['travel_style'] else 0
        
        total_score = interest_score + movie_score + style_score
        
        if total_score > 0:
            matches.append({
                'profile': profile,
                'score': total_score,
                'match_reasons': []
            })
            
            # 매칭 이유 추가
            if interest_score > 0:
                matches[-1]['match_reasons'].append(f"공통 관심사 {interest_score}개")
            if movie_score > 0:
                matches[-1]['match_reasons'].append(f"선호 영화 {movie_score}개 일치")
            if style_score > 0:
                matches[-1]['match_reasons'].append("여행 스타일 일치")
    
    # 점수순으로 정렬
    matches.sort(key=lambda x: x['score'], reverse=True)
    return matches

def create_travel_review(user_name, rating, title, content, photos, visited_places):
    """여행 후기 생성"""
    return {
        "id": f"review_{len(st.session_state.get('travel_reviews', []))+1}",
        "user_name": user_name,
        "rating": rating,
        "title": title,
        "content": content,
        "photos": photos,
        "visited_places": visited_places,
        "created_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "likes": 0,
        "comments": []
    }

def create_photo_post(user_name, location, photo_url, caption, tags):
    """포토존 인증샷 포스트 생성"""
    return {
        "id": f"photo_{len(st.session_state.get('photo_gallery', []))+1}",
        "user_name": user_name,
        "location": location,
        "photo_url": photo_url,
        "caption": caption,
        "tags": tags,
        "created_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "likes": 0,
        "comments": []
    }

# 샘플 데이터 생성 함수
def initialize_sample_data():
    """샘플 소셜 데이터 초기화"""
    if 'user_profiles' not in st.session_state:
        st.session_state.user_profiles = [
            {
                "id": "user_1",
                "name": "영화광 김씨",
                "age": 25,
                "interests": ["영화", "문화", "사진"],
                "travel_style": "영화 중심 (BIFF 집중)",
                "preferred_movies": ["드라마", "스릴러", "독립영화"],
                "created_date": "2024-09-15 14:30",
                "status": "10월 3-5일 동행자 구함",
                "contact": "biff_lover@email.com"
            },
            {
                "id": "user_2", 
                "name": "부산 토박이 이씨",
                "age": 30,
                "interests": ["맛집", "관광", "영화"],
                "travel_style": "관광 + 영화 균형",
                "preferred_movies": ["코미디", "액션", "로맨스"],
                "created_date": "2024-09-20 10:15",
                "status": "부산 가이드 가능합니다",
                "contact": "busan_guide@email.com"
            },
            {
                "id": "user_3",
                "name": "사진작가 박씨",
                "age": 28,
                "interests": ["사진", "예술", "영화"],
                "travel_style": "영화 + 포토존",
                "preferred_movies": ["아트하우스", "다큐멘터리"],
                "created_date": "2024-09-25 16:45",
                "status": "포토존 투어 함께해요",
                "contact": "photo_biff@email.com"
            }
        ]
    
    if 'travel_reviews' not in st.session_state:
        st.session_state.travel_reviews = [
            {
                "id": "review_1",
                "user_name": "BIFF 마니아",
                "rating": 5,
                "title": "완벽했던 BIFF 28회 후기",
                "content": "작년 BIFF는 정말 최고였어요! 영화의전당에서 본 개막작이 아직도 기억에 남네요. 센텀시티 호텔에 머물면서 도보로 이동할 수 있어서 너무 편했습니다.",
                "photos": ["영화의전당.jpg", "BIFF광장.jpg"],
                "visited_places": ["영화의전당", "BIFF광장", "센텀시티"],
                "created_date": "2023-11-15 20:30",
                "likes": 24,
                "comments": ["저도 내년에 가보고 싶어요!", "정보 감사합니다"]
            },
            {
                "id": "review_2",
                "user_name": "부산 여행러버",
                "rating": 4,
                "title": "영화제 + 부산 관광 3박4일",
                "content": "BIFF 기간에 부산 여행을 다녀왔어요. 영화 관람과 함께 해운대, 감천문화마을도 둘러보니 알찬 여행이었습니다. 돼지국밥은 꼭 드세요!",
                "photos": ["해운대.jpg", "감천문화마을.jpg"],
                "visited_places": ["해운대", "감천문화마을", "자갈치시장"],
                "created_date": "2023-10-20 15:20",
                "likes": 18,
                "comments": ["맛집 정보도 알려주세요"]
            }
        ]
    
    if 'photo_gallery' not in st.session_state:
        st.session_state.photo_gallery = [
            {
                "id": "photo_1",
                "user_name": "포토그래퍼",
                "location": "영화의전당",
                "photo_url": "cinema_center.jpg",
                "caption": "BIFF 메인 상영관에서 📸 #BIFF #영화의전당 #부산여행",
                "tags": ["BIFF", "영화의전당", "부산여행"],
                "created_date": "2024-10-03 14:20",
                "likes": 45,
                "comments": ["멋진 사진이네요!", "저도 여기서 찍었어요"]
            },
            {
                "id": "photo_2",
                "user_name": "여행스타그램",
                "location": "BIFF광장",
                "photo_url": "biff_square.jpg", 
                "caption": "핸드프린팅과 함께 인증샷! ✋ #BIFF광장 #핸드프린팅",
                "tags": ["BIFF광장", "핸드프린팅", "인증샷"],
                "created_date": "2024-10-04 16:30",
                "likes": 32,
                "comments": ["저도 찍어야겠어요"]
            },
            {
                "id": "photo_3",
                "user_name": "부산러버",
                "location": "광안대교",
                "photo_url": "gwangan_bridge.jpg",
                "caption": "BIFF 관람 후 광안대교 야경 🌉 #광안대교 #부산야경",
                "tags": ["광안대교", "부산야경", "BIFF"],
                "created_date": "2024-10-04 21:15",
                "likes": 67,
                "comments": ["야경이 정말 예쁘네요", "부산 최고!"]
            }
        ]

# 세션 상태 초기화
if "saved_itineraries" not in st.session_state:
    st.session_state.saved_itineraries = []

# 예산 관리 관련 함수들
def create_budget_plan(days, budget_level, use_youth_pass=False):
    """여행 일수와 예산 수준에 따른 예산 계획 생성"""
    
    # 기본 예산 템플릿 (1일 기준)
    budget_templates = {
        "저예산 (1일 5만원 이하)": {
            "숙박": 25000,
            "교통": 8000,
            "식사": 12000,
            "영화": 7000,
            "관광": 3000,
            "쇼핑": 5000,
            "기타": 5000
        },
        "보통 (1일 5-10만원)": {
            "숙박": 50000,
            "교통": 12000,
            "식사": 25000,
            "영화": 10000,
            "관광": 8000,
            "쇼핑": 10000,
            "기타": 10000
        },
        "고예산 (1일 10만원 이상)": {
            "숙박": 80000,
            "교통": 15000,
            "식사": 40000,
            "영화": 15000,
            "관광": 15000,
            "쇼핑": 20000,
            "기타": 15000
        }
    }
    
    daily_budget = budget_templates.get(budget_level, budget_templates["보통 (1일 5-10만원)"])
    
    # 청년패스 할인 적용
    if use_youth_pass:
        daily_budget["교통"] = int(daily_budget["교통"] * 0.8)  # 20% 할인
        daily_budget["영화"] = int(daily_budget["영화"] * 0.9)   # 10% 할인
        daily_budget["관광"] = int(daily_budget["관광"] * 0.9)   # 10% 할인
    
    # 전체 기간 예산 계산
    total_budget = {}
    for category, amount in daily_budget.items():
        if category == "숙박":
            total_budget[category] = amount * (days - 1)  # 숙박은 하루 적게
        else:
            total_budget[category] = amount * days
    
    return {
        "daily_budget": daily_budget,
        "total_budget": total_budget,
        "days": days,
        "youth_pass_applied": use_youth_pass
    }

def create_expense_record(category, amount, description, location, date_time=None):
    """지출 기록 생성"""
    if date_time is None:
        date_time = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    return {
        "id": f"expense_{len(st.session_state.get('expense_records', []))+1}",
        "category": category,
        "amount": amount,
        "description": description,
        "location": location,
        "date_time": date_time,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def calculate_budget_status(budget_plan, expense_records):
    """예산 대비 지출 현황 계산"""
    if not budget_plan or not expense_records:
        return {}
    
    total_budget = budget_plan["total_budget"]
    
    # 카테고리별 지출 합계
    spent_by_category = {}
    for category in total_budget.keys():
        spent_by_category[category] = sum(
            expense["amount"] for expense in expense_records 
            if expense["category"] == category
        )
    
    # 예산 상태 계산
    budget_status = {}
    for category, budgeted in total_budget.items():
        spent = spent_by_category.get(category, 0)
        remaining = budgeted - spent
        percentage = (spent / budgeted * 100) if budgeted > 0 else 0
        
        budget_status[category] = {
            "budgeted": budgeted,
            "spent": spent,
            "remaining": remaining,
            "percentage": percentage,
            "status": "over" if spent > budgeted else "warning" if percentage > 80 else "good"
        }
    
    return budget_status

def get_budget_recommendations(days, interests, use_youth_pass=False):
    """관심사 기반 예산 추천"""
    base_recommendations = {
        "영화": {
            "description": "BIFF 티켓 및 영화 관련 비용",
            "items": ["영화 티켓", "팝콘/음료", "굿즈"],
            "daily_amount": 15000 if not use_youth_pass else 13500
        },
        "맛집": {
            "description": "부산 맛집 탐방 비용",
            "items": ["돼지국밥", "밀면", "해산물", "카페"],
            "daily_amount": 35000
        },
        "관광": {
            "description": "부산 관광지 입장료 및 체험",
            "items": ["감천문화마을", "해운대", "용두산타워"],
            "daily_amount": 12000 if not use_youth_pass else 10800
        },
        "쇼핑": {
            "description": "기념품 및 쇼핑",
            "items": ["BIFF 굿즈", "부산 특산품", "의류"],
            "daily_amount": 20000
        },
        "사진": {
            "description": "포토존 및 사진 관련 비용",
            "items": ["인스탁스 필름", "포토부스", "프린트"],
            "daily_amount": 8000
        }
    }
    
    recommendations = {}
    for interest in interests:
        if interest in base_recommendations:
            rec = base_recommendations[interest].copy()
            rec["total_amount"] = rec["daily_amount"] * days
            recommendations[interest] = rec
    
    return recommendations

# 예산 관리 세션 상태 초기화
if "budget_plan" not in st.session_state:
    st.session_state.budget_plan = None

if "expense_records" not in st.session_state:
    st.session_state.expense_records = []

if "budget_alerts" not in st.session_state:
    st.session_state.budget_alerts = []

# 샘플 데이터 초기화
initialize_sample_data()

# 탭으로 섹션 구분
tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8, tab9, tab10, tab11 = st.tabs([
    "💬 AI 채팅", 
    "🎬 BIFF 상영일정", 
    "🚇 부산 교통", 
    "🍽️ 부산 맛집", 
    "🏨 부산 숙소", 
    "📅 여행 일정", 
    "👥 소셜 & 커뮤니티", 
    "💰 예산 관리", 
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
        "3박4일 예산 계산",
        "부산 청년패스 혜택",
        "영화+관광 일정 추천",
        "여행 절약 팁 알려줘"
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
    # 소셜 & 커뮤니티 기능
    st.markdown("### 👥 BIFF 소셜 & 커뮤니티")
    
    # 서브 탭으로 기능 구분
    social_tab1, social_tab2, social_tab3, social_tab4 = st.tabs([
        "🤝 동행자 찾기", "📝 여행 후기", "📸 포토존 갤러리", "👤 내 프로필"
    ])
    
    with social_tab1:
        # 동행자 찾기
        st.markdown("#### 🤝 BIFF 여행 동행자 찾기")
        
        # 내 정보 입력
        st.markdown("##### 📋 내 여행 정보")
        
        col1, col2 = st.columns(2)
        
        with col1:
            my_name = st.text_input("닉네임", placeholder="영화광123")
            my_age = st.selectbox("연령대", ["10대", "20대", "30대", "40대", "50대 이상"])
            my_travel_style = st.selectbox("여행 스타일", [
                "영화 중심 (BIFF 집중)",
                "관광 + 영화 균형",
                "먹방 + 영화",
                "쇼핑 + 영화",
                "휴양 + 영화"
            ])
        
        with col2:
            my_interests = st.multiselect("관심사", [
                "영화", "문화", "맛집", "자연", "쇼핑", "사진", "예술", "야경"
            ])
            my_movies = st.multiselect("선호 영화 장르", [
                "드라마", "코미디", "액션", "스릴러", "로맨스", "SF", "독립영화", "다큐멘터리", "아트하우스"
            ])
            travel_dates = st.text_input("여행 날짜", placeholder="10월 3-5일")
        
        # 동행자 찾기 버튼
        if st.button("🔍 나와 맞는 동행자 찾기", type="primary"):
            if my_name and my_interests and my_movies:
                matches = find_matching_users(my_interests, my_movies, my_travel_style)
                
                if matches:
                    st.markdown("##### 🎯 추천 동행자")
                    
                    for match in matches[:5]:  # 상위 5명만 표시
                        profile = match['profile']
                        score = match['score']
                        reasons = match['match_reasons']
                        
                        st.markdown(f"""
                        <div style="background: white; border: 1px solid #ddd; border-radius: 15px; padding: 1.5rem; margin: 1rem 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h4>👤 {profile['name']} ({profile['age']})</h4>
                                <span style="background: #4ecdc4; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.9em;">매칭도 {score}점</span>
                            </div>
                            <p><strong>🎯 여행 스타일:</strong> {profile['travel_style']}</p>
                            <p><strong>🎭 관심사:</strong> {', '.join(profile['interests'])}</p>
                            <p><strong>🎬 선호 영화:</strong> {', '.join(profile['preferred_movies'])}</p>
                            <p><strong>📅 상태:</strong> {profile['status']}</p>
                            <p><strong>💌 연락처:</strong> {profile['contact']}</p>
                            <p><strong>🎯 매칭 이유:</strong> {', '.join(reasons)}</p>
                        </div>
                        """, unsafe_allow_html=True)
                else:
                    st.info("현재 매칭되는 동행자가 없습니다. 프로필을 등록하시면 다른 분들이 찾을 수 있어요!")
            else:
                st.warning("닉네임, 관심사, 선호 영화 장르를 모두 입력해주세요.")
        
        # 내 프로필 등록
        st.markdown("---")
        st.markdown("##### 📝 내 프로필 등록하기")
        
        if st.button("📝 프로필 등록 (다른 사람들이 나를 찾을 수 있어요)"):
            if my_name and my_interests and my_movies:
                new_profile = create_user_profile(
                    my_name, my_age, my_interests, my_travel_style, my_movies
                )
                st.session_state.user_profiles.append(new_profile)
                st.success("✅ 프로필이 등록되었습니다! 다른 여행자들이 회원님을 찾을 수 있어요.")
            else:
                st.warning("모든 정보를 입력해주세요.")
        
        # 등록된 모든 사용자 목록
        st.markdown("---")
        st.markdown("##### 👥 등록된 여행자들")
        
        for profile in st.session_state.user_profiles:
            st.markdown(f"""
            <div style="background: #f8f9fa; border-radius: 10px; padding: 1rem; margin: 0.5rem 0;">
                <strong>👤 {profile['name']}</strong> ({profile['age']}) - {profile['travel_style']}<br>
                <small>관심사: {', '.join(profile['interests'])} | 상태: {profile['status']}</small>
            </div>
            """, unsafe_allow_html=True)
    
    with social_tab2:
        # 여행 후기
        st.markdown("#### 📝 BIFF 여행 후기")
        
        # 후기 작성
        with st.expander("✍️ 새 후기 작성하기"):
            review_name = st.text_input("닉네임", key="review_name")
            review_rating = st.selectbox("평점", [5, 4, 3, 2, 1], format_func=lambda x: "⭐" * x)
            review_title = st.text_input("제목", placeholder="BIFF 29회 후기")
            review_content = st.text_area("후기 내용", placeholder="여행 경험을 자세히 써주세요...")
            
            col1, col2 = st.columns(2)
            with col1:
                visited_places = st.multiselect("방문한 곳", [
                    "영화의전당", "롯데시네마 센텀시티", "CGV 센텀시티", "부산시네마센터",
                    "해운대", "광안리", "감천문화마을", "자갈치시장", "BIFF광장", "서면", "남포동"
                ])
            
            with col2:
                photo_names = st.text_area("사진 파일명", placeholder="photo1.jpg, photo2.jpg")
            
            if st.button("📝 후기 등록"):
                if review_name and review_title and review_content:
                    photos = [p.strip() for p in photo_names.split(",")] if photo_names else []
                    new_review = create_travel_review(
                        review_name, review_rating, review_title, review_content, photos, visited_places
                    )
                    st.session_state.travel_reviews.append(new_review)
                    st.success("✅ 후기가 등록되었습니다!")
                else:
                    st.warning("닉네임, 제목, 내용을 모두 입력해주세요.")
        
        # 후기 통계 시각화
        if st.session_state.travel_reviews:
            st.markdown("##### 📊 후기 통계")
            
            col1, col2 = st.columns([1, 1])
            
            with col1:
                # 평점 분포 차트
                rating_chart = create_rating_distribution(st.session_state.travel_reviews)
                if rating_chart:
                    st.plotly_chart(rating_chart, use_container_width=True)
            
            with col2:
                # 후기 통계 메트릭
                total_reviews = len(st.session_state.travel_reviews)
                avg_rating = sum(r['rating'] for r in st.session_state.travel_reviews) / total_reviews
                total_likes = sum(r['likes'] for r in st.session_state.travel_reviews)
                
                st.markdown(f"""
                <div class="metric-card">
                    <h2 style="margin: 0; font-size: 2em;">📝</h2>
                    <h3 style="margin: 0.5rem 0;">{total_reviews}개</h3>
                    <p style="margin: 0; opacity: 0.8;">총 후기</p>
                </div>
                """, unsafe_allow_html=True)
                
                st.markdown(f"""
                <div class="metric-card" style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);">
                    <h2 style="margin: 0; font-size: 2em;">⭐</h2>
                    <h3 style="margin: 0.5rem 0;">{avg_rating:.1f}점</h3>
                    <p style="margin: 0; opacity: 0.8;">평균 평점</p>
                </div>
                """, unsafe_allow_html=True)
                
                st.markdown(f"""
                <div class="metric-card" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                    <h2 style="margin: 0; font-size: 2em;">👍</h2>
                    <h3 style="margin: 0.5rem 0;">{total_likes}개</h3>
                    <p style="margin: 0; opacity: 0.8;">총 좋아요</p>
                </div>
                """, unsafe_allow_html=True)
        
        # 후기 목록
        st.markdown("##### 📚 여행 후기 목록")
        
        # 정렬 옵션
        sort_option = st.selectbox("정렬", ["최신순", "평점 높은 순", "좋아요 많은 순"])
        
        reviews = st.session_state.travel_reviews.copy()
        if sort_option == "평점 높은 순":
            reviews.sort(key=lambda x: x['rating'], reverse=True)
        elif sort_option == "좋아요 많은 순":
            reviews.sort(key=lambda x: x['likes'], reverse=True)
        else:  # 최신순
            reviews.sort(key=lambda x: x['created_date'], reverse=True)
        
        for review in reviews:
            st.markdown(f"""
            <div style="background: white; border: 1px solid #ddd; border-radius: 15px; padding: 1.5rem; margin: 1rem 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4>📝 {review['title']}</h4>
                    <span style="background: #f39c12; color: white; padding: 0.3rem 0.8rem; border-radius: 20px;">{'⭐' * review['rating']}</span>
                </div>
                <p><strong>👤 작성자:</strong> {review['user_name']} | <strong>📅 작성일:</strong> {review['created_date']}</p>
                <p>{review['content']}</p>
                {f"<p><strong>📍 방문 장소:</strong> {', '.join(review['visited_places'])}</p>" if review['visited_places'] else ""}
                {f"<p><strong>📸 사진:</strong> {', '.join(review['photos'])}</p>" if review['photos'] else ""}
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <span>👍 좋아요 {review['likes']}</span>
                    <span>💬 댓글 {len(review['comments'])}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # 좋아요 버튼
            if st.button(f"👍 좋아요", key=f"like_review_{review['id']}"):
                # 후기 찾아서 좋아요 증가
                for i, r in enumerate(st.session_state.travel_reviews):
                    if r['id'] == review['id']:
                        st.session_state.travel_reviews[i]['likes'] += 1
                        break
                st.rerun()
    
    with social_tab3:
        # 포토존 갤러리
        st.markdown("#### 📸 BIFF 포토존 인증샷 갤러리")
        
        # 사진 업로드
        with st.expander("📷 새 사진 업로드하기"):
            photo_name = st.text_input("닉네임", key="photo_name")
            photo_location = st.selectbox("촬영 장소", [
                "영화의전당", "BIFF광장", "광안대교", "해운대", "감천문화마을", 
                "자갈치시장", "센텀시티", "서면", "남포동", "용두산공원"
            ])
            photo_file = st.text_input("사진 파일명", placeholder="my_photo.jpg")
            photo_caption = st.text_area("사진 설명", placeholder="멋진 인증샷! #BIFF #부산여행")
            photo_tags = st.text_input("태그", placeholder="BIFF, 부산여행, 인증샷 (쉼표로 구분)")
            
            if st.button("📸 사진 업로드"):
                if photo_name and photo_location and photo_file and photo_caption:
                    tags = [tag.strip() for tag in photo_tags.split(",")] if photo_tags else []
                    new_photo = create_photo_post(
                        photo_name, photo_location, photo_file, photo_caption, tags
                    )
                    st.session_state.photo_gallery.append(new_photo)
                    st.success("✅ 사진이 업로드되었습니다!")
                else:
                    st.warning("모든 정보를 입력해주세요.")
        
        # 갤러리 필터
        st.markdown("##### 🔍 갤러리 필터")
        col1, col2 = st.columns(2)
        
        with col1:
            location_filter = st.selectbox("장소별 보기", [
                "전체", "영화의전당", "BIFF광장", "광안대교", "해운대", "감천문화마을", "자갈치시장"
            ])
        
        with col2:
            gallery_sort = st.selectbox("정렬", ["최신순", "좋아요 많은 순"])
        
        # 포토존 통계 시각화
        if st.session_state.photo_gallery:
            st.markdown("##### 📊 포토존 통계")
            
            col1, col2 = st.columns([1, 1])
            
            with col1:
                # 인기 포토존 차트
                location_chart = create_photo_location_chart(st.session_state.photo_gallery)
                if location_chart:
                    st.plotly_chart(location_chart, use_container_width=True)
            
            with col2:
                # 포토존 통계 메트릭
                total_photos = len(st.session_state.photo_gallery)
                total_photo_likes = sum(p['likes'] for p in st.session_state.photo_gallery)
                popular_location = max(st.session_state.photo_gallery, key=lambda x: x['likes'])['location']
                
                st.markdown(f"""
                <div class="metric-card">
                    <h2 style="margin: 0; font-size: 2em;">📸</h2>
                    <h3 style="margin: 0.5rem 0;">{total_photos}장</h3>
                    <p style="margin: 0; opacity: 0.8;">총 사진</p>
                </div>
                """, unsafe_allow_html=True)
                
                st.markdown(f"""
                <div class="metric-card" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                    <h2 style="margin: 0; font-size: 2em;">❤️</h2>
                    <h3 style="margin: 0.5rem 0;">{total_photo_likes}개</h3>
                    <p style="margin: 0; opacity: 0.8;">총 좋아요</p>
                </div>
                """, unsafe_allow_html=True)
                
                st.markdown(f"""
                <div class="metric-card" style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);">
                    <h2 style="margin: 0; font-size: 2em;">🏆</h2>
                    <h3 style="margin: 0.5rem 0; font-size: 1em;">{popular_location}</h3>
                    <p style="margin: 0; opacity: 0.8;">인기 포토존</p>
                </div>
                """, unsafe_allow_html=True)
        
        # 사진 갤러리
        st.markdown("##### 📸 포토존 갤러리")
        
        photos = st.session_state.photo_gallery.copy()
        
        # 필터 적용
        if location_filter != "전체":
            photos = [p for p in photos if p['location'] == location_filter]
        
        # 정렬 적용
        if gallery_sort == "좋아요 많은 순":
            photos.sort(key=lambda x: x['likes'], reverse=True)
        else:
            photos.sort(key=lambda x: x['created_date'], reverse=True)
        
        # 3열 그리드로 사진 표시
        cols = st.columns(3)
        
        for i, photo in enumerate(photos):
            with cols[i % 3]:
                st.markdown(f"""
                <div style="background: white; border: 1px solid #ddd; border-radius: 15px; padding: 1rem; margin: 0.5rem 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <div style="background: #f0f0f0; height: 200px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                        <span style="color: #666; font-size: 3em;">📸</span>
                    </div>
                    <h5>📍 {photo['location']}</h5>
                    <p><strong>👤 {photo['user_name']}</strong></p>
                    <p style="font-size: 0.9em;">{photo['caption']}</p>
                    <p style="font-size: 0.8em; color: #666;">📅 {photo['created_date']}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>👍 {photo['likes']}</span>
                        <span>💬 {len(photo['comments'])}</span>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                # 좋아요 버튼
                if st.button("👍", key=f"like_photo_{photo['id']}"):
                    for j, p in enumerate(st.session_state.photo_gallery):
                        if p['id'] == photo['id']:
                            st.session_state.photo_gallery[j]['likes'] += 1
                            break
                    st.rerun()
    
    with social_tab4:
        # 내 프로필
        st.markdown("#### 👤 내 프로필 관리")
        
        # 프로필 통계
        st.markdown("##### 📊 내 활동 통계")
        
        user_reviews = len([r for r in st.session_state.travel_reviews if r.get('user_name') == '내 닉네임'])
        user_photos = len([p for p in st.session_state.photo_gallery if p.get('user_name') == '내 닉네임'])
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("작성한 후기", user_reviews)
        
        with col2:
            st.metric("업로드한 사진", user_photos)
        
        with col3:
            st.metric("받은 좋아요", 0)
        
        # 내 후기 목록
        st.markdown("##### 📝 내가 작성한 후기")
        my_reviews = [r for r in st.session_state.travel_reviews if r.get('user_name') == '내 닉네임']
        
        if my_reviews:
            for review in my_reviews:
                st.markdown(f"- **{review['title']}** ({'⭐' * review['rating']}) - {review['created_date']}")
        else:
            st.info("아직 작성한 후기가 없습니다.")
        
        # 내 사진 목록
        st.markdown("##### 📸 내가 업로드한 사진")
        my_photos = [p for p in st.session_state.photo_gallery if p.get('user_name') == '내 닉네임']
        
        if my_photos:
            for photo in my_photos:
                st.markdown(f"- **{photo['location']}** - {photo['caption'][:30]}... ({photo['created_date']})")
        else:
            st.info("아직 업로드한 사진이 없습니다.")
        
        # 프로필 설정
        st.markdown("---")
        st.markdown("##### ⚙️ 프로필 설정")
        
        if st.button("🗑️ 내 모든 데이터 삭제"):
            # 사용자 확인
            if st.checkbox("정말로 모든 데이터를 삭제하시겠습니까?"):
                st.warning("이 기능은 실제 구현에서는 사용자 인증이 필요합니다.")

with tab8:
    # 예산 관리
    st.markdown("### 💰 BIFF 여행 예산 관리")
    
    # 서브 탭으로 기능 구분
    budget_tab1, budget_tab2, budget_tab3, budget_tab4 = st.tabs([
        "📊 예산 계획", "💳 지출 기록", "📈 예산 현황", "💡 절약 팁"
    ])
    
    with budget_tab1:
        # 예산 계획
        st.markdown("#### 📊 여행 예산 계획 세우기")
        
        # 기본 설정
        col1, col2, col3 = st.columns(3)
        
        with col1:
            budget_days = st.selectbox("여행 기간", [2, 3, 4, 5, 6, 7], index=1, key="budget_days")
        
        with col2:
            budget_level = st.selectbox("예산 수준", [
                "저예산 (1일 5만원 이하)",
                "보통 (1일 5-10만원)", 
                "고예산 (1일 10만원 이상)"
            ], key="budget_level")
        
        with col3:
            use_youth_pass = st.checkbox("🎉 부산 청년패스 사용", value=False, key="budget_youth_pass")
        
        # 관심사 기반 예산 추천
        st.markdown("##### 🎯 관심사별 예산 추천")
        
        budget_interests = st.multiselect("관심사 선택", [
            "영화", "맛집", "관광", "쇼핑", "사진"
        ], key="budget_interests")
        
        # 예산 계획 생성 버튼
        if st.button("💰 예산 계획 생성", type="primary"):
            # 기본 예산 계획
            budget_plan = create_budget_plan(budget_days, budget_level, use_youth_pass)
            st.session_state.budget_plan = budget_plan
            
            # 관심사 기반 추천
            if budget_interests:
                recommendations = get_budget_recommendations(budget_days, budget_interests, use_youth_pass)
                st.session_state.budget_recommendations = recommendations
            
            st.success("✅ 예산 계획이 생성되었습니다!")
        
        # 생성된 예산 계획 표시
        if st.session_state.budget_plan:
            budget_plan = st.session_state.budget_plan
            
            st.markdown("---")
            st.markdown("##### 💰 생성된 예산 계획")
            
            # 총 예산 요약 (개선된 메트릭 카드)
            total_amount = sum(budget_plan["total_budget"].values())
            daily_amount = sum(budget_plan["daily_budget"].values())
            
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.markdown(f"""
                <div class="metric-card">
                    <h2 style="margin: 0; font-size: 2em;">📅</h2>
                    <h3 style="margin: 0.5rem 0;">{budget_plan['days']}일</h3>
                    <p style="margin: 0; opacity: 0.8;">여행 기간</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                st.markdown(f"""
                <div class="metric-card">
                    <h2 style="margin: 0; font-size: 2em;">💰</h2>
                    <h3 style="margin: 0.5rem 0;">{total_amount:,}원</h3>
                    <p style="margin: 0; opacity: 0.8;">총 예산</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col3:
                st.markdown(f"""
                <div class="metric-card">
                    <h2 style="margin: 0; font-size: 2em;">📊</h2>
                    <h3 style="margin: 0.5rem 0;">{daily_amount:,}원</h3>
                    <p style="margin: 0; opacity: 0.8;">일일 평균</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col4:
                youth_status = "적용됨" if budget_plan['youth_pass_applied'] else "미적용"
                youth_icon = "🎉" if budget_plan['youth_pass_applied'] else "❌"
                st.markdown(f"""
                <div class="metric-card">
                    <h2 style="margin: 0; font-size: 2em;">{youth_icon}</h2>
                    <h3 style="margin: 0.5rem 0;">{youth_status}</h3>
                    <p style="margin: 0; opacity: 0.8;">청년패스</p>
                </div>
                """, unsafe_allow_html=True)
            
            # 카테고리별 예산 (시각화 개선)
            st.markdown("##### 📋 카테고리별 예산")
            
            col1, col2 = st.columns([1, 1])
            
            with col1:
                # 파이 차트
                pie_chart = create_budget_pie_chart(budget_plan["total_budget"])
                if pie_chart:
                    st.plotly_chart(pie_chart, use_container_width=True)
            
            with col2:
                # 카테고리별 상세 정보
                for category, total_budget in budget_plan["total_budget"].items():
                    daily_budget = budget_plan["daily_budget"][category]
                    percentage = (total_budget / sum(budget_plan["total_budget"].values())) * 100
                    
                    st.markdown(f"""
                    <div class="info-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h5 style="margin: 0;">{category}</h5>
                            <span style="background: #4ECDC4; color: white; padding: 0.2rem 0.6rem; border-radius: 15px; font-size: 0.8em;">{percentage:.1f}%</span>
                        </div>
                        <p style="margin: 0.5rem 0 0 0;"><strong>총액:</strong> {total_budget:,}원 | <strong>일일:</strong> {daily_budget:,}원</p>
                    </div>
                    """, unsafe_allow_html=True)
            
            # 관심사별 추천 예산
            if hasattr(st.session_state, 'budget_recommendations'):
                st.markdown("##### 🎯 관심사별 추천 예산")
                
                recommendations = st.session_state.budget_recommendations
                
                for interest, rec in recommendations.items():
                    st.markdown(f"""
                    <div style="background: #f8f9fa; border-radius: 10px; padding: 1rem; margin: 0.5rem 0; border-left: 4px solid #4ecdc4;">
                        <h5>🎯 {interest} 관련 예산</h5>
                        <p><strong>설명:</strong> {rec['description']}</p>
                        <p><strong>주요 항목:</strong> {', '.join(rec['items'])}</p>
                        <p><strong>일일 예산:</strong> {rec['daily_amount']:,}원</p>
                        <p><strong>총 예산:</strong> {rec['total_amount']:,}원</p>
                    </div>
                    """, unsafe_allow_html=True)
    
    with budget_tab2:
        # 지출 기록
        st.markdown("#### 💳 실시간 지출 기록")
        
        # 지출 입력 폼
        st.markdown("##### ➕ 새 지출 기록")
        
        col1, col2 = st.columns(2)
        
        with col1:
            expense_category = st.selectbox("카테고리", [
                "숙박", "교통", "식사", "영화", "관광", "쇼핑", "기타"
            ], key="expense_category")
            
            expense_amount = st.number_input("금액 (원)", min_value=0, step=1000, key="expense_amount")
            
            expense_location = st.text_input("장소", placeholder="영화의전당", key="expense_location")
        
        with col2:
            expense_description = st.text_input("내용", placeholder="BIFF 개막작 티켓", key="expense_description")
            
            expense_date = st.date_input("날짜", value=datetime.now().date(), key="expense_date")
            
            expense_time = st.time_input("시간", value=datetime.now().time(), key="expense_time")
        
        # 지출 기록 추가 버튼
        if st.button("💳 지출 기록 추가"):
            if expense_amount > 0 and expense_description:
                expense_datetime = f"{expense_date} {expense_time}"
                new_expense = create_expense_record(
                    expense_category, expense_amount, expense_description, 
                    expense_location, expense_datetime
                )
                st.session_state.expense_records.append(new_expense)
                st.success(f"✅ {expense_amount:,}원 지출이 기록되었습니다!")
                st.rerun()
            else:
                st.warning("금액과 내용을 입력해주세요.")
        
        # 지출 기록 목록
        st.markdown("---")
        st.markdown("##### 📋 지출 기록 목록")
        
        if st.session_state.expense_records:
            # 정렬 옵션
            sort_option = st.selectbox("정렬", ["최신순", "금액 높은 순", "카테고리별"])
            
            expenses = st.session_state.expense_records.copy()
            
            if sort_option == "금액 높은 순":
                expenses.sort(key=lambda x: x['amount'], reverse=True)
            elif sort_option == "카테고리별":
                expenses.sort(key=lambda x: x['category'])
            else:  # 최신순
                expenses.sort(key=lambda x: x['created_at'], reverse=True)
            
            # 지출 기록 표시
            for expense in expenses:
                st.markdown(f"""
                <div style="background: white; border: 1px solid #ddd; border-radius: 10px; padding: 1rem; margin: 0.5rem 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h5>💳 {expense['description']}</h5>
                        <span style="background: #e74c3c; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: bold;">{expense['amount']:,}원</span>
                    </div>
                    <p><strong>📂 카테고리:</strong> {expense['category']}</p>
                    <p><strong>📍 장소:</strong> {expense['location']}</p>
                    <p><strong>📅 일시:</strong> {expense['date_time']}</p>
                </div>
                """, unsafe_allow_html=True)
                
                # 삭제 버튼
                if st.button(f"🗑️ 삭제", key=f"delete_expense_{expense['id']}"):
                    st.session_state.expense_records = [
                        e for e in st.session_state.expense_records if e['id'] != expense['id']
                    ]
                    st.rerun()
        else:
            st.info("아직 기록된 지출이 없습니다.")
    
    with budget_tab3:
        # 예산 현황
        st.markdown("#### 📈 예산 대비 지출 현황")
        
        if st.session_state.budget_plan and st.session_state.expense_records:
            budget_status = calculate_budget_status(st.session_state.budget_plan, st.session_state.expense_records)
            
            # 전체 현황 (개선된 메트릭)
            total_budgeted = sum(status['budgeted'] for status in budget_status.values())
            total_spent = sum(status['spent'] for status in budget_status.values())
            total_remaining = total_budgeted - total_spent
            overall_percentage = (total_spent / total_budgeted * 100) if total_budgeted > 0 else 0
            
            # 전체 진행률 표시
            progress_color = "progress-good" if overall_percentage < 80 else "progress-warning" if overall_percentage < 100 else "progress-danger"
            
            st.markdown(f"""
            <div class="info-card">
                <h3 style="text-align: center; margin-bottom: 1rem;">📊 전체 예산 현황</h3>
                <div class="progress-container">
                    <div class="progress-bar {progress_color}" style="width: {min(overall_percentage, 100)}%;"></div>
                </div>
                <div style="text-align: center; margin: 1rem 0;">
                    <h2 style="color: #2c3e50; margin: 0;">{overall_percentage:.1f}%</h2>
                    <p style="margin: 0; color: #7f8c8d;">예산 사용률</p>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # 메트릭 카드들
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.markdown(f"""
                <div class="metric-card">
                    <h2 style="margin: 0; font-size: 2em;">💰</h2>
                    <h3 style="margin: 0.5rem 0;">{total_budgeted:,}원</h3>
                    <p style="margin: 0; opacity: 0.8;">총 예산</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                st.markdown(f"""
                <div class="metric-card" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                    <h2 style="margin: 0; font-size: 2em;">💳</h2>
                    <h3 style="margin: 0.5rem 0;">{total_spent:,}원</h3>
                    <p style="margin: 0; opacity: 0.8;">총 지출</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col3:
                remaining_color = "#27ae60" if total_remaining >= 0 else "#e74c3c"
                st.markdown(f"""
                <div class="metric-card" style="background: linear-gradient(135deg, {remaining_color} 0%, {remaining_color} 100%);">
                    <h2 style="margin: 0; font-size: 2em;">💵</h2>
                    <h3 style="margin: 0.5rem 0;">{total_remaining:,}원</h3>
                    <p style="margin: 0; opacity: 0.8;">잔여 예산</p>
                </div>
                """, unsafe_allow_html=True)
            
            # 카테고리별 현황 (시각화 개선)
            st.markdown("##### 📋 카테고리별 예산 현황")
            
            # 예산 vs 지출 차트
            budget_chart = create_budget_status_chart(budget_status)
            if budget_chart:
                st.plotly_chart(budget_chart, use_container_width=True)
            
            # 지출 타임라인 차트
            if st.session_state.expense_records:
                timeline_chart = create_expense_timeline(st.session_state.expense_records)
                if timeline_chart:
                    st.plotly_chart(timeline_chart, use_container_width=True)
            
            # 카테고리별 상세 현황
            cols = st.columns(2)
            
            for i, (category, status) in enumerate(budget_status.items()):
                with cols[i % 2]:
                    # 상태에 따른 색상 및 클래스
                    if status['status'] == 'over':
                        color = '#e74c3c'
                        progress_class = 'progress-danger'
                        status_icon = '🚨'
                    elif status['status'] == 'warning':
                        color = '#f39c12'
                        progress_class = 'progress-warning'
                        status_icon = '⚠️'
                    else:
                        color = '#27ae60'
                        progress_class = 'progress-good'
                        status_icon = '✅'
                    
                    progress_width = min(status['percentage'], 100)
                    
                    st.markdown(f"""
                    <div class="info-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h5 style="margin: 0;">{status_icon} {category}</h5>
                            <span style="background: {color}; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: bold;">{status['percentage']:.1f}%</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar {progress_class}" style="width: {progress_width}%;"></div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-top: 1rem; font-size: 0.9em;">
                            <div style="text-align: center;">
                                <strong>예산</strong><br>
                                {status['budgeted']:,}원
                            </div>
                            <div style="text-align: center;">
                                <strong>지출</strong><br>
                                {status['spent']:,}원
                            </div>
                            <div style="text-align: center;">
                                <strong>잔여</strong><br>
                                <span style="color: {color};">{status['remaining']:,}원</span>
                            </div>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
            
            # 예산 알림
            over_budget_categories = [cat for cat, status in budget_status.items() if status['status'] == 'over']
            warning_categories = [cat for cat, status in budget_status.items() if status['status'] == 'warning']
            
            if over_budget_categories:
                st.markdown("##### 🚨 예산 초과 알림")
                for category in over_budget_categories:
                    st.error(f"⚠️ {category} 예산이 초과되었습니다!")
            
            if warning_categories:
                st.markdown("##### ⚠️ 예산 주의 알림")
                for category in warning_categories:
                    st.warning(f"💡 {category} 예산의 80% 이상을 사용했습니다.")
        
        elif st.session_state.budget_plan:
            st.info("지출 기록을 추가하면 예산 현황을 확인할 수 있습니다.")
        else:
            st.info("먼저 예산 계획을 세워주세요.")
    
    with budget_tab4:
        # 절약 팁
        st.markdown("#### 💡 BIFF 여행 절약 팁")
        
        # 청년패스 혜택
        st.markdown("##### 🎉 부산 청년패스 활용")
        
        youth_pass_benefits = [
            {"category": "교통", "discount": "20%", "description": "지하철, 버스 요금 할인"},
            {"category": "영화", "discount": "10%", "description": "일부 영화관 할인 혜택"},
            {"category": "관광", "discount": "10%", "description": "박물관, 미술관 등 문화시설"},
            {"category": "식당", "discount": "5-15%", "description": "참여 음식점 할인"},
            {"category": "쇼핑", "discount": "5-20%", "description": "참여 매장 할인"}
        ]
        
        for benefit in youth_pass_benefits:
            st.markdown(f"""
            <div style="background: #e8f5e8; border-radius: 10px; padding: 1rem; margin: 0.5rem 0; border-left: 4px solid #27ae60;">
                <strong>🎯 {benefit['category']}</strong> - {benefit['discount']} 할인<br>
                <small>{benefit['description']}</small>
            </div>
            """, unsafe_allow_html=True)
        
        # 카테고리별 절약 팁
        st.markdown("##### 💰 카테고리별 절약 팁")
        
        saving_tips = {
            "숙박": [
                "🏨 센텀시티 지역 게스트하우스 이용 (영화관 접근성 좋음)",
                "🛏️ 도미토리 룸 선택으로 비용 절약",
                "📅 평일 숙박으로 주말 대비 20-30% 절약",
                "🔍 여러 예약 사이트 가격 비교 필수"
            ],
            "교통": [
                "🎫 부산 청년패스로 대중교통 20% 할인",
                "🚇 1일 교통카드 구매 (4회 이상 이용시 유리)",
                "🚶‍♀️ 센텀시티 내 도보 이동 활용",
                "🚌 심야버스 대신 지하철 막차 이용"
            ],
            "식사": [
                "🍜 현지 맛집 (돼지국밥 8천원, 밀면 7천원)",
                "🏪 편의점 도시락 활용 (3-5천원)",
                "🍱 점심 특가 메뉴 이용",
                "☕ 카페 대신 공원에서 휴식"
            ],
            "영화": [
                "🎬 학생 할인 티켓 구매",
                "🍿 극장 매점 대신 외부 간식 준비",
                "🎫 패키지 티켓 구매로 할인",
                "📱 온라인 예매 할인 쿠폰 활용"
            ],
            "관광": [
                "🆓 무료 관광지 우선 방문 (해운대, 광안리)",
                "🎫 부산 시티투어버스 이용",
                "📸 포토존은 무료로 즐기기",
                "🏛️ 청년패스로 문화시설 할인"
            ]
        }
        
        for category, tips in saving_tips.items():
            with st.expander(f"💡 {category} 절약 팁"):
                for tip in tips:
                    st.markdown(f"- {tip}")
        
        # 예산별 추천 일정
        st.markdown("##### 📊 예산별 추천 일정")
        
        budget_schedules = {
            "저예산 (1일 5만원)": {
                "숙박": "게스트하우스 도미토리 (2.5만원)",
                "교통": "청년패스 + 도보 (8천원)",
                "식사": "현지 맛집 + 편의점 (1.2만원)",
                "영화": "학생 할인 티켓 (7천원)",
                "기타": "무료 관광지 위주 (3천원)"
            },
            "보통 (1일 8만원)": {
                "숙박": "비즈니스 호텔 (5만원)",
                "교통": "택시 병행 (1.2만원)",
                "식사": "맛집 + 카페 (2.5만원)",
                "영화": "일반 티켓 + 간식 (1만원)",
                "기타": "관광지 + 쇼핑 (8천원)"
            },
            "고예산 (1일 15만원)": {
                "숙박": "프리미엄 호텔 (8만원)",
                "교통": "택시 자유 이용 (1.5만원)",
                "식사": "고급 레스토랑 (4만원)",
                "영화": "VIP석 + 굿즈 (1.5만원)",
                "기타": "쇼핑 + 체험 (1.5만원)"
            }
        }
        
        selected_budget = st.selectbox("예산 수준 선택", list(budget_schedules.keys()))
        
        schedule = budget_schedules[selected_budget]
        
        st.markdown(f"**{selected_budget} 추천 구성:**")
        for category, recommendation in schedule.items():
            st.markdown(f"- **{category}**: {recommendation}")

with tab9:
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

with tab10:
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
    
    # 진행률 표시 (개선된 시각화)
    total_items = sum(len(items) for items in checklist_categories.values())
    checked_items = sum(sum(category.values()) for category in st.session_state.checklist.values())
    progress = checked_items / total_items if total_items > 0 else 0
    
    # 전체 진행률 카드
    progress_color = "progress-good" if progress > 0.8 else "progress-warning" if progress > 0.5 else "progress-danger"
    
    st.markdown(f"""
    <div class="info-card">
        <h3 style="text-align: center; margin-bottom: 1rem;">🧳 짐 준비 진행률</h3>
        <div class="progress-container">
            <div class="progress-bar {progress_color}" style="width: {progress * 100}%;"></div>
        </div>
        <div style="text-align: center; margin: 1rem 0;">
            <h2 style="color: #2c3e50; margin: 0;">{progress:.1%}</h2>
            <p style="margin: 0; color: #7f8c8d;">{checked_items}/{total_items} 항목 완료</p>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # 카테고리별 진행률
    st.markdown("##### 📊 카테고리별 진행률")
    
    cols = st.columns(len(checklist_categories))
    
    for i, (category, items) in enumerate(checklist_categories.items()):
        with cols[i]:
            category_total = len(items)
            category_checked = sum(st.session_state.checklist[category].values())
            category_progress = category_checked / category_total if category_total > 0 else 0
            
            progress_color = "#27ae60" if category_progress == 1 else "#f39c12" if category_progress > 0.5 else "#e74c3c"
            
            st.markdown(f"""
            <div style="background: white; border: 1px solid #ddd; border-radius: 10px; padding: 1rem; text-align: center; margin: 0.2rem;">
                <h5 style="margin: 0 0 0.5rem 0;">{category}</h5>
                <div style="background: #f0f0f0; border-radius: 10px; height: 10px; margin: 0.5rem 0;">
                    <div style="background: {progress_color}; width: {category_progress * 100}%; height: 100%; border-radius: 10px;"></div>
                </div>
                <p style="margin: 0; font-size: 0.9em;">{category_checked}/{category_total}</p>
                <small style="color: #7f8c8d;">{category_progress:.1%}</small>
            </div>
            """, unsafe_allow_html=True)
    
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

with tab11:
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