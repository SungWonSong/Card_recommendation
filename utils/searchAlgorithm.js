const { Benefit } = require('../models');


/**
 * TF-IDF : 문서 내에서 특정 단어의 중요도를 나타내는 통계적 수치
 * TF (Term Frequency, 단어 빈도 ): 특정 단어가 문서 내에서 얼마나 자주 등장하는지 표시.
 * TF(t,d) = (단어 t의 문서 d내 출현 횟수) / (문서 d의 전체 단어 수)
 * IDF (Inverse Document Frequency , 역문서 빈도 ): 특정 단어가 전체 문서 집합에서 얼마나 희귀한지 표시.
 * IDF(t) = log(전체 문서 수 / 단어 t가 포함된 문서 수)
 * TF-IDF(t,d) = TF(t,d) * IDF(t)
*/
class SearchAlgorithm {
  
  // 생승자
  constructor() {
    /** 데이터셋 객체 구조 ( benefit 테이블에 대해서 검색을 진행 )
     * {
     *   id: benefit.benefit_id,
     *   cardId: benefit.card_id,
     *   detail: benefit.benefit_detail
     * }
     */
    this.entireDocDataSet = [];
    this.index = {};
    this.idf = {};
  }

  /**
   * TF-IDF 계산에 필요한 전체 문서 데이터셋을 구성하는 함수
   * 서버 시작 시 호출되어 메모리에 데이터를 로드하고, 서버 종료 시까지 유지됨
   * 검색 기능 사용 시마다 이 데이터셋을 활용함
   * @async
   * @throws {Error} 데이터베이스 조회 중 오류 발생 시 반환될 에러
   */
  async setUpData() {
    try {
      const benefits = await Benefit.findAll({
        attributes: ['benefit_id', 'card_id', 'benefit_details']
      });

      this.entireDocDataSet = benefits.map( benefit => ({
        id: benefit.benefit_id,
        cardId: benefit.card_id,
        details: benefit.benefit_details
      }));

      this.buildIndex();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**목적: 주어진 텍스트를 의미 있는 토큰( 단어? 별로 분리해서 원자화 함 )으로 분리
   * 
   * 텍스트를 소문자화하고 특수문자를 제거
   * 단어로 분리하고 불용어( 없어도 문서의 의미에 영향을 주지 않아 검색 전처리 과정에서 제거 )를 제거
   * 1글자 토큰과 숫자( 단위가 붙어있는 숫자는 제거되지 않음 )만으로 이루어진 토큰을 제거
  */
  tokenize(text) {
    if (typeof text !== 'string') {
      console.error('Invalid input for tokenize:', text);
      return [];
    }
    // 한글 불용어
    const koreanStopwords = new Set(['은', '는', '이', '가', '을', '를', '의', '와', '과', '으로', '로', '에', '에서', '도']);

    const cleanedText = text.replace(/[^가-힣a-zA-Z0-9]/g, ' ');
    const tokens = cleanedText.split(/\s+/).filter(token => token.length > 0);

    return tokens.filter(token => 
      token.length > 1 && // 1글자 토큰 제거
      !koreanStopwords.has(token) && // 불용어 제거
      !/^\d+$/.test(token) // 숫자만으로 이루어진 토큰 제거
    );
  }

  /** 주어진 문자열에서 특정 단어의 빈도수를 계산
   * 정규표현식을 사용하여 단어의 출현 횟수를 카운트 함
   * 
   * @param {string} str 검색 데이터셋
   * @param {string} word 검색 대상
   * @returns 
   */
  countFreq(str, word) {
    const regex = new RegExp(word, 'gi');
    const matches = str.match(regex);
    return matches ? matches.length : 0;
  }

  /** 전체 문서 데이터셋을 기반으로 검색 인덱스를 구축
   *  
   * 각 문서의 텍스트를 토큰화
   * 각 토큰에 대해 문서 ID와 빈도수를 인덱스에 저장
   * calculateIDF()를 호출하여 IDF 값을 계산
   */
  buildIndex() {
    this.entireDocDataSet.forEach(doc => {
      const tokens = this.tokenize(doc.details);
      tokens.forEach(token => {
        if (!this.index[token]) {
          this.index[token] = {};
        }
        this.index[token][doc.id] = this.countFreq(doc.details, token);
      });
    });
    this.calculateIDF();
  }

  /** 각 단어의 IDF 값을 계산
   */
  calculateIDF() {
    const N = this.entireDocDataSet.length;
    Object.keys(this.index).forEach(term => {
      const docFrequency = Object.keys(this.index[term]).length;
      this.idf[term] = Math.log(N / docFrequency);
    });
  }

  /** 특정 문서 내에서 특정 단어의 TF 값을 계산
   * 
   * @param {number} docId  
   * @param {string} term 
   * @returns 
   */
  calculateTF(docId, term) {
    const doc = this.entireDocDataSet.find(doc => doc.id === docId);
    const termCount = this.index[term][docId] || 0;
    const totalTerms = this.tokenize(doc.details).length;
    return termCount / totalTerms;
  }

  /** 검색을 진행하는 메서드
   * 쿼리를 토큰화
   * 각 문서에 대해 TF-IDF 점수를 계산
   * 각 카드 ID에 대해 가장 높은 점수를 가진 혜택만 선택
   * 결과를 점수 순으로 정렬하여 반환
   * 
   * @param {*} query 
   * @returns 
   */
  search(query) {
    const queryTokens = this.tokenize(query);
    const result = {};

    this.entireDocDataSet.forEach(doc => {
      let score = 0;
      queryTokens.forEach(token => {
        Object.keys(this.index).forEach(indexToken => {
          if (indexToken.includes(token) && this.index[indexToken][doc.id]) {
            const tf = this.index[indexToken][doc.id];
            const idf = this.idf[indexToken];
            score += tf * idf;
          }
        });
      });
      if (score > 0) {
        if (!result[doc.cardId] || result[doc.cardId].score < score) {
          result[doc.cardId] = { id: doc.id, score, detail: doc.details };
        }
      }
    });
    
    return Object.entries(result)
      .map(([cardId, data]) => ({
        id: data.id,
        cardId: parseInt(cardId),
        score: data.score,
        detail: data.detail
      }))
      .sort((a, b) => b.score - a.score);
  }
}

module.exports = SearchAlgorithm;