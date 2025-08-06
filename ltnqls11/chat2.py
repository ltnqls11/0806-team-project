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

# CSS 스타일
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
        margin-bottom: 2rem;
    }
    .user-message {
        background: #e3f2fd;
        padding: 0.8rem;
        border-radius: 10px;
        margin: 0.5rem 0;
        text-align: right;
    }
    .bot-message {
        background: #f5f5f5;
        padding: 0.8rem;
        border-radius: 10px;
        margin: 0.5rem 0;
    }
    .checklist-item {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 0.8rem;
        margin: 0.3rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .checklist-item.checked {
        background: #e8f5e8;
        border-color: #4caf50;
    }
    .category-header {
        background: #667eea;
        color: white;
        padding: 0.8rem;
        border-radius: 8px;
        margin: 1rem 0 0.5rem 0;
        font-weight: bold;
    }
    .youth-pass-info {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 2rem;
    }
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        padding: 0px 24px;
        background-color: #f0f2f6;
        border-radius: 10px;
        color: #262730;
        font-weight: bold;
    }
    .stTabs [aria-selected="true"] {
        background-color: #ff6b6b;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# BIFF 29회 기본 정보
BIFF_INFO = {
    "dates": "2024년 10월 2일(수) ~ 10월 11일(금)",
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
    }
}

# 여행 짐 체크리스트
TRAVEL_CHECKLIST = {
    "� 기본용 짐": [
        "캐리어/여행가방",
        "여권/신분증",
        "항공권/기차표",
        "숙소 예약 확인서",
        "현금/카드",
        "휴대폰 충전기",
        "보조배터리",
        "여행용 어댑터"
    ],
    "👕 의류": [
        "속옷 (여행일수+1벌)",
        "양말 (여행일수+1켤레)",
        "편한 운동화",
        "슬리퍼",
        "가벼운 외투/카디건",
        "긴팔 티셔츠",
        "반팔 티셔츠",
        "바지/치마",
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
    "🎬 BIFF 특화": [
        "영화 티켓 예매 확인",
        "상영 시간표 저장",
        "카메라/스마트폰",
        "휴대용 방석",
        "목베개",
        "간식/물",
        "우산 (10월 날씨 대비)",
        "마스크"
    ],
    "🏖️ 부산 특화": [
        "수영복 (해운대 방문시)",
        "비치타올",
        "선글라스",
        "모자",
        "편한 걷기 신발",
        "배낭/크로스백",
        "부산 지하철 앱",
        "번역 앱"
    ],
    "💊 상비약": [
        "감기약",
        "소화제",
        "진통제",
        "밴드",
        "멀미약",
        "개인 복용 약물"
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
        model = genai.GenerativeModel('gemini-pro')
        return model
    except Exception as e:
        st.error(f"Gemini API 설정 오류: {e}")
        return None

def generate_coupang_link(product_keyword):
    """쿠팡 파트너스 링크 생성"""
    from urllib.parse import quote
    partner_id = os.getenv("COUPANG_PARTNERS_ID", "AF6363203")
    encoded_keyword = quote(product_keyword)
    return f"https://link.coupang.com/a/{partner_id}?lptag=AF6363203&subid=biff_travel&pageKey=0&traceid=V0-153&itemId=&vendorItemId=&q={encoded_keyword}"

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

def create_biff_prompt(user_question):
    """BIFF 특화 프롬프트 생성"""
    return f"""
당신은 부산국제영화제(BIFF) 29회 전문 여행 가이드 챗봇입니다.

BIFF 29회 정보:
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

답변 스타일:
- 친근하고 도움이 되는 톤
- 구체적이고 실용적인 정보 제공
- 이모지 적절히 사용
- 한국어로 답변
- 청년 관련 질문시 청년패스 혜택 안내
- 여행용품 관련 질문시 구체적인 상품 추천

사용자 질문: {user_question}
"""

# 세션 상태 초기화
if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant", 
            "content": "안녕하세요! 🎬 부산국제영화제 29회 여행 가이드입니다.\n\n**📅 2024.10.2(수) ~ 10.11(금)**\n\nBIFF 일정, 부산 여행, 맛집, 숙소, 여행용품 등 무엇이든 물어보세요! 😊\n\n💡 **청년 여러분!** 만 18~34세라면 부산 청년패스로 할인 혜택을 받으세요!"
        }
    ]

if "checklist" not in st.session_state:
    st.session_state.checklist = {}
    for category, items in TRAVEL_CHECKLIST.items():
        st.session_state.checklist[category] = {item: False for item in items}

# 메인 헤더
st.markdown("""
<div class="main-header">
    <h1 style="color: white; margin: 0;">🎬 BIFF 29회 여행 챗봇</h1>
    <p style="color: white; margin: 0.5rem 0 0 0;">부산국제영화제 & 부산여행 전문 가이드</p>
</div>
""", unsafe_allow_html=True)

# 부산 청년패스 정보 박스
st.markdown(f"""
<div class="youth-pass-info">
    <h3>🎉 {BIFF_INFO['youth_benefits']['name']} 혜택 안내</h3>
    <p><strong>📋 대상:</strong> {BIFF_INFO['youth_benefits']['age_limit']}</p>
    <p><strong>🎁 주요 혜택:</strong></p>
    <ul>
        <li>🎬 영화관람료 할인 (BIFF 상영관 포함!)</li>
        <li>🚇 대중교통 할인</li>
        <li>🍽️ 음식점 & ☕ 카페 할인</li>
        <li>🏛️ 문화시설 할인</li>
    </ul>
    <p><strong>📝 신청:</strong> {BIFF_INFO['youth_benefits']['how_to_apply']}</p>
    <a href="{BIFF_INFO['youth_benefits']['info_url']}" target="_blank" style="background: white; color: #667eea; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none; font-weight: bold;">
        📋 자세한 정보 보기
    </a>
</div>
""", unsafe_allow_html=True)

# Gemini 모델 설정
model = setup_gemini()

if not model:
    st.stop()

# 탭으로 섹션 구분
tab1, tab2, tab3 = st.tabs(["💬 AI 채팅", "🧳 짐 체크리스트", "🛍️ 여행용품 쇼핑"])

with tab1:
    # 빠른 질문 버튼들
    st.markdown("### 🚀 빠른 질문")
    quick_questions = [
        "BIFF 일정 알려줘",
        "부산 청년패스 혜택",
        "부산 3박4일 일정 짜줘", 
        "해운대 맛집 추천",
        "영화제 티켓 가격",
        "여행 준비물 추천"
    ]

    cols = st.columns(3)
    for i, question in enumerate(quick_questions):
        with cols[i % 3]:
            if st.button(question, key=f"quick_{i}"):
                st.session_state.messages.append({"role": "user", "content": question})
                st.rerun()

    st.markdown("---")

    # 채팅 메시지 표시
    st.markdown("### 💬 AI와 대화하기")

    for message in st.session_state.messages:
        if message["role"] == "user":
            st.markdown(f"""
            <div class="user-message">
                <strong>👤 나:</strong> {message['content']}
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="bot-message">
                <strong>🤖 BIFF 가이드:</strong> {message['content']}
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
                    st.rerun()
                else:
                    st.error("응답을 생성할 수 없습니다.")
                    
        except Exception as e:
            st.error(f"오류가 발생했습니다: {e}")

    # 사이드바 정보
    with st.sidebar:
        st.markdown("### 📋 BIFF 29회 정보")
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
        st.markdown("### 🎉 청년패스 혜택")
        st.markdown(f"**대상:** {BIFF_INFO['youth_benefits']['age_limit']}")
        for benefit in BIFF_INFO['youth_benefits']['benefits'][:3]:
            st.markdown(f"• {benefit}")
        
        st.markdown("---")
        if st.button("🗑️ 채팅 초기화"):
            st.session_state.messages = [st.session_state.messages[0]]
            st.rerun()

with tab2:
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

with tab3:
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
    <p>🎬 제29회 부산국제영화제 여행 챗봇</p>
    <p><small>※ 정확한 영화제 정보는 <a href="https://www.biff.kr" target="_blank">BIFF 공식 홈페이지</a>를 확인해주세요.</small></p>
    <p><small>💡 청년패스 정보: <a href="https://www.busan.go.kr/mayor/news/1691217" target="_blank">부산시 공식 발표</a></small></p>
</div>
""", unsafe_allow_html=True)