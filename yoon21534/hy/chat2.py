import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
import html
import re

# 지도 라이브러리 조건부 import
try:
    import folium
    from streamlit_folium import st_folium
    MAP_AVAILABLE = True
except ImportError:
    MAP_AVAILABLE = False
    st.warning("⚠️ 지도 기능을 사용하려면 다음 명령어로 라이브러리를 설치해주세요: `pip install folium streamlit-folium`")

# 환경변수 로드
load_dotenv()

# 페이지 설정
st.set_page_config(
    page_title="BIFF 30회 여행 챗봇",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS 스타일
st.markdown("""
<style>
    /* 전체 앱 스타일 */
    .stApp {
        background: #f8f9fa;
    }
    
    /* 메인 컨테이너 */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 1200px;
    }
    
    /* 깔끔한 헤더 */
    .clean-header {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        border-left: 5px solid #dc143c;
    }
    
    .header-title {
        color: #2c3e50;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        margin-bottom: 0.5rem;
    }
    
    .header-subtitle {
        color: #dc143c;
        font-size: 1.3rem;
        font-weight: 600;
        margin: 0;
        margin-bottom: 0.5rem;
    }
    
    .header-description {
        color: #6c757d;
        font-size: 1rem;
        margin: 0;
    }
    
    /* 채팅 메시지 스타일 */
    .user-message {
        background: #dc143c;
        color: white;
        padding: 1rem;
        border-radius: 20px 20px 5px 20px;
        margin: 1rem 0;
        margin-left: 20%;
        box-shadow: 0 3px 10px rgba(220, 20, 60, 0.3);
        animation: slideInRight 0.3s ease-out;
    }
    
    .bot-message {
        background: white;
        color: #333;
        padding: 1rem;
        border-radius: 20px 20px 20px 5px;
        margin: 1rem 0;
        margin-right: 20%;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        border-left: 4px solid #dc143c;
        animation: slideInLeft 0.3s ease-out;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    /* 체크리스트 스타일 */
    .category-header {
        background: #dc143c;
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0 0.5rem 0;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 2px 8px rgba(220, 20, 60, 0.2);
    }
    
    .checklist-item {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1rem;
        margin: 0.5rem 0;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .checklist-item:hover {
        border-color: #dc143c;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    
    /* 탭 스타일 */
    .stTabs [data-baseweb="tab-list"] {
        gap: 1rem;
        background: white;
        padding: 0.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        padding: 0px 24px;
        background: #f8f9fa;
        border-radius: 8px;
        color: #6c757d;
        font-weight: 600;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .stTabs [aria-selected="true"] {
        background: #dc143c;
        color: white;
        border-color: #dc143c;
        box-shadow: 0 2px 8px rgba(220, 20, 60, 0.3);
    }
    
    /* 상품 카드 스타일 */
    .product-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        border-color: #dc143c;
    }
    
    /* 사이드바 스타일 */
    .css-1d391kg {
        background: #2c3e50;
    }
    
    /* 진행률 바 */
    .stProgress > div > div > div > div {
        background: #dc143c;
    }
    
    /* 메트릭 스타일 */
    [data-testid="metric-container"] {
        background: white;
        border: 1px solid #e9ecef;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* 입력 필드 스타일 */
    .stTextInput > div > div > input {
        border-radius: 8px;
        border: 2px solid #e9ecef;
        padding: 0.8rem;
        font-size: 1rem;
    }
    
    .stTextInput > div > div > input:focus {
        border-color: #dc143c;
        box-shadow: 0 0 0 0.2rem rgba(220, 20, 60, 0.25);
    }
    
    /* 버튼 스타일 */
    .stButton > button {
        background: #dc143c;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.8rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(220, 20, 60, 0.2);
    }
    
    .stButton > button:hover {
        background: #b71c1c;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(220, 20, 60, 0.3);
    }
</style>
""", unsafe_allow_html=True)

# BIFF 30회 기본 정보
BIFF_INFO = {
    "dates": "2025년 9월 17일(수) ~ 9월 26일(금)",
    "duration": "10일간",
    "venues": ["영화의전당", "롯데시네마 센텀시티", "CGV 센텀시티", "부산시네마센터"],
    "ticket_prices": {
        "일반": "7,000원",
        "학생/경로": "5,000원", 
        "갈라/특별상영": "15,000원"
    },
    "attractions": [
        "🎬 영화의전당 - BIFF 메인 상영관",
        "🌟 BIFF 광장 - 핸드프린팅 광장",
        "🏖️ 해운대 해수욕장 - 부산 대표 해변",
        "🎨 감천문화마을 - 컬러풀한 포토존",
        "🌉 광안대교 - 부산 야경 명소",
        "🐟 자갈치시장 - 부산 대표 수산시장"
    ],
    "youth_benefits": {
        "name": "부산 청년패스",
        "age_limit": "만 18~34세",
        "benefits": [
            "🎬 영화관람료 할인 (CGV, 롯데시네마 등)",
            "🚇 대중교통 할인 (지하철, 버스)",
            "🍽️ 음식점 할인 (참여 업체)",
            "🏛️ 문화시설 할인 (박물관, 미술관 등)",
            "🛍️ 쇼핑 할인 (참여 매장)",
            "☕ 카페 할인 (참여 카페)"
        ],
        "how_to_apply": "부산시 홈페이지 또는 모바일 앱에서 신청",
        "info_url": "https://www.busan.go.kr/mayor/news/1691217"
    },
    "booking_info": {
        "official_site": {
            "name": "BIFF 공식 예매 사이트",
            "url": "https://www.biff.kr/kor/",
            "guide_blog": "https://m.blog.naver.com/i2krs/223587871314"
        },
        "booking_notice": [
            "⚠️ BIFF 영화는 일반 영화관(CGV, 롯데시네마 등)에서 예매 불가",
            "✅ BIFF 공식 사이트에서만 예매 가능",
            "📋 자세한 예매 방법은 공식 가이드 블로그 참조",
            "🎫 인기작은 예매 오픈과 동시에 매진되니 주의"
        ],
        "booking_tips": [
            "🎬 BIFF 전용 예매 시스템 사용",
            "⏰ 예매 오픈 시간 정확히 확인",
            "📱 사전에 회원가입 및 결제수단 준비",
            "🔄 서버 과부하 시 새로고침 반복",
            "💡 여러 상영 시간 옵션 미리 체크"
        ],
        "important_dates": [
            "예매 오픈: BIFF 공식 발표 확인 필요",
            "사전 안내: 예매 1-2주 전 공지",
            "현장 예매: 각 상영관에서 제한적 가능"
        ]
    },
    "restaurants": {
        "해운대": [
            {"name": "해운대 암소갈비집", "type": "한식", "specialty": "갈비", "location": "해운대구", "lat": 35.1588, "lng": 129.1603},
            {"name": "밀면 본가", "type": "한식", "specialty": "밀면", "location": "해운대구", "lat": 35.1595, "lng": 129.1610},
            {"name": "해운대 횟집", "type": "회", "specialty": "회", "location": "해운대구", "lat": 35.1580, "lng": 129.1595}
        ],
        "광안리": [
            {"name": "광안리 조개구이", "type": "해산물", "specialty": "조개구이", "location": "수영구", "lat": 35.1532, "lng": 129.1186},
            {"name": "광안리 카페거리", "type": "카페", "specialty": "커피", "location": "수영구", "lat": 35.1525, "lng": 129.1180},
            {"name": "민락수변공원 맛집", "type": "한식", "specialty": "해물탕", "location": "수영구", "lat": 35.1540, "lng": 129.1195}
        ],
        "자갈치": [
            {"name": "자갈치 회센터", "type": "회", "specialty": "활어회", "location": "중구", "lat": 35.0966, "lng": 129.0306},
            {"name": "부산 어묵", "type": "분식", "specialty": "어묵", "location": "중구", "lat": 35.0970, "lng": 129.0310},
            {"name": "국제시장 먹거리", "type": "분식", "specialty": "떡볶이", "location": "중구", "lat": 35.0980, "lng": 129.0320}
        ],
        "서면": [
            {"name": "서면 돼지국밥", "type": "한식", "specialty": "돼지국밥", "location": "부산진구", "lat": 35.1579, "lng": 129.0588},
            {"name": "서면 곱창골목", "type": "한식", "specialty": "곱창", "location": "부산진구", "lat": 35.1585, "lng": 129.0595},
            {"name": "서면 치킨거리", "type": "치킨", "specialty": "치킨", "location": "부산진구", "lat": 35.1575, "lng": 129.0580}
        ]
    }
}

# 부산 주요 관광지 위치 데이터
BUSAN_LOCATIONS = {
    "영화의전당": {"lat": 35.1729, "lng": 129.1306, "category": "🎬 BIFF 관련"},
    "BIFF 광장": {"lat": 35.0695, "lng": 129.0422, "category": "🎬 BIFF 관련"},
    "해운대 해수욕장": {"lat": 35.1588, "lng": 129.1603, "category": "🎯 관광지"},
    "광안리 해변": {"lat": 35.1532, "lng": 129.1186, "category": "🎯 관광지"},
    "감천문화마을": {"lat": 35.0976, "lng": 129.0114, "category": "🎯 관광지"},
    "자갈치시장": {"lat": 35.0966, "lng": 129.0306, "category": "🍽️ 맛집"},
    "광안대교": {"lat": 35.1490, "lng": 129.1186, "category": "🎯 관광지"},
    "태종대": {"lat": 35.0513, "lng": 129.0865, "category": "🎯 관광지"},
    "서면": {"lat": 35.1579, "lng": 129.0588, "category": "🍽️ 맛집"},
    "롯데시네마 센텀시티": {"lat": 35.1693, "lng": 129.1306, "category": "🎬 BIFF 관련"},
    "CGV 센텀시티": {"lat": 35.1685, "lng": 129.1295, "category": "🎬 BIFF 관련"},
    "부산시네마센터": {"lat": 35.1729, "lng": 129.1306, "category": "🎬 BIFF 관련"}
}

# 여행 일정 관리
TRAVEL_SCHEDULE = {
    "🎬 BIFF 관련": [
        {"name": "영화 티켓 예매", "type": "reservation", "status": False, "note": ""},
        {"name": "갈라 상영 티켓", "type": "reservation", "status": False, "note": ""},
        {"name": "BIFF 광장 방문", "type": "visit", "status": False, "note": ""},
        {"name": "영화의전당 투어", "type": "visit", "status": False, "note": ""}
    ],
    "🏨 숙박": [
        {"name": "호텔/펜션 예약", "type": "reservation", "status": False, "note": ""},
        {"name": "체크인 확인", "type": "confirmation", "status": False, "note": ""},
        {"name": "체크아웃 시간 확인", "type": "confirmation", "status": False, "note": ""}
    ],
    "🍽️ 맛집": [
        {"name": "자갈치시장 회센터", "type": "reservation", "status": False, "note": ""},
        {"name": "광안리 맛집 예약", "type": "reservation", "status": False, "note": ""},
        {"name": "해운대 카페 방문", "type": "visit", "status": False, "note": ""},
        {"name": "부산 전통시장 투어", "type": "visit", "status": False, "note": ""}
    ],
    "🚗 교통": [
        {"name": "항공편/KTX 예약", "type": "reservation", "status": False, "note": ""},
        {"name": "렌터카 예약", "type": "reservation", "status": False, "note": ""},
        {"name": "부산 지하철 앱 설치", "type": "preparation", "status": False, "note": ""},
        {"name": "교통카드 충전", "type": "preparation", "status": False, "note": ""}
    ],
    "🎯 관광지": [
        {"name": "감천문화마을 방문", "type": "visit", "status": False, "note": ""},
        {"name": "해운대 해수욕장", "type": "visit", "status": False, "note": ""},
        {"name": "광안대교 야경 감상", "type": "visit", "status": False, "note": ""},
        {"name": "태종대 관광", "type": "visit", "status": False, "note": ""}
    ]
}

# 캐리어 체크리스트
TRAVEL_CHECKLIST = {
    " 필수 ": [
        "캐리어",
        "지갑",
        "기차 확인",
        "숙소 예약 확인서",
        "휴대폰 충전기",
        "보조배터리",
        "이어폰"
    ],
    "👕 의류": [
        "속옷 (여행일수+1벌)",
        "양말 (여행일수+1켤레)",
        "편한 운동화",
        "슬리퍼",
        "가벼운 외투/카디건",
        "긴팔 티셔츠",
        "반팔 티셔츠",
        "청바지",
        "잠옷"
    ],
    "🧴 세면용품": [
        "칫솔/치약",
        "샴푸/린스",
        "바디워시",
        "세안용품",
        "수건",
        "화장품/스킨케어",
        "선크림",
        "립밤"
    ],
    "🎬 BIFF ": [
        "영화 티켓 예매 확인",
        "상영 시간표 저장",
        "카메라/스마트폰",
        "간식/물",
        "우양산",
        "마스크"
    ],
    
    "💊 약": [
        "감기약",
        "소화제",
        "진통제",
        "밴드",
        "멀미약",
        "비타민"
    ]
}

# 여행용품 데이터
TRAVEL_PRODUCTS = {
    "캐리어": [
        {"name": "20인치 기내용 캐리어", "desc": "BIFF 단기 여행용", "price": "10-15만원", "keyword": "20인치 캐리어"},
        {"name": "24인치 중형 캐리어", "desc": "3-4일 여행 최적", "price": "15-20만원", "keyword": "24인치 캐리어"},
        {"name": "28인치 대형 캐리어", "desc": "장기 여행용", "price": "20-30만원", "keyword": "28인치 캐리어"}
    ],
    "카메라": [
        {"name": "미러리스 카메라", "desc": "BIFF 인증샷 필수", "price": "80-150만원", "keyword": "미러리스 카메라"},
        {"name": "인스탁스 즉석카메라", "desc": "추억 남기기", "price": "8-12만원", "keyword": "인스탁스 카메라"},
        {"name": "액션캠", "desc": "여행 브이로그용", "price": "30-50만원", "keyword": "액션캠 고프로"}
    ],
    "여행용품": [
        {"name": "보조배터리 20000mAh", "desc": "하루종일 외출용", "price": "3-5만원", "keyword": "여행용 보조배터리"},
        {"name": "여행용 목베개", "desc": "장거리 이동시", "price": "1-3만원", "keyword": "여행 목베개"},
        {"name": "여행용 세면도구 세트", "desc": "휴대용 완벽 세트", "price": "2-4만원", "keyword": "여행용 세면도구"},
        {"name": "멀티 어댑터", "desc": "전세계 사용 가능", "price": "2-4만원", "keyword": "여행용 멀티어댑터"}
    ]
}

@st.cache_resource
def setup_gemini():
    """Gemini API 설정"""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            st.error("GEMINI_API_KEY가 환경변수에 설정되지 않았습니다.")
            return None
        
        genai.configure(api_key=api_key)
        
        # 모델 설정 개선
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 1000,
        }
        
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]
        
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        return model
    except Exception as e:
        st.error(f"Gemini API 설정 오류: {e}")
        return None

def generate_coupang_link(product_keyword):
    """쿠팡 검색 링크 생성"""
    from urllib.parse import quote
    encoded_keyword = quote(product_keyword, safe='')
    return f"https://www.coupang.com/np/search?q={encoded_keyword}"

def safe_html_content(content):
    """HTML 내용을 안전하게 처리"""
    # HTML 태그가 텍스트로 표시되는 것을 방지
    import re
    
    # 단독으로 나타나는 HTML 태그들을 제거
    content = re.sub(r'^\s*</div>\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*<div[^>]*>\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*</p>\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*<p[^>]*>\s*$', '', content, flags=re.MULTILINE)
    
    # 빈 줄 정리
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    content = content.strip()
    
    return content

def create_product_card(product_name, description, price, keyword):
    """상품 카드 생성"""
    coupang_link = generate_coupang_link(keyword)
    return f"""
    <div style="border: 1px solid #ddd; border-radius: 10px; padding: 1rem; margin: 0.5rem 0; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h4>🛍️ {product_name}</h4>
        <p style="color: #666;">{description}</p>
        <p style="color: #ff6b6b; font-weight: bold; font-size: 1.1em;">💰 {price}</p>
        <a href="{coupang_link}" target="_blank" style="background: #ff6b6b; color: white; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none; display: inline-block;">
            🛒 쿠팡에서 보기
        </a>
        <p style="font-size: 0.8em; color: #999; margin-top: 0.5rem;">
            * 파트너스 활동으로 일정 수수료를 받을 수 있습니다
        </p>
    </div>
    """

def add_to_schedule(activity, category="🎯 관광지", activity_type="visit", note="AI 추천"):
    """AI 추천 활동을 일정에 추가"""
    if category not in st.session_state.schedule:
        st.session_state.schedule[category] = []
    
    # 중복 체크
    existing_activities = [item["name"] for item in st.session_state.schedule[category]]
    if activity not in existing_activities:
        st.session_state.schedule[category].append({
            "name": activity,
            "type": activity_type,
            "status": False,
            "note": note
        })
        return True
    return False

def create_add_button(activity, category="🎯 관광지", activity_type="visit"):
    """일정 추가 버튼 생성"""
    button_key = f"add_{activity}_{category}"
    if st.button(f"📅 '{activity}' 일정에 추가", key=button_key):
        if add_to_schedule(activity, category, activity_type, "AI 추천"):
            st.success(f"✅ '{activity}'이(가) {category}에 추가되었습니다!")
            st.rerun()
        else:
            st.warning(f"⚠️ '{activity}'은(는) 이미 일정에 있습니다.")

def show_chatbot_features():
    """챗봇 기능과 데이터베이스 상태 표시"""
    st.markdown("## 🤖 BIFF 30회 여행 가이드 챗봇 기능 소개")
    
    # 데이터베이스 상태 확인
    st.markdown("### 📊 데이터베이스 연결 상태")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        biff_data_count = len(BIFF_INFO)
        st.metric("🎬 BIFF 정보", f"{biff_data_count}개 항목")
        st.success("✅ 연결됨")
    
    with col2:
        schedule_categories = len(TRAVEL_SCHEDULE)
        total_schedule_items = sum(len(items) for items in TRAVEL_SCHEDULE.values())
        st.metric("📅 일정 템플릿", f"{schedule_categories}개 카테고리")
        st.success(f"✅ {total_schedule_items}개 항목")
    
    with col3:
        checklist_categories = len(TRAVEL_CHECKLIST)
        total_checklist_items = sum(len(items) for items in TRAVEL_CHECKLIST.values())
        st.metric("🧳 체크리스트", f"{checklist_categories}개 카테고리")
        st.success(f"✅ {total_checklist_items}개 항목")
    
    with col4:
        product_categories = len(TRAVEL_PRODUCTS)
        total_products = sum(len(products) for products in TRAVEL_PRODUCTS.values())
        st.metric("🛍️ 상품 데이터", f"{product_categories}개 카테고리")
        st.success(f"✅ {total_products}개 상품")
    
    # 주요 기능 소개
    st.markdown("### 🌟 주요 기능")
    
    features = [
        {
            "icon": "🤖",
            "title": "AI 여행 가이드",
            "description": "Gemini AI가 BIFF와 부산 여행에 대한 모든 질문에 답변합니다.",
            "benefits": ["실시간 맞춤 답변", "BIFF 전문 정보", "부산 여행 팁"]
        },
        {
            "icon": "📅",
            "title": "스마트 일정 관리",
            "description": "날짜별/카테고리별 일정 관리와 AI 추천 일정 자동 추가 기능",
            "benefits": ["날짜별 시간대 관리", "AI 추천 자동 추가", "일정 저장/불러오기"]
        },
        {
            "icon": "🧳",
            "title": "여행 준비 체크리스트",
            "description": "BIFF 여행에 특화된 준비물 체크리스트와 진행률 추적",
            "benefits": ["카테고리별 정리", "진행률 시각화", "개인화 가능"]
        },
        {
            "icon": "🛍️",
            "title": "여행용품 쇼핑",
            "description": "AI가 추천하는 여행용품을 쿠팡에서 바로 검색 가능",
            "benefits": ["맞춤 상품 추천", "직접 쇼핑 연결", "가격 정보 제공"]
        }
    ]
    
    for feature in features:
        with st.expander(f"{feature['icon']} {feature['title']}", expanded=False):
            st.markdown(f"**설명:** {feature['description']}")
            st.markdown("**주요 장점:**")
            for benefit in feature['benefits']:
                st.markdown(f"• ✨ {benefit}")
    
    # 데이터 세부 정보
    st.markdown("### 📋 데이터 세부 정보")
    
    data_details = [
        ("🎬 BIFF 정보", [
            f"영화제 일정: {BIFF_INFO['dates']}",
            f"상영관: {len(BIFF_INFO['venues'])}개",
            f"티켓 가격: {len(BIFF_INFO['ticket_prices'])}종류",
            f"관광 명소: {len(BIFF_INFO['attractions'])}곳",
            f"예매 정보: 공식 사이트 1개 + 가이드 블로그"
        ]),
        ("📅 일정 관리", [
            f"카테고리: {', '.join(TRAVEL_SCHEDULE.keys())}",
            f"기본 일정 항목: {sum(len(items) for items in TRAVEL_SCHEDULE.values())}개",
            "날짜별/시간대별 관리 지원",
            "JSON 파일 저장/불러오기 지원"
        ]),
        ("🧳 체크리스트", [
            f"카테고리: {len(TRAVEL_CHECKLIST)}개",
            f"총 체크 항목: {sum(len(items) for items in TRAVEL_CHECKLIST.values())}개",
            "BIFF 특화 준비물 포함",
            "진행률 실시간 추적"
        ])
    ]
    
    for title, details in data_details:
        with st.expander(f"{title} 상세 정보"):
            for detail in details:
                st.markdown(f"• {detail}")

def extract_restaurants_from_text(text):
    """텍스트에서 맛집 정보 추출"""
    restaurants = []
    text_lower = text.lower()
    
    # BIFF_INFO의 맛집 데이터에서 검색
    for area, restaurant_list in BIFF_INFO['restaurants'].items():
        if area in text_lower:
            for restaurant in restaurant_list:
                if any(keyword in text_lower for keyword in [restaurant['name'].lower(), restaurant['specialty'].lower(), restaurant['type'].lower()]):
                    restaurants.append({
                        "name": restaurant['name'],
                        "area": area,
                        "type": restaurant['type'],
                        "specialty": restaurant['specialty'],
                        "location": restaurant['location']
                    })
    
    # 일반적인 맛집 키워드 검색
    food_keywords = {
        "돼지국밥": {"name": "돼지국밥 맛집", "type": "한식", "area": "서면"},
        "밀면": {"name": "밀면 맛집", "type": "한식", "area": "해운대"},
        "회": {"name": "회센터", "type": "회", "area": "자갈치"},
        "조개구이": {"name": "조개구이 맛집", "type": "해산물", "area": "광안리"},
        "어묵": {"name": "어묵 맛집", "type": "분식", "area": "자갈치"},
        "갈비": {"name": "갈비집", "type": "한식", "area": "해운대"},
        "곱창": {"name": "곱창집", "type": "한식", "area": "서면"},
        "치킨": {"name": "치킨집", "type": "치킨", "area": "서면"}
    }
    
    for keyword, info in food_keywords.items():
        if keyword in text_lower:
            restaurants.append({
                "name": info['name'],
                "area": info['area'],
                "type": info['type'],
                "specialty": keyword,
                "location": info['area']
            })
    
    return restaurants

def create_busan_map(locations_to_show=None, center_lat=35.1379, center_lng=129.0756):
    """부산 지도 생성"""
    if not MAP_AVAILABLE:
        return None
        
    # 부산 중심으로 지도 생성
    m = folium.Map(
        location=[center_lat, center_lng],
        zoom_start=11,
        tiles='OpenStreetMap'
    )
    
    # 카테고리별 색상 정의
    category_colors = {
        "� BIFF  관련": "red",
        "🍽️ 맛집": "orange", 
        "🎯 관광지": "blue",
        "🏨 숙박": "green",
        "🚗 교통": "purple"
    }
    
    # 표시할 위치가 지정되지 않으면 모든 주요 관광지 표시
    if locations_to_show is None:
        locations_to_show = BUSAN_LOCATIONS
    
    # 마커 추가
    for name, info in locations_to_show.items():
        color = category_colors.get(info.get('category', '🎯 관광지'), 'blue')
        
        folium.Marker(
            location=[info['lat'], info['lng']],
            popup=folium.Popup(f"<b>{name}</b><br>{info.get('category', '')}", max_width=200),
            tooltip=name,
            icon=folium.Icon(color=color, icon='info-sign')
        ).add_to(m)
    
    return m

def create_schedule_map():
    """일정에 추가된 장소들의 지도 생성"""
    if not MAP_AVAILABLE:
        return None
        
    schedule_locations = {}
    
    # 일정에서 위치 정보가 있는 항목들 찾기
    for category, items in st.session_state.schedule.items():
        for item in items:
            item_name = item['name']
            
            # BUSAN_LOCATIONS에서 찾기
            for location_name, location_info in BUSAN_LOCATIONS.items():
                if location_name in item_name or item_name in location_name:
                    schedule_locations[item_name] = {
                        "lat": location_info['lat'],
                        "lng": location_info['lng'],
                        "category": category,
                        "status": "완료" if item['status'] else "예정"
                    }
                    break
            
            # 맛집 데이터에서 찾기
            for area, restaurants in BIFF_INFO['restaurants'].items():
                for restaurant in restaurants:
                    if restaurant['name'] in item_name or item_name in restaurant['name']:
                        schedule_locations[item_name] = {
                            "lat": restaurant['lat'],
                            "lng": restaurant['lng'],
                            "category": category,
                            "status": "완료" if item['status'] else "예정"
                        }
                        break
    
    if not schedule_locations:
        return None
    
    # 지도 생성
    m = folium.Map(
        location=[35.1379, 129.0756],
        zoom_start=11,
        tiles='OpenStreetMap'
    )
    
    # 카테고리별 색상
    category_colors = {
        "🎬 BIFF 관련": "red",
        "🍽️ 맛집": "orange", 
        "🎯 관광지": "blue",
        "🏨 숙박": "green",
        "🚗 교통": "purple"
    }
    
    # 마커 추가
    for name, info in schedule_locations.items():
        color = category_colors.get(info['category'], 'blue')
        icon_type = 'ok-sign' if info['status'] == '완료' else 'time'
        
        folium.Marker(
            location=[info['lat'], info['lng']],
            popup=folium.Popup(f"<b>{name}</b><br>{info['category']}<br>상태: {info['status']}", max_width=200),
            tooltip=f"{name} ({info['status']})",
            icon=folium.Icon(color=color, icon=icon_type)
        ).add_to(m)
    
    return m

def create_restaurant_add_button(restaurant, button_key_suffix=""):
    """맛집 전용 일정 추가 버튼"""
    button_key = f"add_restaurant_{restaurant['name']}_{button_key_suffix}"
    
    # 맛집 정보 표시
    st.markdown(f"""
    <div style="background: white; padding: 1rem; border-radius: 10px; border-left: 4px solid #dc143c; margin: 0.5rem 0;">
        <h4 style="margin: 0; color: #dc143c;">🍽️ {restaurant['name']}</h4>
        <p style="margin: 0.5rem 0; color: #666;">
            📍 {restaurant['location']} | 🍴 {restaurant['type']} | ⭐ {restaurant['specialty']}
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 1, 1])
    
    with col1:
        if st.button(f"📅 일정에 추가", key=f"{button_key}_schedule"):
            note = f"{restaurant['type']} - {restaurant['specialty']} ({restaurant['location']})"
            if add_to_schedule(restaurant['name'], "🍽️ 맛집", "visit", note):
                st.success(f"✅ '{restaurant['name']}'이(가) 맛집 일정에 추가되었습니다!")
                st.rerun()
            else:
                st.warning(f"⚠️ '{restaurant['name']}'은(는) 이미 일정에 있습니다.")
    
    with col2:
        if st.button(f"🗺️ 지도에서 보기", key=f"{button_key}_show_map"):
            if MAP_AVAILABLE:
                # 해당 맛집만 표시하는 지도 생성
                restaurant_location = {
                    restaurant['name']: {
                        "lat": restaurant.get('lat', 35.1379),
                        "lng": restaurant.get('lng', 129.0756),
                        "category": "🍽️ 맛집"
                    }
                }
                map_obj = create_busan_map(restaurant_location, restaurant.get('lat', 35.1379), restaurant.get('lng', 129.0756))
                if map_obj:
                    st_folium(map_obj, width=700, height=400)
            else:
                st.error("지도 기능을 사용하려면 folium 라이브러리를 설치해주세요.")
    
    with col3:
        if st.button(f"🔍 네이버 지도", key=f"{button_key}_naver"):
            map_url = f"https://map.naver.com/v5/search/{restaurant['name']} {restaurant['location']}"
            st.markdown(f"[🗺️ 네이버 지도에서 '{restaurant['name']}' 보기]({map_url})")

def suggest_schedule_items(user_question, ai_response):
    """AI 답변을 기반으로 일정 추가 제안"""
    # 챗봇 기능 설명 요청시 특별 처리
    if "챗봇 기능" in user_question or "기능 설명" in user_question:
        show_chatbot_features()
        return
    
    # 맛집 관련 질문 처리
    if any(keyword in user_question.lower() for keyword in ['맛집', '음식', '먹을', '식당', '회', '돼지국밥', '밀면']):
        restaurants = extract_restaurants_from_text(user_question + " " + ai_response)
        
        if restaurants:
            st.markdown("### 🍽️ 추천 맛집을 일정에 추가해보세요!")
            
            # 중복 제거
            unique_restaurants = []
            seen_names = set()
            for restaurant in restaurants:
                if restaurant['name'] not in seen_names:
                    unique_restaurants.append(restaurant)
                    seen_names.add(restaurant['name'])
            
            # 최대 3개까지 표시
            for i, restaurant in enumerate(unique_restaurants[:3]):
                create_restaurant_add_button(restaurant, str(i))
            
            return
    
    # 기존 일반 일정 제안
    suggestions = []
    
    # 키워드 기반 일정 제안
    location_keywords = {
        "해운대": ("해운대 해수욕장 방문", "🎯 관광지", "visit"),
        "광안리": ("광안리 해변 방문", "🎯 관광지", "visit"),
        "감천문화마을": ("감천문화마을 투어", "🎯 관광지", "visit"),
        "자갈치시장": ("자갈치시장 투어", "🎯 관광지", "visit"),
        "영화의전당": ("영화의전당 방문", "🎬 BIFF 관련", "visit"),
        "BIFF광장": ("BIFF 광장 방문", "🎬 BIFF 관련", "visit"),
        "광안대교": ("광안대교 야경 감상", "🎯 관광지", "visit"),
        "태종대": ("태종대 관광", "🎯 관광지", "visit"),
        "예매": ("영화 티켓 예매", "🎬 BIFF 관련", "reservation"),
        "숙소": ("숙소 예약", "🏨 숙박", "reservation"),
        "호텔": ("호텔 예약", "🏨 숙박", "reservation")
    }
    
    # 사용자 질문과 AI 답변에서 키워드 찾기
    combined_text = (user_question + " " + ai_response).lower()
    
    for keyword, (activity, category, activity_type) in location_keywords.items():
        if keyword in combined_text:
            suggestions.append((activity, category, activity_type))
    
    # 중복 제거
    suggestions = list(set(suggestions))
    
    if suggestions:
        st.markdown("### 🎯 추천 일정을 바로 추가해보세요!")
        cols = st.columns(min(len(suggestions), 3))
        
        for i, (activity, category, activity_type) in enumerate(suggestions[:3]):
            with cols[i % 3]:
                create_add_button(activity, category, activity_type)
        
        # 추천 장소들의 지도 미리보기
        if MAP_AVAILABLE and st.button("🗺️ 추천 장소 지도에서 보기"):
            preview_locations = {}
            for activity, category, activity_type in suggestions[:3]:
                # BUSAN_LOCATIONS에서 찾기
                for location_name, location_info in BUSAN_LOCATIONS.items():
                    if location_name in activity or activity in location_name:
                        preview_locations[activity] = {
                            "lat": location_info['lat'],
                            "lng": location_info['lng'],
                            "category": category
                        }
                        break
            
            if preview_locations:
                st.markdown("#### 🗺️ 추천 장소 위치")
                preview_map = create_busan_map(preview_locations)
                if preview_map:
                    st_folium(preview_map, width=700, height=400)

def create_biff_prompt(user_question):
    """BIFF 특화 프롬프트 생성"""
    return f"""
당신은 부산국제영화제(BIFF) 30회 전문 여행 가이드 챗봇입니다.

BIFF 30회 정보:
- 일정: {BIFF_INFO['dates']}
- 기간: {BIFF_INFO['duration']}
- 주요 상영관: {', '.join(BIFF_INFO['venues'])}
- 티켓 가격: 일반 {BIFF_INFO['ticket_prices']['일반']}, 학생/경로 {BIFF_INFO['ticket_prices']['학생/경로']}, 갈라/특별상영 {BIFF_INFO['ticket_prices']['갈라/특별상영']}

부산 청년패스 혜택:
- 대상: {BIFF_INFO['youth_benefits']['age_limit']}
- 혜택: {', '.join(BIFF_INFO['youth_benefits']['benefits'])}
- 신청방법: {BIFF_INFO['youth_benefits']['how_to_apply']}

부산 주요 명소:
{chr(10).join(BIFF_INFO['attractions'])}

부산 맛집 정보:
- 해운대: 암소갈비집, 밀면 본가, 해운대 횟집
- 광안리: 조개구이, 카페거리, 해물탕
- 자갈치: 회센터, 부산 어묵, 국제시장 먹거리
- 서면: 돼지국밥, 곱창골목, 치킨거리

영화 예매 정보:
- 공식 예매: {BIFF_INFO['booking_info']['official_site']['name']} ({BIFF_INFO['booking_info']['official_site']['url']})
- 예매 가이드: {BIFF_INFO['booking_info']['official_site']['guide_blog']}
- 중요 공지: {', '.join(BIFF_INFO['booking_info']['booking_notice'])}
- 예매 팁: {', '.join(BIFF_INFO['booking_info']['booking_tips'])}
- 주요 일정: {', '.join(BIFF_INFO['booking_info']['important_dates'])}

답변 규칙:
1. 반드시 한국어로 답변하세요
2. 친근하고 도움이 되는 톤으로 작성하세요
3. 구체적이고 실용적인 정보를 제공하세요
4. 적절한 이모지를 사용하여 가독성을 높이세요
5. BIFF 관련 질문에는 위의 정보를 활용하세요
6. 부산 여행 관련 질문에는 명소와 청년패스 혜택을 안내하세요
7. 예매 관련 질문에는 예매 사이트와 팁을 제공하세요
8. 답변은 200-300자 내외로 간결하게 작성하세요
9. HTML 태그나 마크다운 문법을 사용하지 마세요 (일반 텍스트만 사용)
10. </div>, <div> 같은 HTML 태그를 절대 포함하지 마세요

사용자 질문: {user_question}

답변:
"""

# 세션 상태 초기화
if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant", 
            "content": "안녕하세요! 🎬 부산국제영화제 30회 여행 가이드입니다.\n\n**📅 2025.9.17(수) ~ 9.26(금)**\n\nBIFF 일정, 부산 여행, 맛집, 숙소, 여행용품 등 무엇이든 물어보세요! 😊\n\n💡 **청년 여러분!** 만 18~34세라면 부산 청년패스로 할인 혜택을 받으세요!"
        }
    ]

if "checklist" not in st.session_state:
    st.session_state.checklist = {}
    for category, items in TRAVEL_CHECKLIST.items():
        st.session_state.checklist[category] = {item: False for item in items}

if "schedule" not in st.session_state:
    st.session_state.schedule = {}
    for category, items in TRAVEL_SCHEDULE.items():
        st.session_state.schedule[category] = []
        for item in items:
            st.session_state.schedule[category].append({
                "name": item["name"],
                "type": item["type"],
                "status": item["status"],
                "note": item["note"]
            })

# 여행 기간 설정 세션 상태
if "travel_dates" not in st.session_state:
    st.session_state.travel_dates = {
        "start_date": None,
        "end_date": None,
        "days": 0
    }

# 날짜별 일정 세션 상태
if "daily_schedule" not in st.session_state:
    st.session_state.daily_schedule = {}

# 깔끔한 헤더
st.markdown("""
<div class="clean-header">
    <h1 class="header-title">🎬 BIFF 30회 여행 가이드</h1>
    <p class="header-subtitle">부산국제영화제 2025.9.17 ~ 9.26</p>
    <p class="header-description">영화제 일정부터 부산 여행까지 모든 것을 도와드립니다</p>
</div>
""", unsafe_allow_html=True)



# Gemini 모델 설정
model = setup_gemini()

if not model:
    st.stop()

# 사이드바 정보
with st.sidebar:
    st.markdown("### 📋 BIFF 30회 정보")
    st.markdown(f"""
    **📅 일정**  
    {BIFF_INFO['dates']}
    
    **🎫 티켓 가격**  
    • 일반: {BIFF_INFO['ticket_prices']['일반']}  
    • 학생/경로: {BIFF_INFO['ticket_prices']['학생/경로']}  
    • 갈라/특별상영: {BIFF_INFO['ticket_prices']['갈라/특별상영']}
    """)
    
    st.markdown("---")
    st.markdown("### 🏖️ 부산 핫플레이스")
    for attraction in BIFF_INFO['attractions'][:4]:
        st.markdown(f"• {attraction}")
 
    
    st.markdown("---")
    st.markdown("### 🎉 부산 청년패스")
    st.markdown(f"""
    **📋 대상:** {BIFF_INFO['youth_benefits']['age_limit']}
    
    **🎁 주요 혜택:**
    • 🎬 영화관람료 할인 (BIFF 포함!)
    • 🚇 대중교통 할인
    • 🍽️ 음식점 & ☕ 카페 할인
    • 🏛️ 문화시설 할인
    
    **📝 신청:** [부산시 홈페이지](https://www.busan.go.kr) 또는 모바일 앱에서 신청
    """)

    st.markdown("---")
    st.markdown("### 🔗 유용한 링크")
    st.markdown("""
    • [BIFF 공식 사이트](https://www.biff.kr/kor/)
    • [부산관광공사](https://www.visitbusan.net/)
    • [부산지하철 노선도](http://www.humetro.busan.kr/)
    """)
    
    st.markdown("---")
    if st.button("🗑️ 채팅 초기화"):
        st.session_state.messages = [st.session_state.messages[0]]
        st.rerun()

# 탭으로 섹션 구분
tab1, tab2, tab3, tab4, tab5 = st.tabs(["💬 AI 채팅", "📅 일정 관리", "🗺️ 여행 지도", "🧳 짐 체크리스트", "🛍️ 여행용품 쇼핑"])

with tab1:
    # 빠른 질문 버튼들
    st.markdown("### 🚀 빠른 질문")
    quick_questions = [
        "BIFF 일정 알려줘",
        "영화 예매 방법",
        "부산 청년패스 혜택",
        "부산 3박4일 일정 짜줘", 
        "부산 대표 맛집 추천",
        "챗봇 기능 설명"
    ]

    cols = st.columns(3)
    for i, question in enumerate(quick_questions):
        with cols[i % 3]:
            if st.button(question, key=f"quick_{i}"):
                # 사용자 메시지 추가
                st.session_state.messages.append({"role": "user", "content": question})
                
                # AI 답변 생성
                try:
                    with st.spinner("답변 생성 중..."):
                        biff_prompt = create_biff_prompt(question)
                        response = model.generate_content(biff_prompt)
                        
                        if response.text:
                            bot_response = response.text
                            
                            # 여행용품 관련 질문시 상품 추천 추가
                            if any(keyword in question.lower() for keyword in ['캐리어', '가방', '카메라', '준비물', '쇼핑', '추천']):
                                bot_response += "\n\n**🛍️ 추천 상품들:**\n"
                                
                                if '캐리어' in question.lower() or '가방' in question.lower():
                                    for product in TRAVEL_PRODUCTS['캐리어'][:2]:
                                        bot_response += create_product_card(
                                            product['name'], product['desc'], 
                                            product['price'], product['keyword']
                                        )
                                
                                if '카메라' in question.lower():
                                    for product in TRAVEL_PRODUCTS['카메라'][:2]:
                                        bot_response += create_product_card(
                                            product['name'], product['desc'], 
                                            product['price'], product['keyword']
                                        )
                                
                                if '준비물' in question.lower() or '용품' in question.lower():
                                    for product in TRAVEL_PRODUCTS['여행용품'][:2]:
                                        bot_response += create_product_card(
                                            product['name'], product['desc'], 
                                            product['price'], product['keyword']
                                        )
                            
                            st.session_state.messages.append({"role": "assistant", "content": bot_response})
                            
                            # AI 답변 기반 일정 추가 제안
                            suggest_schedule_items(question, bot_response)
                        else:
                            st.session_state.messages.append({"role": "assistant", "content": "죄송합니다. 답변을 생성할 수 없습니다."})
                            
                except Exception as e:
                    st.session_state.messages.append({"role": "assistant", "content": f"오류가 발생했습니다: {e}"})
                
                st.rerun()

    st.markdown("---")

    # 채팅 메시지 표시
    st.markdown("### 💬 AI와 대화하기")

    for message in st.session_state.messages:
        if message["role"] == "user":
            with st.container():
                st.markdown(f"""
                <div class="user-message">
                    <strong>👤 나:</strong> {message['content']}
                </div>
                """, unsafe_allow_html=True)
        else:
            with st.container():
                content = message['content']
                
                # HTML 태그 정리
                clean_content = safe_html_content(content)
                
                if '<div class="product-card">' in content:
                    # 상품 카드가 포함된 경우
                    parts = content.split('**🛍️ 추천 상품들:**')
                    if len(parts) > 1:
                        # 텍스트 부분
                        text_part = safe_html_content(parts[0].strip())
                        if text_part:
                            st.markdown(f"""
                            <div class="bot-message">
                                <strong>🤖 BIFF 가이드:</strong> {text_part}
                            </div>
                            """, unsafe_allow_html=True)
                        
                        # 상품 추천 제목
                        st.markdown("**🛍️ 추천 상품들:**")
                        
                        # 상품 카드들
                        product_part = parts[1]
                        st.markdown(product_part, unsafe_allow_html=True)
                    else:
                        # HTML 태그가 포함된 전체 메시지 처리
                        clean_content = safe_html_content(content)
                        if clean_content.strip():
                            st.markdown(clean_content, unsafe_allow_html=True)
                else:
                    # 일반 메시지
                    if clean_content.strip():
                        st.markdown(f"""
                        <div class="bot-message">
                            <strong>🤖 BIFF 가이드:</strong> {clean_content}
                        </div>
                        """, unsafe_allow_html=True)

    # 채팅 입력
    if prompt := st.chat_input("BIFF나 부산 여행에 대해 궁금한 것을 물어보세요!"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        try:
            with st.spinner("답변 생성 중..."):
                biff_prompt = create_biff_prompt(prompt)
                response = model.generate_content(biff_prompt)
                
                if response.text:
                    bot_response = response.text
                    
                    # 여행용품 관련 질문시 상품 추천 추가
                    if any(keyword in prompt.lower() for keyword in ['캐리어', '가방', '카메라', '준비물', '쇼핑', '추천']):
                        bot_response += "\n\n**🛍️ 추천 상품들:**\n"
                        
                        if '캐리어' in prompt.lower() or '가방' in prompt.lower():
                            for product in TRAVEL_PRODUCTS['캐리어'][:2]:
                                bot_response += create_product_card(
                                    product['name'], product['desc'], 
                                    product['price'], product['keyword']
                                )
                        
                        if '카메라' in prompt.lower():
                            for product in TRAVEL_PRODUCTS['카메라'][:2]:
                                bot_response += create_product_card(
                                    product['name'], product['desc'], 
                                    product['price'], product['keyword']
                                )
                        
                        if '준비물' in prompt.lower() or '용품' in prompt.lower():
                            for product in TRAVEL_PRODUCTS['여행용품'][:2]:
                                bot_response += create_product_card(
                                    product['name'], product['desc'], 
                                    product['price'], product['keyword']
                                )
                    
                    st.session_state.messages.append({"role": "assistant", "content": bot_response})
                    
                    # AI 답변 기반 일정 추가 제안
                    suggest_schedule_items(prompt, bot_response)
                    
                    st.rerun()
                else:
                    st.error("응답을 생성할 수 없습니다.")
                    
        except Exception as e:
            st.error(f"오류가 발생했습니다: {e}")


        
        st.markdown("---")
        if st.button("🗑️ 채팅 초기화"):
            st.session_state.messages = [st.session_state.messages[0]]
            st.rerun()

with tab2:
    # 일정 관리
    st.markdown("### 📅 BIFF 여행 일정 관리")
    
    # 여행 기간 설정
    st.markdown("#### 🗓️ 여행 기간 설정")
    col1, col2, col3 = st.columns([2, 2, 1])
    
    with col1:
        start_date = st.date_input(
            "출발일",
            value=st.session_state.travel_dates["start_date"],
            key="start_date_input"
        )
        st.session_state.travel_dates["start_date"] = start_date
    
    with col2:
        end_date = st.date_input(
            "도착일",
            value=st.session_state.travel_dates["end_date"],
            key="end_date_input"
        )
        st.session_state.travel_dates["end_date"] = end_date
    
    with col3:
        if start_date and end_date and end_date >= start_date:
            days = (end_date - start_date).days + 1
            st.session_state.travel_dates["days"] = days
            st.metric("여행 기간", f"{days}일")
        else:
            st.metric("여행 기간", "미설정")
    
    if start_date and end_date:
        if end_date < start_date:
            st.error("도착일은 출발일보다 늦어야 합니다.")
        else:
            st.success(f"여행 기간: {start_date.strftime('%Y.%m.%d')} ~ {end_date.strftime('%Y.%m.%d')} ({st.session_state.travel_dates['days']}일)")
    
    st.markdown("---")
    
    # 일정 관리 방식 선택
    schedule_mode = st.radio(
        "일정 관리 방식",
        ["📅 날짜별 일정", "📋 카테고리별 일정"],
        horizontal=True
    )
    
    if schedule_mode == "📅 날짜별 일정":
        # 날짜별 일정 관리
        if start_date and end_date and end_date >= start_date:
            # 날짜별 일정 초기화
            from datetime import timedelta
            current_date = start_date
            while current_date <= end_date:
                date_str = current_date.strftime('%Y-%m-%d')
                if date_str not in st.session_state.daily_schedule:
                    st.session_state.daily_schedule[date_str] = []
                current_date += timedelta(days=1)
            
            # 날짜별 탭 생성
            date_tabs = []
            date_labels = []
            current_date = start_date
            while current_date <= end_date:
                day_num = (current_date - start_date).days + 1
                date_labels.append(f"Day {day_num}\n{current_date.strftime('%m/%d')}")
                date_tabs.append(current_date.strftime('%Y-%m-%d'))
                current_date += timedelta(days=1)
            
            if len(date_tabs) <= 7:  # 7일 이하일 때만 탭으로 표시
                selected_tabs = st.tabs(date_labels)
                
                for i, (tab, date_str) in enumerate(zip(selected_tabs, date_tabs)):
                    with tab:
                        display_date = start_date + timedelta(days=i)
                        st.markdown(f"### 📅 {display_date.strftime('%Y년 %m월 %d일')} ({display_date.strftime('%A')})")
                        
                        # 시간대별 일정
                        time_slots = ["🌅 오전 (06:00-12:00)", "☀️ 오후 (12:00-18:00)", "🌙 저녁 (18:00-24:00)"]
                        
                        for time_slot in time_slots:
                            st.markdown(f"#### {time_slot}")
                            
                            # 해당 시간대의 일정 표시
                            slot_key = f"{date_str}_{time_slot}"
                            if slot_key not in st.session_state.daily_schedule:
                                st.session_state.daily_schedule[slot_key] = []
                            
                            # 기존 일정 표시
                            for j, item in enumerate(st.session_state.daily_schedule[slot_key]):
                                col1, col2, col3, col4 = st.columns([0.5, 2, 1.5, 0.5])
                                
                                with col1:
                                    completed = st.checkbox("완료", value=item.get("completed", False), key=f"daily_{slot_key}_{j}", label_visibility="collapsed")
                                    st.session_state.daily_schedule[slot_key][j]["completed"] = completed
                                
                                with col2:
                                    if completed:
                                        st.markdown(f"~~{item['activity']}~~")
                                    else:
                                        st.markdown(f"**{item['activity']}**")
                                
                                with col3:
                                    time_input = st.text_input(
                                        "시간",
                                        value=item.get("time", ""),
                                        key=f"time_{slot_key}_{j}",
                                        placeholder="예: 14:00"
                                    )
                                    st.session_state.daily_schedule[slot_key][j]["time"] = time_input
                                
                                with col4:
                                    if st.button("🗑️", key=f"del_{slot_key}_{j}"):
                                        st.session_state.daily_schedule[slot_key].pop(j)
                                        st.rerun()
                            
                            # 새 일정 추가
                            with st.expander(f"➕ {time_slot.split()[1]} 일정 추가"):
                                new_activity = st.text_input(
                                    "활동/장소",
                                    key=f"new_activity_{slot_key}",
                                    placeholder="예: 해운대 해수욕장 방문"
                                )
                                
                                col1, col2 = st.columns(2)
                                with col1:
                                    new_time = st.text_input(
                                        "시간",
                                        key=f"new_time_{slot_key}",
                                        placeholder="예: 14:00"
                                    )
                                
                                with col2:
                                    new_note = st.text_input(
                                        "메모",
                                        key=f"new_note_{slot_key}",
                                        placeholder="메모 입력..."
                                    )
                                
                                if st.button("➕ 추가", key=f"add_{slot_key}"):
                                    if new_activity.strip():
                                        st.session_state.daily_schedule[slot_key].append({
                                            "activity": new_activity.strip(),
                                            "time": new_time,
                                            "note": new_note,
                                            "completed": False
                                        })
                                        st.success(f"'{new_activity}' 일정이 추가되었습니다!")
                                        st.rerun()
                                    else:
                                        st.error("활동/장소를 입력해주세요.")
                            
                            st.markdown("---")
            else:
                # 7일 초과시 날짜 선택 방식
                selected_date = st.selectbox(
                    "날짜 선택",
                    options=date_tabs,
                    format_func=lambda x: f"{x} ({(start_date + timedelta(days=date_tabs.index(x))).strftime('%A')})"
                )
                
                if selected_date:
                    display_date = start_date + timedelta(days=date_tabs.index(selected_date))
                    st.markdown(f"### 📅 {display_date.strftime('%Y년 %m월 %d일')} ({display_date.strftime('%A')})")
                    
                    # 위와 동일한 시간대별 일정 로직 적용
                    time_slots = ["🌅 오전 (06:00-12:00)", "☀️ 오후 (12:00-18:00)", "🌙 저녁 (18:00-24:00)"]
                    
                    for time_slot in time_slots:
                        st.markdown(f"#### {time_slot}")
                        
                        slot_key = f"{selected_date}_{time_slot}"
                        if slot_key not in st.session_state.daily_schedule:
                            st.session_state.daily_schedule[slot_key] = []
                        
                        # 기존 일정 표시 (위와 동일한 로직)
                        for j, item in enumerate(st.session_state.daily_schedule[slot_key]):
                            col1, col2, col3, col4 = st.columns([0.5, 2, 1.5, 0.5])
                            
                            with col1:
                                completed = st.checkbox("완료", value=item.get("completed", False), key=f"daily_sel_{slot_key}_{j}", label_visibility="collapsed")
                                st.session_state.daily_schedule[slot_key][j]["completed"] = completed
                            
                            with col2:
                                if completed:
                                    st.markdown(f"~~{item['activity']}~~")
                                else:
                                    st.markdown(f"**{item['activity']}**")
                            
                            with col3:
                                time_input = st.text_input(
                                    "시간",
                                    value=item.get("time", ""),
                                    key=f"time_sel_{slot_key}_{j}",
                                    placeholder="예: 14:00"
                                )
                                st.session_state.daily_schedule[slot_key][j]["time"] = time_input
                            
                            with col4:
                                if st.button("🗑️", key=f"del_sel_{slot_key}_{j}"):
                                    st.session_state.daily_schedule[slot_key].pop(j)
                                    st.rerun()
                        
                        # 새 일정 추가
                        with st.expander(f"➕ {time_slot.split()[1]} 일정 추가"):
                            new_activity = st.text_input(
                                "활동/장소",
                                key=f"new_activity_sel_{slot_key}",
                                placeholder="예: 해운대 해수욕장 방문"
                            )
                            
                            col1, col2 = st.columns(2)
                            with col1:
                                new_time = st.text_input(
                                    "시간",
                                    key=f"new_time_sel_{slot_key}",
                                    placeholder="예: 14:00"
                                )
                            
                            with col2:
                                new_note = st.text_input(
                                    "메모",
                                    key=f"new_note_sel_{slot_key}",
                                    placeholder="메모 입력..."
                                )
                            
                            if st.button("➕ 추가", key=f"add_sel_{slot_key}"):
                                if new_activity.strip():
                                    st.session_state.daily_schedule[slot_key].append({
                                        "activity": new_activity.strip(),
                                        "time": new_time,
                                        "note": new_note,
                                        "completed": False
                                    })
                                    st.success(f"'{new_activity}' 일정이 추가되었습니다!")
                                    st.rerun()
                                else:
                                    st.error("활동/장소를 입력해주세요.")
                        
                        st.markdown("---")
        else:
            st.warning("날짜별 일정을 사용하려면 먼저 여행 기간을 설정해주세요.")
    
    else:
        # 기존 카테고리별 일정 관리
        st.markdown("예약이 필요한 항목과 완료 상태를 체크해보세요!")
        
        # 타입별 아이콘 정의
    type_icons = {
        "reservation": "📞",
        "confirmation": "✅", 
        "visit": "📍",
        "preparation": "🎯"
    }
    
    type_labels = {
        "reservation": "예약 필요",
        "confirmation": "확인 필요",
        "visit": "방문 예정",
        "preparation": "준비 사항"
    }
    
    # 진행률 표시
    total_items = sum(len(items) for items in TRAVEL_SCHEDULE.values())
    completed_items = sum(sum(1 for item in category if item["status"]) for category in st.session_state.schedule.values())
    progress = completed_items / total_items if total_items > 0 else 0
    
    col1, col2, col3 = st.columns([2, 1, 1])
    with col1:
        st.progress(progress)
    with col2:
        st.metric("완료", f"{completed_items}/{total_items}")
    with col3:
        st.metric("진행률", f"{progress:.1%}")
    
    st.markdown("---")
    
    # 카테고리별 일정 표시
    for category, items in st.session_state.schedule.items():
        st.markdown(f'<div class="category-header">{category}</div>', unsafe_allow_html=True)
        
        for i, item in enumerate(items):
            # 각 항목을 확장 가능한 형태로 표시
            with st.expander(f"{type_icons.get(item['type'], '📝')} {item['name']}", expanded=False):
                col1, col2 = st.columns([1, 1])
                
                with col1:
                    # 체크박스
                    checked = st.checkbox(
                        "완료", 
                        value=item["status"],
                        key=f"schedule_{category}_{i}"
                    )
                    st.session_state.schedule[category][i]["status"] = checked
                    
                    # 태그 선택
                    current_type_index = list(type_labels.keys()).index(item["type"]) if item["type"] in type_labels else 0
                    selected_type = st.selectbox(
                        "태그",
                        options=list(type_labels.keys()),
                        format_func=lambda x: f"{type_icons[x]} {type_labels[x]}",
                        index=current_type_index,
                        key=f"type_{category}_{i}"
                    )
                    st.session_state.schedule[category][i]["type"] = selected_type
                
                with col2:
                    # 항목명 수정
                    new_name = st.text_input(
                        "항목명",
                        value=item["name"],
                        key=f"name_{category}_{i}"
                    )
                    st.session_state.schedule[category][i]["name"] = new_name
                    
                    # 메모 입력
                    note = st.text_area(
                        "메모",
                        value=item["note"],
                        key=f"note_{category}_{i}",
                        placeholder="메모를 입력하세요...",
                        height=100
                    )
                    st.session_state.schedule[category][i]["note"] = note
                
                # 상태 표시
                if checked:
                    st.success("✅ 완료됨")
                else:
                    type_color = "#dc143c" if selected_type == "reservation" else "#6c757d"
                    st.markdown(f"<div style='color: {type_color}; font-weight: bold;'>{type_icons[selected_type]} {type_labels[selected_type]}</div>", unsafe_allow_html=True)
                
                # 항목 삭제 버튼
                if st.button(f"🗑️ 삭제", key=f"delete_{category}_{i}"):
                    st.session_state.schedule[category].pop(i)
                    st.rerun()
        
        # 새 항목 추가
        with st.expander(f"➕ {category}에 새 항목 추가"):
            col1, col2 = st.columns([1, 1])
            
            with col1:
                new_item_name = st.text_input(
                    "새 항목명",
                    key=f"new_name_{category}",
                    placeholder="새 항목을 입력하세요..."
                )
                
                new_item_type = st.selectbox(
                    "태그 선택",
                    options=list(type_labels.keys()),
                    format_func=lambda x: f"{type_icons[x]} {type_labels[x]}",
                    key=f"new_type_{category}"
                )
            
            with col2:
                new_item_note = st.text_area(
                    "메모",
                    key=f"new_note_{category}",
                    placeholder="메모를 입력하세요...",
                    height=100
                )
                
                if st.button(f"➕ 추가", key=f"add_{category}"):
                    if new_item_name.strip():
                        st.session_state.schedule[category].append({
                            "name": new_item_name.strip(),
                            "type": new_item_type,
                            "status": False,
                            "note": new_item_note
                        })
                        st.success(f"'{new_item_name}' 항목이 추가되었습니다!")
                        st.rerun()
                    else:
                        st.error("항목명을 입력해주세요.")
        
        st.markdown("<br>", unsafe_allow_html=True)
    
    st.markdown("---")
    
    # 일정 저장/불러오기
    st.markdown("#### 💾 일정 저장/불러오기")
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("💾 일정 저장"):
            import json
            schedule_data = {
                "travel_dates": st.session_state.travel_dates,
                "schedule": st.session_state.schedule
            }
            schedule_json = json.dumps(schedule_data, ensure_ascii=False, indent=2, default=str)
            st.download_button(
                label="📥 JSON 파일로 다운로드",
                data=schedule_json,
                file_name=f"biff_travel_schedule_{st.session_state.travel_dates['start_date'] or 'unknown'}.json",
                mime="application/json"
            )
    
    with col2:
        uploaded_file = st.file_uploader("📤 일정 불러오기", type=['json'])
        if uploaded_file is not None:
            try:
                import json
                schedule_data = json.load(uploaded_file)
                st.session_state.travel_dates = schedule_data.get("travel_dates", st.session_state.travel_dates)
                st.session_state.schedule = schedule_data.get("schedule", st.session_state.schedule)
                st.success("일정이 성공적으로 불러와졌습니다!")
                st.rerun()
            except Exception as e:
                st.error(f"파일을 불러오는 중 오류가 발생했습니다: {e}")
    
    st.markdown("---")
    
    # 일정 관리 버튼들
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        if st.button("📞 예약 필요 항목만 보기"):
            st.markdown("### 🔴 예약이 필요한 항목들")
            for category, items in st.session_state.schedule.items():
                reservation_items = [item for item in items if item["type"] == "reservation" and not item["status"]]
                if reservation_items:
                    st.markdown(f"**{category}**")
                    for item in reservation_items:
                        st.markdown(f"• 📞 {item['name']}")
    
    with col2:
        if st.button("✅ 완료된 항목만 보기"):
            st.markdown("### 🟢 완료된 항목들")
            for category, items in st.session_state.schedule.items():
                completed_items = [item for item in items if item["status"]]
                if completed_items:
                    st.markdown(f"**{category}**")
                    for item in completed_items:
                        st.markdown(f"• ✅ {item['name']}")
    
    with col3:
        if st.button("� 통계 보기기"):
            total_items = sum(len(items) for items in st.session_state.schedule.values())
            completed_items = sum(sum(1 for item in items if item["status"]) for items in st.session_state.schedule.values())
            reservation_items = sum(sum(1 for item in items if item["type"] == "reservation" and not item["status"]) for items in st.session_state.schedule.values())
            
            st.markdown("### 📊 일정 통계")
            col_a, col_b, col_c = st.columns(3)
            with col_a:
                st.metric("전체 항목", total_items)
            with col_b:
                st.metric("완료 항목", completed_items)
            with col_c:
                st.metric("예약 필요", reservation_items)
    
    with col4:
        if st.button("🔄 일정 초기화"):
            for category in st.session_state.schedule:
                for i, item in enumerate(st.session_state.schedule[category]):
                    st.session_state.schedule[category][i]["status"] = False
                    st.session_state.schedule[category][i]["note"] = ""
            st.session_state.travel_dates = {"start_date": None, "end_date": None, "days": 0}
            st.rerun()

with tab3:
    # 여행 지도
    st.markdown("### 🗺️ 부산 여행 지도")
    
    if not MAP_AVAILABLE:
        st.error("🗺️ 지도 기능을 사용하려면 다음 명령어로 라이브러리를 설치해주세요:")
        st.code("pip install folium streamlit-folium")
        st.info("라이브러리 설치 후 앱을 다시 시작해주세요.")
        st.stop()
    
    # 지도 모드 선택
    map_mode = st.radio(
        "지도 보기 모드",
        ["🎯 내 일정 지도", "🏛️ 부산 전체 명소", "🍽️ 맛집 지도", "🎬 BIFF 상영관"],
        horizontal=True
    )
    
    if map_mode == "🎯 내 일정 지도":
        st.markdown("#### 📅 내가 추가한 일정 위치")
        
        # 일정 통계
        total_schedule_items = sum(len(items) for items in st.session_state.schedule.values())
        completed_items = sum(sum(1 for item in items if item["status"]) for items in st.session_state.schedule.values())
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("전체 일정", f"{total_schedule_items}개")
        with col2:
            st.metric("완료", f"{completed_items}개")
        with col3:
            st.metric("남은 일정", f"{total_schedule_items - completed_items}개")
        
        # 내 일정 지도 생성
        schedule_map = create_schedule_map()
        if schedule_map:
            st.markdown("**🗺️ 지도 범례:**")
            st.markdown("- 🔴 BIFF 관련 | 🟠 맛집 | 🔵 관광지 | 🟢 숙박 | 🟣 교통")
            st.markdown("- ✅ 완료된 일정 | ⏰ 예정된 일정")
            st_folium(schedule_map, width=700, height=500)
        else:
            st.info("📍 아직 위치 정보가 있는 일정이 없습니다. AI 채팅에서 장소를 추천받고 일정에 추가해보세요!")
    
    elif map_mode == "🏛️ 부산 전체 명소":
        st.markdown("#### 🎯 부산 주요 관광지 전체 보기")
        
        # 카테고리 필터
        categories = ["전체"] + list(set(info.get('category', '🎯 관광지') for info in BUSAN_LOCATIONS.values()))
        selected_category = st.selectbox("카테고리 필터", categories)
        
        # 필터링된 위치
        if selected_category == "전체":
            filtered_locations = BUSAN_LOCATIONS
        else:
            filtered_locations = {name: info for name, info in BUSAN_LOCATIONS.items() 
                                if info.get('category') == selected_category}
        
        st.markdown(f"**📍 표시된 장소: {len(filtered_locations)}개**")
        
        # 전체 명소 지도
        full_map = create_busan_map(filtered_locations)
        st_folium(full_map, width=700, height=500)
        
        # 장소 목록
        st.markdown("#### 📋 장소 목록")
        for name, info in filtered_locations.items():
            col1, col2 = st.columns([3, 1])
            with col1:
                st.markdown(f"**{info.get('category', '🎯')} {name}**")
            with col2:
                if st.button(f"📅 추가", key=f"add_location_{name}"):
                    category = info.get('category', '🎯 관광지')
                    if add_to_schedule(name, category, "visit", "지도에서 추가"):
                        st.success(f"✅ '{name}'이(가) 일정에 추가되었습니다!")
                        st.rerun()
    
    elif map_mode == "🍽️ 맛집 지도":
        st.markdown("#### 🍽️ 부산 맛집 지도")
        
        # 지역 선택
        areas = ["전체"] + list(BIFF_INFO['restaurants'].keys())
        selected_area = st.selectbox("지역 선택", areas)
        
        # 맛집 위치 데이터 준비
        restaurant_locations = {}
        
        if selected_area == "전체":
            for area, restaurants in BIFF_INFO['restaurants'].items():
                for restaurant in restaurants:
                    restaurant_locations[restaurant['name']] = {
                        "lat": restaurant['lat'],
                        "lng": restaurant['lng'],
                        "category": "🍽️ 맛집"
                    }
        else:
            for restaurant in BIFF_INFO['restaurants'][selected_area]:
                restaurant_locations[restaurant['name']] = {
                    "lat": restaurant['lat'],
                    "lng": restaurant['lng'],
                    "category": "🍽️ 맛집"
                }
        
        st.markdown(f"**🍽️ 표시된 맛집: {len(restaurant_locations)}개**")
        
        # 맛집 지도
        restaurant_map = create_busan_map(restaurant_locations)
        st_folium(restaurant_map, width=700, height=500)
        
        # 맛집 목록
        st.markdown("#### 🍽️ 맛집 목록")
        restaurants_to_show = BIFF_INFO['restaurants'] if selected_area == "전체" else {selected_area: BIFF_INFO['restaurants'][selected_area]}
        
        for area, restaurants in restaurants_to_show.items():
            st.markdown(f"**📍 {area}**")
            for restaurant in restaurants:
                col1, col2, col3 = st.columns([2, 1, 1])
                with col1:
                    st.markdown(f"🍽️ **{restaurant['name']}** - {restaurant['specialty']}")
                with col2:
                    if st.button(f"📅 추가", key=f"add_restaurant_map_{restaurant['name']}"):
                        note = f"{restaurant['type']} - {restaurant['specialty']} ({restaurant['location']})"
                        if add_to_schedule(restaurant['name'], "🍽️ 맛집", "visit", note):
                            st.success(f"✅ '{restaurant['name']}'이(가) 일정에 추가되었습니다!")
                            st.rerun()
                with col3:
                    naver_url = f"https://map.naver.com/v5/search/{restaurant['name']} {restaurant['location']}"
                    st.markdown(f"[🔍 네이버]({naver_url})")
    
    elif map_mode == "🎬 BIFF 상영관":
        st.markdown("#### 🎬 BIFF 상영관 위치")
        
        # BIFF 관련 장소만 필터링
        biff_locations = {name: info for name, info in BUSAN_LOCATIONS.items() 
                         if info.get('category') == '🎬 BIFF 관련'}
        
        st.markdown(f"**🎬 BIFF 상영관: {len(biff_locations)}개**")
        
        # BIFF 상영관 지도
        biff_map = create_busan_map(biff_locations)
        st_folium(biff_map, width=700, height=500)
        
        # 상영관 정보
        st.markdown("#### 🎬 상영관 정보")
        for venue in BIFF_INFO['venues']:
            if venue in biff_locations:
                col1, col2 = st.columns([3, 1])
                with col1:
                    st.markdown(f"🎬 **{venue}**")
                    st.markdown(f"📍 위치: {biff_locations[venue]['lat']:.4f}, {biff_locations[venue]['lng']:.4f}")
                with col2:
                    if st.button(f"📅 추가", key=f"add_venue_{venue}"):
                        if add_to_schedule(f"{venue} 방문", "🎬 BIFF 관련", "visit", "상영관 방문"):
                            st.success(f"✅ '{venue} 방문'이(가) 일정에 추가되었습니다!")
                            st.rerun()

with tab4:
    # 짐 체크리스트
    st.markdown("### 🧳 BIFF 여행 짐 체크리스트")
    
    # 진행률 표시
    total_items = sum(len(items) for items in TRAVEL_CHECKLIST.values())
    checked_items = sum(sum(category.values()) for category in st.session_state.checklist.values())
    progress = checked_items / total_items if total_items > 0 else 0
    
    col1, col2, col3 = st.columns([2, 1, 1])
    with col1:
        st.progress(progress)
    with col2:
        st.metric("완료", f"{checked_items}/{total_items}")
    with col3:
        st.metric("진행률", f"{progress:.1%}")
    
    st.markdown("---")
    
    # 카테고리별 체크리스트를 컬럼으로 배치
    categories = list(TRAVEL_CHECKLIST.keys())
    
    # 2개씩 컬럼으로 배치
    for i in range(0, len(categories), 2):
        cols = st.columns(2)
        
        for j, col in enumerate(cols):
            if i + j < len(categories):
                category = categories[i + j]
                items = TRAVEL_CHECKLIST[category]
                
                with col:
                    st.markdown(f'<div class="category-header">{category}</div>', unsafe_allow_html=True)
                    
                    for item in items:
                        checked = st.checkbox(
                            item, 
                            value=st.session_state.checklist[category][item],
                            key=f"check_{category}_{item}"
                        )
                        st.session_state.checklist[category][item] = checked
    
    st.markdown("---")
    
    # 체크리스트 관리 버튼들
    col1, col2 = st.columns(2)
    with col1:
        if st.button("✅ 모두 체크"):
            for category in st.session_state.checklist:
                for item in st.session_state.checklist[category]:
                    st.session_state.checklist[category][item] = True
            st.rerun()
    
    with col2:
        if st.button("🔄 체크리스트 초기화"):
            for category in st.session_state.checklist:
                for item in st.session_state.checklist[category]:
                    st.session_state.checklist[category][item] = False
            st.rerun()

with tab5:
    # 쿠팡 상품 추천
    st.markdown("### 🛍️ BIFF 여행용품 쇼핑")
    
    # 카테고리 선택
    selected_category = st.selectbox("🏷️ 카테고리 선택", ["캐리어", "카메라", "여행용품"])
    
    st.markdown(f"#### {selected_category} 추천 상품")
    
    # 선택된 카테고리의 상품들을 2개씩 컬럼으로 배치
    products = TRAVEL_PRODUCTS[selected_category]
    
    for i in range(0, len(products), 2):
        cols = st.columns(2)
        
        for j, col in enumerate(cols):
            if i + j < len(products):
                product = products[i + j]
                
                with col:
                    st.markdown(
                        create_product_card(
                            product['name'], product['desc'], 
                            product['price'], product['keyword']
                        ), 
                        unsafe_allow_html=True
                    )
    
    st.markdown("---")
    
    # 전체 카테고리 한번에 보기
    if st.button("🛒 전체 추천 상품 보기"):
        for category, products in TRAVEL_PRODUCTS.items():
            st.markdown(f"### {category}")
            
            cols = st.columns(2)
            for i, product in enumerate(products):
                with cols[i % 2]:
                    st.markdown(
                        create_product_card(
                            product['name'], product['desc'], 
                            product['price'], product['keyword']
                        ), 
                        unsafe_allow_html=True
                    )

# 푸터
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 1rem;">
    <p>🎬 제30회 부산국제영화제 여행 가이드</p>
    <p><small>※ 정확한 영화제 정보는 <a href="https://www.biff.kr" target="_blank">BIFF 공식 홈페이지</a>를 확인해주세요.</small></p>
    <p><small>💡 청년패스 정보: <a href="https://www.busan.go.kr/mayor/news/1691217" target="_blank">부산시 공식 발표</a></small></p>
</div>
""", unsafe_allow_html=True)