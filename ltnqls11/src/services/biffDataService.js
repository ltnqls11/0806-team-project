import biff29Data from '../data/biff29_namuwiki_data.json';

export class BiffDataService {
  constructor() {
    this.data = biff29Data;
  }

  // 기본 정보 가져오기
  getBasicInfo() {
    return this.data.basic_info;
  }

  // 빠른 질문 데이터 가져오기
  getQuickQuestions() {
    return this.data.quick_questions;
  }

  // 상영관 정보 가져오기
  getVenues() {
    return this.data.venues;
  }

  // 특정 상영관 정보 가져오기
  getVenueByName(name) {
    return this.data.venues.find(venue => venue.name === name);
  }

  // 영화 섹션 정보 가져오기
  getSections() {
    return this.data.sections;
  }

  // 특정 섹션 정보 가져오기
  getSectionByName(name) {
    return this.data.sections[name];
  }

  // 시상 정보 가져오기
  getAwards() {
    return this.data.awards;
  }

  // 특별 행사 정보 가져오기
  getSpecialEvents() {
    return this.data.special_events;
  }

  // 특정 날짜의 행사 가져오기
  getEventsByDate(date) {
    return this.data.special_events.filter(event => 
      event.date === date || event.date.includes(date)
    );
  }

  // 검색 기능
  searchInfo(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    // 상영관 검색
    this.data.venues.forEach(venue => {
      if (venue.name.toLowerCase().includes(lowerQuery) ||
          venue.location.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'venue',
          data: venue,
          relevance: 'high'
        });
      }
    });

    // 섹션 검색
    Object.entries(this.data.sections).forEach(([name, info]) => {
      if (name.toLowerCase().includes(lowerQuery) ||
          info.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'section',
          name: name,
          data: info,
          relevance: 'medium'
        });
      }
    });

    // 행사 검색
    this.data.special_events.forEach(event => {
      if (event.name.toLowerCase().includes(lowerQuery) ||
          event.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'event',
          data: event,
          relevance: 'high'
        });
      }
    });

    return results;
  }

  // 질문에 대한 답변 생성 도우미
  generateAnswerContext(question) {
    const lowerQuestion = question.toLowerCase();
    let context = '';

    // 기본 정보 관련
    if (lowerQuestion.includes('언제') || lowerQuestion.includes('기간') || lowerQuestion.includes('일정')) {
      context += `BIFF 29회는 ${this.data.basic_info.period}에 열립니다. `;
    }

    // 상영관 관련
    if (lowerQuestion.includes('상영관') || lowerQuestion.includes('영화관') || lowerQuestion.includes('어디서')) {
      context += `주요 상영관은 ${this.data.basic_info.main_venues.join(', ')}입니다. `;
    }

    // 티켓 관련
    if (lowerQuestion.includes('티켓') || lowerQuestion.includes('가격') || lowerQuestion.includes('예매')) {
      context += `티켓 가격은 일반 7,000원, 학생 5,000원, 갈라 15,000원, 개폐막작 20,000원입니다. `;
    }

    // 교통 관련
    if (lowerQuestion.includes('교통') || lowerQuestion.includes('지하철') || lowerQuestion.includes('가는 법')) {
      const venues = this.data.venues.map(v => `${v.name}: ${v.transport}`).join('\n');
      context += `교통편:\n${venues} `;
    }

    return context;
  }

  // 관련 질문 추천
  getRelatedQuestions(currentQuestion) {
    const allQuestions = Object.values(this.data.quick_questions).flat();
    const lowerCurrent = currentQuestion.toLowerCase();
    
    return allQuestions.filter(q => 
      q.toLowerCase() !== lowerCurrent && 
      (q.includes('BIFF') || q.includes('부산') || q.includes('영화'))
    ).slice(0, 3);
  }
}

export default BiffDataService;