class MovieService {
  constructor() {
    this.tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
    this.koficApiKey = process.env.REACT_APP_KOFIC_API_KEY;
    this.tmdbBaseUrl = process.env.REACT_APP_TMDB_BASE_URL;
    this.kobisBaseUrl = process.env.REACT_APP_KOBIS_BASE_URL;
    this.tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  }

  // TMDB에서 영화 검색 (한국어 우선, 영어 대체)
  async searchMovies(query, language = 'ko-KR') {
    try {
      // 먼저 한국어로 검색
      let response = await fetch(
        `${this.tmdbBaseUrl}/search/movie?api_key=${this.tmdbApiKey}&query=${encodeURIComponent(query)}&language=${language}&page=1`
      );
      let data = await response.json();
      
      // 결과가 없으면 영어로 다시 검색
      if (!data.results || data.results.length === 0) {
        response = await fetch(
          `${this.tmdbBaseUrl}/search/movie?api_key=${this.tmdbApiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`
        );
        data = await response.json();
      }
      
      return data.results || [];
    } catch (error) {
      console.error('영화 검색 오류:', error);
      return [];
    }
  }

  // TMDB에서 인기 영화 가져오기
  async getPopularMovies(language = 'ko-KR') {
    try {
      const response = await fetch(
        `${this.tmdbBaseUrl}/movie/popular?api_key=${this.tmdbApiKey}&language=${language}&page=1`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('인기 영화 가져오기 오류:', error);
      return [];
    }
  }

  // TMDB에서 현재 상영중인 영화 가져오기
  async getNowPlayingMovies(language = 'ko-KR') {
    try {
      const response = await fetch(
        `${this.tmdbBaseUrl}/movie/now_playing?api_key=${this.tmdbApiKey}&language=${language}&region=KR&page=1`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('현재 상영작 가져오기 오류:', error);
      return [];
    }
  }

  // TMDB에서 영화 상세 정보 가져오기
  async getMovieDetails(movieId, language = 'ko-KR') {
    try {
      const response = await fetch(
        `${this.tmdbBaseUrl}/movie/${movieId}?api_key=${this.tmdbApiKey}&language=${language}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('영화 상세 정보 오류:', error);
      return null;
    }
  }

  // 영화 포스터 URL 생성
  getPosterUrl(posterPath, size = 'w500') {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  // 영화 백드롭 URL 생성
  getBackdropUrl(backdropPath, size = 'w1280') {
    if (!backdropPath) return null;
    return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
  }

  // KOBIS 박스오피스 데이터 가져오기
  async getBoxOffice(targetDate) {
    try {
      const response = await fetch(
        `${this.kobisBaseUrl}?key=${this.koficApiKey}&targetDt=${targetDate}`
      );
      const data = await response.json();
      return data.boxOfficeResult?.dailyBoxOfficeList || [];
    } catch (error) {
      console.error('박스오피스 데이터 오류:', error);
      return [];
    }
  }

  // BIFF 관련 영화 검색 (아시아 영화, 독립영화 등)
  async getBiffRelatedMovies() {
    try {
      const queries = ['부산국제영화제', '아시아영화', '독립영화', '한국영화'];
      const allMovies = [];

      for (const query of queries) {
        const movies = await this.searchMovies(query);
        allMovies.push(...movies.slice(0, 5)); // 각 카테고리에서 5개씩
      }

      // 중복 제거
      const uniqueMovies = allMovies.filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      );

      return uniqueMovies.slice(0, 20); // 최대 20개
    } catch (error) {
      console.error('BIFF 관련 영화 검색 오류:', error);
      return [];
    }
  }

  // 영화 장르 ID를 한국어 이름으로 변환
  getGenreName(genreId) {
    const genres = {
      28: '액션',
      12: '모험',
      16: '애니메이션',
      35: '코미디',
      80: '범죄',
      99: '다큐멘터리',
      18: '드라마',
      10751: '가족',
      14: '판타지',
      36: '역사',
      27: '공포',
      10402: '음악',
      9648: '미스터리',
      10749: '로맨스',
      878: 'SF',
      10770: 'TV 영화',
      53: '스릴러',
      10752: '전쟁',
      37: '서부'
    };
    return genres[genreId] || '기타';
  }

  // 영화 평점을 별점으로 변환
  getRatingStars(rating) {
    const stars = Math.round(rating / 2); // 10점 만점을 5점 만점으로 변환
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  }

  // 개봉일 포맷팅
  formatReleaseDate(dateString) {
    if (!dateString) return '미정';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export { MovieService };