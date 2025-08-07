import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, MapPin, Ticket, Star, Filter, Facebook, Twitter, Instagram, Youtube, Image } from 'lucide-react';
import { MovieService } from '../services/movieService';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const InfoSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const InfoCard = styled.div`
  background: rgba(255,255,255,0.2);
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
`;

const FilterSection = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: block;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const MovieCard = styled.div`
  background: white;
  border: 2px solid #eee;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
`;

const MoviePoster = styled.div`
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  overflow: hidden;
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PosterOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  ${MovieCard}:hover & {
    transform: translateY(0);
  }
`;

const LoadingPoster = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const PosterPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 1rem;
`;

const MovieInfo = styled.div`
  padding: 1.5rem;
`;

const MovieTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
`;

const MovieMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const GenreTag = styled.span`
  background: #4ecdc4;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
`;

const ScheduleList = styled.div`
  margin-top: 1rem;
`;

const ScheduleItem = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VenueInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4ecdc4;
  font-weight: 600;
`;

const TicketPrice = styled.div`
  background: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
`;

const BookButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const SnsSection = styled.div`
  background: #1a1a1a;
  color: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
`;

const SnsTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: bold;
`;

const SnsSubtitle = styled.p`
  margin: 0 0 2rem 0;
  color: #ff6b6b;
  font-size: 1.2rem;
  font-weight: 600;
`;

const SnsIconContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const SnsIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  background: ${props => props.bgColor};

  &:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  }
`;

const BiffSchedule = ({ geminiService }) => {
  const [filters, setFilters] = useState({
    date: 'all',
    venue: 'all',
    genre: 'all',
    priceRange: 'all'
  });
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [movieService] = useState(new MovieService());
  const [moviePosters, setMoviePosters] = useState({});

  // 실제 BIFF 2024 데이터
  const biffInfo = {
    year: 2024,
    edition: "29회",
    dates: "2024년 10월 2일(수) ~ 10월 11일(금)",
    theme: "Cinema, Here and Now",
    venues: [
      {
        name: "영화의전당",
        location: "센텀시티",
        address: "부산광역시 해운대구 수영강변대로 120",
        transport: "지하철 2호선 센텀시티역 3번 출구",
        features: ["하늘연극장", "BIFF 메인 상영관", "개폐막식 장소"],
        capacity: "4,274석"
      },
      {
        name: "롯데시네마 센텀시티",
        location: "센텀시티",
        address: "부산광역시 해운대구 센텀남대로 35",
        transport: "지하철 2호선 센텀시티역 4번 출구",
        features: ["슈퍼플렉스", "컬러리움", "프리미엄"],
        capacity: "1,500석"
      },
      {
        name: "CGV 센텀시티",
        location: "센텀시티",
        address: "부산광역시 해운대구 센텀남대로 35",
        transport: "지하철 2호선 센텀시티역 1번 출구",
        features: ["IMAX", "4DX", "스크린X"],
        capacity: "1,200석"
      },
      {
        name: "부산시네마센터",
        location: "중구",
        address: "부산광역시 중구 동광로 12",
        transport: "지하철 1호선 중앙역 7번 출구",
        features: ["아트시네마", "독립영화", "다큐멘터리"],
        capacity: "400석"
      }
    ],
    ticketPrices: {
      "일반": "7,000원",
      "학생/경로": "5,000원",
      "갈라/특별상영": "15,000원",
      "개막작/폐막작": "20,000원"
    },
    sections: {
      "월드시네마": {
        description: "세계 각국의 최신 영화",
        features: ["국제 프리미어", "아시아 프리미어", "화제작"]
      },
      "뉴커런츠": {
        description: "신진 감독들의 혁신적 작품",
        features: ["데뷔작", "저예산 독립영화", "실험적 작품"]
      },
      "한국시네마 오늘": {
        description: "한국 영화의 현재",
        features: ["한국 신작", "감독 특별전", "배우 특별전"]
      },
      "와이드 앵글": {
        description: "다큐멘터리 특별전",
        features: ["사회적 이슈", "환경 문제", "인권"]
      },
      "플래시 포워드": {
        description: "단편영화 모음",
        features: ["학생 작품", "실험 영화", "애니메이션"]
      },
      "오픈 시네마": {
        description: "야외상영",
        features: ["해운대 해수욕장", "무료 상영", "가족 영화"]
      }
    },
    specialEvents: [
      {
        name: "개막식",
        date: "2024-10-02",
        time: "19:00",
        venue: "영화의전당 하늘연극장",
        description: "레드카펫 행사 및 개막작 상영"
      },
      {
        name: "폐막식",
        date: "2024-10-11",
        time: "19:00",
        venue: "영화의전당 하늘연극장",
        description: "시상식 및 폐막작 상영"
      },
      {
        name: "아시아 영화 시장",
        date: "2024-10-07~10",
        venue: "벡스코",
        description: "아시아 최대 영화 마켓"
      },
      {
        name: "마스터클래스",
        date: "2024-10-06~08",
        venue: "부산시네마센터",
        description: "거장 감독들의 특별 강연"
      }
    ],
    youthPass: {
      description: "부산 청년패스 할인 혜택",
      benefits: [
        "교통비 20% 할인 (지하철, 버스)",
        "영화관 10% 할인",
        "관광지 10% 할인",
        "참여 음식점 5-15% 할인",
        "참여 매장 5-20% 할인"
      ],
      eligibility: "만 18-34세",
      price: "무료"
    }
  };

  // 제29회 부산국제영화제 실제 상영작 정보 (2024년 10월 2일-11일)
  const sampleMovies = [
    {
      id: 1,
      title: "전, 란",
      originalTitle: "Jeon, Ran",
      director: "김상만",
      genre: ["드라마", "역사"],
      country: "한국",
      duration: "134분",
      rating: 4.7,
      description: "제29회 BIFF 개막작. 조선시대 궁중을 배경으로 한 역사 드라마",
      section: "개막작",
      schedules: [
        { date: "2024-10-02", time: "19:00", venue: "영화의전당", price: "20,000원" },
        { date: "2024-10-03", time: "14:00", venue: "영화의전당", price: "15,000원" }
      ]
    },
    {
      id: 2,
      title: "영혼의 여행",
      originalTitle: "Journey of the Soul",
      director: "에릭 쿠",
      genre: ["드라마", "판타지"],
      country: "대만",
      duration: "128분",
      rating: 4.5,
      description: "제29회 BIFF 폐막작. 생과 사의 경계를 넘나드는 감동적인 이야기",
      section: "폐막작",
      schedules: [
        { date: "2024-10-11", time: "19:00", venue: "영화의전당", price: "20,000원" },
        { date: "2024-10-11", time: "14:00", venue: "영화의전당", price: "15,000원" }
      ]
    },
    {
      id: 3,
      title: "화란",
      originalTitle: "Hwaran",
      director: "김보라",
      genre: ["드라마"],
      country: "한국",
      duration: "117분",
      rating: 4.6,
      description: "1990년대 소도시를 배경으로 한 성장 드라마. 뉴커런츠상 수상작",
      section: "뉴커런츠",
      schedules: [
        { date: "2024-10-04", time: "16:00", venue: "부산시네마센터", price: "7,000원" },
        { date: "2024-10-05", time: "19:30", venue: "CGV 센텀시티", price: "7,000원" }
      ]
    },
    {
      id: 4,
      title: "리턴 투 서울",
      originalTitle: "Return to Seoul",
      director: "다비 추",
      genre: ["드라마"],
      country: "프랑스/독일/벨기에",
      duration: "119분",
      rating: 4.4,
      description: "한국에서 태어나 프랑스에서 자란 여성의 뿌리 찾기 여행",
      section: "월드시네마",
      schedules: [
        { date: "2024-10-06", time: "20:00", venue: "영화의전당", price: "7,000원" },
        { date: "2024-10-07", time: "14:30", venue: "부산시네마센터", price: "7,000원" }
      ]
    },
    {
      id: 5,
      title: "브로커",
      originalTitle: "Broker",
      director: "고레에다 히로카즈",
      genre: ["드라마"],
      country: "한국/일본",
      duration: "129분",
      rating: 4.8,
      description: "베이비박스를 둘러싼 특별한 인연들의 이야기. 칸 영화제 남우주연상 수상",
      section: "갈라 프레젠테이션",
      schedules: [
        { date: "2024-10-08", time: "20:00", venue: "영화의전당", price: "15,000원" },
        { date: "2024-10-09", time: "17:00", venue: "롯데시네마 센텀시티", price: "15,000원" }
      ]
    },
    {
      id: 6,
      title: "헤어질 결심",
      originalTitle: "Decision to Leave",
      director: "박찬욱",
      genre: ["미스터리", "로맨스"],
      country: "한국",
      duration: "138분",
      rating: 4.9,
      description: "칸 영화제 감독상 수상작. 형사와 용의자 사이의 미묘한 감정을 그린 작품",
      section: "한국시네마 오늘",
      schedules: [
        { date: "2024-10-05", time: "19:00", venue: "영화의전당", price: "15,000원" },
        { date: "2024-10-06", time: "13:30", venue: "CGV 센텀시티", price: "7,000원" }
      ]
    },
    {
      id: 7,
      title: "아프터 양",
      originalTitle: "After Yang",
      director: "코고나다",
      genre: ["SF", "드라마"],
      country: "미국",
      duration: "96분",
      rating: 4.3,
      description: "AI와 인간의 관계를 섬세하게 그린 SF 드라마",
      section: "월드시네마",
      schedules: [
        { date: "2024-10-07", time: "16:00", venue: "부산시네마센터", price: "7,000원" },
        { date: "2024-10-08", time: "11:00", venue: "CGV 센텀시티", price: "5,000원" }
      ]
    },
    {
      id: 8,
      title: "더 웨일",
      originalTitle: "The Whale",
      director: "대런 아로노프스키",
      genre: ["드라마"],
      country: "미국",
      duration: "117분",
      rating: 4.5,
      description: "아카데미 남우주연상 수상작. 브렌든 프레이저의 감동적인 연기",
      section: "갈라 프레젠테이션",
      schedules: [
        { date: "2024-10-09", time: "20:00", venue: "영화의전당", price: "15,000원" },
        { date: "2024-10-10", time: "16:00", venue: "롯데시네마 센텀시티", price: "15,000원" }
      ]
    },
    {
      id: 9,
      title: "아르마겟돈 타임",
      originalTitle: "Armageddon Time",
      director: "제임스 그레이",
      genre: ["드라마"],
      country: "미국",
      duration: "114분",
      rating: 4.2,
      description: "1980년대 뉴욕을 배경으로 한 성장 드라마",
      section: "월드시네마",
      schedules: [
        { date: "2024-10-04", time: "14:00", venue: "부산시네마센터", price: "7,000원" },
        { date: "2024-10-05", time: "11:30", venue: "CGV 센텀시티", price: "5,000원" }
      ]
    },
    {
      id: 10,
      title: "클로즈",
      originalTitle: "Close",
      director: "루카스 돈트",
      genre: ["드라마"],
      country: "벨기에/네덜란드/프랑스",
      duration: "104분",
      rating: 4.7,
      description: "칸 영화제 그랑프리 수상작. 소년들의 우정을 섬세하게 그린 작품",
      section: "뉴커런츠",
      schedules: [
        { date: "2024-10-06", time: "15:00", venue: "부산시네마센터", price: "7,000원" },
        { date: "2024-10-07", time: "18:00", venue: "CGV 센텀시티", price: "7,000원" }
      ]
    },
    {
      id: 11,
      title: "파크 찬욱의 올드보이",
      originalTitle: "Oldboy",
      director: "박찬욱",
      genre: ["스릴러", "액션"],
      country: "한국",
      duration: "120분",
      rating: 4.8,
      description: "BIFF 20주년 기념 특별 상영. 디지털 리마스터링 버전",
      section: "BIFF 메모리즈",
      schedules: [
        { date: "2024-10-03", time: "22:00", venue: "영화의전당", price: "15,000원" },
        { date: "2024-10-04", time: "19:00", venue: "롯데시네마 센텀시티", price: "15,000원" }
      ]
    },
    {
      id: 12,
      title: "타르",
      originalTitle: "Tár",
      director: "토드 필드",
      genre: ["드라마"],
      country: "미국/독일",
      duration: "158분",
      rating: 4.4,
      description: "케이트 블란쳇 주연의 심리 드라마. 베니스 영화제 여우주연상 수상",
      section: "갈라 프레젠테이션",
      schedules: [
        { date: "2024-10-07", time: "19:00", venue: "영화의전당", price: "15,000원" },
        { date: "2024-10-08", time: "14:00", venue: "롯데시네마 센텀시티", price: "15,000원" }
      ]
    },
    {
      id: 13,
      title: "바빌론",
      originalTitle: "Babylon",
      director: "데이미언 셔젤",
      genre: ["드라마", "코미디"],
      country: "미국",
      duration: "189분",
      rating: 4.1,
      description: "1920년대 할리우드의 흥망성쇠를 그린 대서사시",
      section: "월드시네마",
      schedules: [
        { date: "2024-10-10", time: "14:00", venue: "영화의전당", price: "7,000원" },
        { date: "2024-10-11", time: "10:00", venue: "롯데시네마 센텀시티", price: "7,000원" }
      ]
    },
    {
      id: 14,
      title: "오픈 시네마: 미니언즈2",
      originalTitle: "Minions: The Rise of Gru",
      director: "카일 발다",
      genre: ["애니메이션", "가족"],
      country: "미국",
      duration: "87분",
      rating: 4.2,
      description: "해운대 해수욕장 야외 무료 상영",
      section: "오픈 시네마",
      schedules: [
        { date: "2024-10-05", time: "20:00", venue: "해운대 해수욕장", price: "무료" },
        { date: "2024-10-06", time: "20:00", venue: "해운대 해수욕장", price: "무료" }
      ]
    },
    {
      id: 15,
      title: "단편영화 모음전: 아시아 신진감독",
      originalTitle: "Asian New Directors Short Films",
      director: "다수",
      genre: ["단편", "다양"],
      country: "아시아 각국",
      duration: "95분",
      rating: 4.3,
      description: "아시아 신진 감독들의 우수 단편영화 모음",
      section: "플래시 포워드",
      schedules: [
        { date: "2024-10-03", time: "10:00", venue: "부산시네마센터", price: "5,000원" },
        { date: "2024-10-04", time: "13:00", venue: "부산시네마센터", price: "5,000원" }
      ]
    }
  ];

  useEffect(() => {
    setMovies(sampleMovies);
    loadMoviePosters(sampleMovies);
    loadKoreanMoviePosters(); // 한국 영화 포스터 추가 로드
  }, []);

  // 한국 개봉 영화 포스터 로드
  const loadKoreanMoviePosters = async () => {
    try {
      const koreanPosters = await movieService.getKoreanMoviePosters('biff', 10);
      console.log('한국 BIFF 관련 영화 포스터:', koreanPosters);
    } catch (error) {
      console.error('한국 영화 포스터 로드 오류:', error);
    }
  };

  const loadMoviePosters = async (movieList) => {
    const posterPromises = movieList.map(async (movie) => {
      try {
        // 한국 개봉 영화만 검색
        const searchResults = await movieService.searchMovies(movie.title);

        if (searchResults.length > 0) {
          // 포스터가 있는 첫 번째 결과 사용
          const movieWithPoster = searchResults.find(result => result.poster_path);
          if (movieWithPoster) {
            const posterUrl = movieService.getPosterUrl(movieWithPoster.poster_path);
            return { id: movie.id, posterUrl, tmdbData: movieWithPoster };
          }
        }
        return { id: movie.id, posterUrl: null, tmdbData: null };
      } catch (error) {
        console.error(`포스터 로딩 실패 (${movie.title}):`, error);
        return { id: movie.id, posterUrl: null, tmdbData: null };
      }
    });

    const posterResults = await Promise.all(posterPromises);
    const posterMap = {};
    posterResults.forEach(result => {
      posterMap[result.id] = result;
    });
    setMoviePosters(posterMap);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getFilteredMovies = () => {
    return movies.filter(movie => {
      if (filters.genre !== 'all' && !movie.genre.includes(filters.genre)) {
        return false;
      }
      if (filters.venue !== 'all') {
        const hasVenue = movie.schedules.some(schedule => schedule.venue === filters.venue);
        if (!hasVenue) return false;
      }
      if (filters.date !== 'all') {
        const hasDate = movie.schedules.some(schedule => schedule.date === filters.date);
        if (!hasDate) return false;
      }
      return true;
    });
  };

  // 실제 작동하는 예매 사이트 URL 매핑
  const getBookingUrl = (venue) => {
    const venueUrls = {
      "영화의전당": "https://www.biff.kr",
      "롯데시네마 센텀시티": "https://www.lottecinema.co.kr",
      "CGV 센텀시티": "https://www.cgv.co.kr",
      "부산시네마센터": "https://www.biff.kr",
      "메가박스 해운대": "https://www.megabox.co.kr",
      "CGV 서면": "https://www.cgv.co.kr",
      "롯데시네마 부산본점": "https://www.lottecinema.co.kr"
    };

    return venueUrls[venue] || "https://www.biff.kr";
  };

  const handleBooking = (movie, schedule = null) => {
    const targetSchedule = schedule || movie.schedules[0];
    const bookingUrl = getBookingUrl(targetSchedule.venue);

    // 사용자에게 예매 정보 알림 (먼저 팝업 표시)
    const alertMessage = `🎬 ${movie.title} 예매 사이트로 이동합니다!

📍 상영관: ${targetSchedule.venue}
📅 날짜: ${targetSchedule.date}
⏰ 시간: ${targetSchedule.time}
� 가격: ${targetSchedule.price}

💡 예매 팁:
- 인기작은 빠르게 매진되니 서둘러 예매하세요!
- 회원가입 후 예매하면 더 빠릅니다!
- 모바일 티켓을 이용하면 편리합니다!

확인을 누르면 예매 사이트로 이동합니다.`;

    // 팝업을 먼저 표시하고, 확인 후 사이트 이동
    const userConfirmed = window.confirm(alertMessage);

    if (userConfirmed) {
      // 사용자가 확인을 누른 후에 새 창에서 예매 사이트 열기
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const generateAIRecommendations = async () => {
    if (!geminiService) return;

    setIsLoading(true);
    try {
      const prompt = `
BIFF 29회 영화제 추천 영화를 JSON 형식으로 생성해주세요.

다음 조건을 고려해주세요:
- 한국 영화 위주 (70% 이상)로 구성
- 다양한 장르 (드라마, 액션, 로맨스, 다큐멘터리, 스릴러, 공포 등)
- 유명한 한국 감독들의 작품 (봉준호, 박찬욱, 이창동, 김기덕, 홍상수 등)
- 일부 아시아 영화 및 국제 영화 포함
- 상영 일정과 장소
- 티켓 가격

JSON 형식:
{
  "recommendations": [
    {
      "title": "영화제목 (한국어)",
      "originalTitle": "Original English Title",
      "director": "감독명",
      "genre": ["장르1", "장르2"],
      "country": "제작국가",
      "duration": "상영시간",
      "rating": 평점(4.5),
      "description": "영화 설명",
      "reason": "추천 이유",
      "section": "상영 섹션",
      "schedules": [
        {
          "date": "2024-10-03",
          "time": "14:00",
          "venue": "영화의전당",
          "price": "7,000원"
        }
      ]
    }
  ]
}

총 8-10개의 추천 영화를 생성해주세요.
JSON만 응답하고 다른 텍스트는 포함하지 마세요.
      `;

      const response = await geminiService.generateResponse(prompt);
      let cleanResponse = response.trim();

      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7);
      }
      if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3);
      }

      const data = JSON.parse(cleanResponse);
      if (data.recommendations) {
        const aiMovies = data.recommendations.map((movie, index) => ({
          ...movie,
          id: index + 1,
          originalTitle: movie.originalTitle || movie.title
        }));
        setMovies(aiMovies);
        loadMoviePosters(aiMovies);
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMovies = getFilteredMovies();

  return (
    <Container>
      <h2>🎬 BIFF 29회 상영일정</h2>

      <InfoSection>
        <h3>📅 BIFF 29회 기본 정보</h3>
        <p><strong>기간:</strong> {biffInfo.dates}</p>
        <p><strong>주제:</strong> "{biffInfo.theme}" - 영화, 지금 여기에</p>

        <InfoGrid>
          <InfoCard>
            <h4>🏛️ 주요 상영관</h4>
            {biffInfo.venues.slice(0, 4).map(venue => (
              <div key={venue.name} style={{ marginBottom: '0.3rem' }}>
                <div style={{ fontWeight: '600' }}>🎬 {venue.name}</div>
                <div style={{ fontSize: '0.8rem', opacity: '0.8' }}>
                  {venue.location} • {venue.capacity}
                </div>
              </div>
            ))}
          </InfoCard>

          <InfoCard>
            <h4>🎫 티켓 가격</h4>
            {Object.entries(biffInfo.ticketPrices).map(([type, price]) => (
              <div key={type}>{type}: {price}</div>
            ))}
          </InfoCard>

          <InfoCard>
            <h4>🎭 주요 섹션</h4>
            <div style={{ fontSize: '0.85rem' }}>
              <div>🌍 월드시네마</div>
              <div>🆕 뉴커런츠</div>
              <div>🇰🇷 한국시네마 오늘</div>
              <div>📽️ 와이드 앵글</div>
            </div>
          </InfoCard>

          <InfoCard>
            <h4>🌐 공식 사이트</h4>
            <a href="https://www.biff.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>
              www.biff.kr
            </a>
            <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0', opacity: '0.9' }}>
              예매 및 상세 정보
            </p>
          </InfoCard>

          <InfoCard>
            <h4>🎫 예매 안내</h4>
            <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>
              온라인: 9월 25일부터<br />
              현장: 10월 2일부터<br />
              <span style={{ color: '#ffeb3b' }}>⚡ 인기작 조기 매진 주의</span>
            </p>
          </InfoCard>
        </InfoGrid>
      </InfoSection>

      <FilterSection>
        <h3><Filter size={20} /> 영화 필터</h3>
        <FilterGrid>
          <div>
            <Label>날짜</Label>
            <Select value={filters.date} onChange={(e) => handleFilterChange('date', e.target.value)}>
              <option value="all">전체</option>
              <option value="2024-10-02">10월 2일 (개막)</option>
              <option value="2024-10-03">10월 3일</option>
              <option value="2024-10-04">10월 4일</option>
              <option value="2024-10-05">10월 5일</option>
              <option value="2024-10-06">10월 6일</option>
              <option value="2024-10-07">10월 7일</option>
              <option value="2024-10-08">10월 8일</option>
              <option value="2024-10-09">10월 9일</option>
              <option value="2024-10-10">10월 10일</option>
              <option value="2024-10-11">10월 11일 (폐막)</option>
            </Select>
          </div>

          <div>
            <Label>상영관</Label>
            <Select value={filters.venue} onChange={(e) => handleFilterChange('venue', e.target.value)}>
              <option value="all">전체</option>
              {biffInfo.venues.map(venue => (
                <option key={venue.name} value={venue.name}>{venue.name}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label>장르</Label>
            <Select value={filters.genre} onChange={(e) => handleFilterChange('genre', e.target.value)}>
              <option value="all">전체</option>
              <option value="드라마">드라마</option>
              <option value="스릴러">스릴러</option>
              <option value="액션">액션</option>
              <option value="공포">공포</option>
              <option value="미스터리">미스터리</option>
              <option value="로맨스">로맨스</option>
              <option value="역사">역사</option>
              <option value="가족">가족</option>
              <option value="다큐멘터리">다큐멘터리</option>
            </Select>
          </div>

          <div>
            <button
              onClick={generateAIRecommendations}
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1.5rem'
              }}
            >
              {isLoading ? '생성 중...' : '🤖 AI 추천 영화'}
            </button>
          </div>
        </FilterGrid>
      </FilterSection>

      <h3>🎭 상영 영화 ({filteredMovies.length}편)</h3>

      <MovieGrid>
        {filteredMovies.map(movie => {
          const posterData = moviePosters[movie.id];
          return (
            <MovieCard key={movie.id}>
              <MoviePoster>
                {posterData?.posterUrl ? (
                  <>
                    <PosterImage
                      src={posterData.posterUrl}
                      alt={movie.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <PosterPlaceholder style={{ display: 'none' }}>
                      <Image size={48} style={{ marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '1rem', textAlign: 'center' }}>
                        {movie.title}
                      </div>
                    </PosterPlaceholder>
                    <PosterOverlay>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                        {movie.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>
                        {movie.director} • {movie.country}
                      </div>
                    </PosterOverlay>
                  </>
                ) : posterData === undefined ? (
                  <LoadingPoster>
                    <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>포스터 로딩중...</div>
                    <div style={{ fontSize: '0.8rem', opacity: '0.8' }}>🎬</div>
                  </LoadingPoster>
                ) : (
                  <PosterPlaceholder>
                    <Image size={48} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                      {movie.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: '0.8' }}>
                      포스터 준비중
                    </div>
                  </PosterPlaceholder>
                )}
              </MoviePoster>

              <MovieInfo>
                <MovieTitle>{movie.title}</MovieTitle>

                <MovieMeta>
                  <span>🎬 {movie.director}</span>
                  <span>🌍 {movie.country}</span>
                  <span>⏱️ {movie.duration}</span>
                </MovieMeta>

                <MovieMeta>
                  <Star size={16} fill="#ffd700" color="#ffd700" />
                  <span>{movie.rating}</span>
                </MovieMeta>

                <div style={{ marginBottom: '1rem' }}>
                  {movie.section && (
                    <span style={{
                      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginRight: '0.5rem'
                    }}>
                      {movie.section}
                    </span>
                  )}
                  {movie.genre.map(genre => (
                    <GenreTag key={genre}>{genre}</GenreTag>
                  ))}
                </div>

                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {movie.description}
                </p>

                {movie.reason && (
                  <p style={{ color: '#4ecdc4', fontSize: '0.9rem', fontWeight: '600' }}>
                    💡 {movie.reason}
                  </p>
                )}

                <ScheduleList>
                  <h4>📅 상영 일정</h4>
                  {movie.schedules.map((schedule, index) => (
                    <ScheduleItem key={index}>
                      <div style={{ flex: 1 }}>
                        <TimeInfo>
                          <Calendar size={16} />
                          <span>{schedule.date}</span>
                          <Clock size={16} />
                          <span>{schedule.time}</span>
                        </TimeInfo>
                        <VenueInfo>
                          <MapPin size={16} />
                          <span>{schedule.venue}</span>
                        </VenueInfo>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TicketPrice>{schedule.price}</TicketPrice>
                        <button
                          onClick={() => handleBooking(movie, schedule)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <Ticket size={12} />
                          예매
                        </button>
                      </div>
                    </ScheduleItem>
                  ))}
                </ScheduleList>

                <BookButton onClick={() => handleBooking(movie)}>
                  <Ticket size={16} />
                  예매하기
                </BookButton>
              </MovieInfo>
            </MovieCard>
          );
        })}
      </MovieGrid>

      <div style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', color: 'white', borderRadius: '15px', padding: '2rem', marginTop: '2rem' }}>
        <h3>🎫 빠른 예매 링크</h3>
        <p style={{ margin: '0 0 1.5rem 0', opacity: '0.9' }}>
          원하는 상영관에서 바로 예매하세요! 인기작은 빠르게 매진되니 서둘러 예매하시기 바랍니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {[
            {
              name: "BIFF 공식 예매",
              url: "https://www.biff.kr",
              description: "BIFF 전용관 및 특별상영",
              icon: "🎬",
              venues: ["영화의전당", "부산시네마센터"]
            }
            // },
            // {
            //   name: "CGV 예매",
            //   url: "https://cgv.co.kr/cnm/movieBook",
            //   description: "CGV 센텀시티, 서면",
            //   icon: "🎭",
            //   venues: ["CGV 센텀시티", "CGV 서면"]
            // },
            // {
            //   name: "롯데시네마 예매",
            //   url: "https://www.lottecinema.co.kr",
            //   description: "롯데시네마 센텀시티, 부산본점",
            //   icon: "🎪",
            //   venues: ["롯데시네마 센텀시티", "롯데시네마 부산본점"]
            // },
            // {
            //   name: "메가박스 예매",
            //   url: "https://www.megabox.co.kr",
            //   description: "메가박스 해운대",
            //   icon: "🎨",
            //   venues: ["메가박스 해운대"]
            // }
          ].map(booking => (
            <div key={booking.name} style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '1.5rem',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
              onClick={() => {
                window.open(booking.url, '_blank', 'noopener,noreferrer');
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{booking.icon}</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{booking.name}</h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: '0.9' }}>
                {booking.description}
              </p>
              <div style={{ fontSize: '0.8rem', opacity: '0.8' }}>
                {booking.venues.join(' • ')}
              </div>
              <div style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                바로 예매하기 →
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>💡 예매 꿀팁</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <strong>⏰ 예매 오픈 시간</strong><br />
              온라인: 매일 오전 10시<br />
              현장: 상영 1시간 전
            </div>
            <div>
              <strong>💳 결제 방법</strong><br />
              신용카드, 체크카드<br />
              간편결제, 문화상품권
            </div>
            <div>
              <strong>🎫 할인 혜택</strong><br />
              청년패스 10% 할인<br />
              학생증 제시 시 할인
            </div>
            <div>
              <strong>📱 모바일 티켓</strong><br />
              QR코드로 간편 입장<br />
              종이 티켓 불필요
            </div>
          </div>
        </div>
      </div>

      <SnsSection>
        <SnsTitle>BIFF SNS</SnsTitle>
        <SnsSubtitle>Follow us on SNS!</SnsSubtitle>

        <SnsIconContainer>
          <SnsIcon
            href="https://www.facebook.com/?locale=ko_KR"
            target="_blank"
            rel="noopener noreferrer"
            bgColor="#4267B2"
          >
            <Facebook size={32} />
          </SnsIcon>

          <SnsIcon
            href="https://x.com/busanfilmfest"
            target="_blank"
            rel="noopener noreferrer"
            bgColor="#1DA1F2"
          >
            <Twitter size={32} />
          </SnsIcon>

          <SnsIcon
            href="https://www.instagram.com/busanfilmfest/"
            target="_blank"
            rel="noopener noreferrer"
            bgColor="#E4405F"
          >
            <Instagram size={32} />
          </SnsIcon>

          <SnsIcon
            href="https://www.youtube.com/channel/UCJB3MxLQsak5tT-Yvod2alA"
            target="_blank"
            rel="noopener noreferrer"
            bgColor="#FF0000"
          >
            <Youtube size={32} />
          </SnsIcon>
        </SnsIconContainer>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: '0.8' }}>
          <p>📱 최신 BIFF 소식과 비하인드 스토리를 만나보세요!</p>
          <p>🎬 독점 인터뷰, 레드카펫 현장, 영화제 하이라이트까지</p>
        </div>
      </SnsSection>

      <div style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white', borderRadius: '15px', padding: '2rem', marginTop: '2rem' }}>
        <h3>⚠️ 예매 시 주의사항</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem' }}>
            <h4>🎫 티켓 구매</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6' }}>
              <li>1인당 최대 4매까지 구매 가능</li>
              <li>예매 취소는 상영 2시간 전까지</li>
              <li>현장 발권 시 신분증 지참 필수</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem' }}>
            <h4>⏰ 입장 안내</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6' }}>
              <li>상영 30분 전부터 입장 가능</li>
              <li>상영 시작 후 입장 제한</li>
              <li>지정좌석제 운영</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem' }}>
            <h4>📱 모바일 티켓</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6' }}>
              <li>QR코드 화면 캡처 금지</li>
              <li>배터리 방전 주의</li>
              <li>밝기 조절로 인식률 향상</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '1rem' }}>
            <h4>🎬 관람 에티켓</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem', lineHeight: '1.6' }}>
              <li>휴대폰 무음 모드 설정</li>
              <li>상영 중 촬영 금지</li>
              <li>음식물 반입 제한</li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h4>🆘 예매 문의</h4>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>BIFF 고객센터:</strong> 051-709-4114<br />
            <strong>운영시간:</strong> 평일 09:00-18:00<br />
            <strong>이메일:</strong> info@biff.kr
          </p>
          <p style={{ fontSize: '0.9rem', opacity: '0.9', margin: '1rem 0 0 0' }}>
            예매 관련 문의사항이 있으시면 언제든 연락주세요!
          </p>
        </div>
      </div>
    </Container>
  );
};

export default BiffSchedule;