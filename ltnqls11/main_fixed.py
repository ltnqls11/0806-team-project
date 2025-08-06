import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
import requests
import json
import pandas as pd

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

# 탭으로 섹션 구분 (수정된 버전)
tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs([
    "💬 AI 채팅", 
    "🎬 BIFF 상영일정", 
    "🚇 부산 교통", 
    "🍽️ 부산 맛집", 
    "🌤️ 부산 날씨", 
    "🧳 짐 체크리스트", 
    "🛍️ 여행용품 쇼핑"
])

with tab1:
    st.markdown("### 💬 AI 채팅")
    st.markdown("BIFF나 부산 여행에 대해 궁금한 것을 물어보세요!")
    
    if prompt := st.chat_input("질문을 입력하세요..."):
        try:
            response = model.generate_content(f"부산국제영화제(BIFF) 29회 여행 가이드로서 답변해주세요: {prompt}")
            if response.text:
                st.markdown(f"**🤖 BIFF 가이드:** {response.text}")
        except Exception as e:
            st.error(f"오류가 발생했습니다: {e}")

with tab2:
    st.markdown("### 🎬 BIFF 29회 상영일정")
    st.markdown("**📅 일정:** 2024년 10월 2일(수) ~ 10월 11일(금)")
    st.markdown("**🏛️ 주요 상영관:**")
    st.markdown("- 🎬 영화의전당")
    st.markdown("- 🎭 롯데시네마 센텀시티")
    st.markdown("- 🎪 CGV 센텀시티")
    st.markdown("- 🎨 부산시네마센터")

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

with tab4:
    st.markdown("### 🍽️ 부산 맛집 추천")
    st.markdown("**🔥 부산 대표 맛집:**")
    
    restaurants = [
        {"name": "자갈치시장 회센터", "type": "해산물", "location": "자갈치시장", "price": "2-4만원"},
        {"name": "할매 돼지국밥", "type": "부산향토음식", "location": "서면", "price": "8천-1만원"},
        {"name": "밀면 전문점", "type": "부산향토음식", "location": "남포동", "price": "7천-9천원"},
        {"name": "해운대 횟집", "type": "해산물", "location": "해운대", "price": "3-5만원"}
    ]
    
    for restaurant in restaurants:
        st.markdown(f"""
        **🍽️ {restaurant['name']}**
        - 🏷️ 종류: {restaurant['type']}
        - 📍 위치: {restaurant['location']}
        - 💰 가격: {restaurant['price']}
        """)

with tab5:
    st.markdown("### 🌤️ 부산 날씨")
    st.markdown("**📊 10월 부산 일반적인 날씨:**")
    st.markdown("- 🌡️ 평균 기온: 15-22°C")
    st.markdown("- 🍂 계절: 가을, 선선한 날씨")
    st.markdown("- ☔ 강수: 간헐적 비, 우산 준비 권장")
    st.markdown("- 💨 바람: 약간 바람, 얇은 외투 추천")

with tab6:
    st.markdown("### 🧳 BIFF 여행 짐 체크리스트")
    
    checklist_items = [
        "📱 휴대폰 충전기",
        "🎫 영화 티켓 예매 확인",
        "🧥 가벼운 외투 (10월 날씨 대비)",
        "☂️ 우산",
        "📷 카메라",
        "💳 현금/카드",
        "🆔 신분증",
        "🧴 개인 세면용품"
    ]
    
    for item in checklist_items:
        checked = st.checkbox(item)

with tab7:
    st.markdown("### 🛍️ 여행용품 쇼핑")
    st.markdown("**🎒 추천 여행용품:**")
    
    products = [
        {"name": "20인치 기내용 캐리어", "desc": "BIFF 단기 여행용", "price": "10-15만원"},
        {"name": "미러리스 카메라", "desc": "BIFF 인증샷 필수", "price": "80-150만원"},
        {"name": "보조배터리 20000mAh", "desc": "하루종일 외출용", "price": "3-5만원"},
        {"name": "여행용 목베개", "desc": "장거리 이동시", "price": "1-3만원"}
    ]
    
    for product in products:
        st.markdown(f"""
        **🛍️ {product['name']}**
        - 📝 설명: {product['desc']}
        - 💰 가격: {product['price']}
        """)

# 푸터
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 1rem;">
    <p>🎬 제29회 부산국제영화제 여행 챗봇</p>
    <p><small>※ 정확한 영화제 정보는 <a href="https://www.biff.kr" target="_blank">BIFF 공식 홈페이지</a>를 확인해주세요.</small></p>
</div>
""", unsafe_allow_html=True)