const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const stopwords = new Set(natural.stopwords);

/**
 * TF-IDF : 문서 내에서 특정 단어의 중요도를 나타내는 통계적 수치
 * TF (Term Frequency): 특정 단어가 문서 내에서 얼마나 자주 등장하는지 표시.
 * TF(t,d) = (단어 t의 문서 d내 출현 횟수) / (문서 d의 전체 단어 수)
 * IDF (Inverse Document Frequency): 특정 단어가 전체 문서 집합에서 얼마나 희귀한지 표시.
 * IDF(t) = log(전체 문서 수 / 단어 t가 포함된 문서 수)
 * TF-IDF(t,d) = TF(t,d) * IDF(t)
*/
class CardSearchAlgorithm {
  
  //검색 엔진 객체를 초기화
  //documents (문서 저장), index (역인덱스), idf (역문서 빈도) 초기화합니다.
  constructor() {
    this.documents = [];
    this.index = {};
    this.idf = {};
  }
  /**새 문서를 검색 엔진에 추가합니다.
   * 
   * 문서를 토큰화하고, 단어 빈도를 계산
   * 문서 정보를 documents 배열에 저장합니다.
   * 역인덱스를 업데이트합니다.
   * @param {INTEGER} id 문서의 id 
   * @param {String} text 문서의 내용 
   */
  addDocument(id, text) {
    const tokens = this.tokenize(text);
    const termFrequency = this.calculateTermFrequency(tokens);
    
    this.documents.push({ id, text, termFrequency });
    this.updateIndex(id, termFrequency);
  }

  /**텍스트를 토큰화하고 전처리합니다.
   * 
   * 텍스트를 소문자로 변환.
   * 단어로 분리.
   * 불용어를 제거.
   * 각 단어의 어간을 추출.
   * @param {String} text 
   * @returns 전처리된 토큰 배열 
   */
  tokenize(text) {
    return tokenizer.tokenize(text.toLowerCase())
      .filter(token => !stopwords.has(token))
      .map(token => stemmer.stem(token));
  }

  /**주어진 토큰 배열에서 각 토큰이 몇 번 등장했는지 계산하여 각 단어의 빈도를 계산.
   * @param {tokens} tokens  토큰화된 단어 배열
   * @returns 각 단어의 빈도를 나타내는 객체
   */
  calculateTermFrequency(tokens) {
    const termFrequency = {};
    tokens.forEach(token => {
      termFrequency[token] = (termFrequency[token] || 0) + 1;
    });
    return termFrequency;
  }

  /**역인덱스를 업데이트한다.
   * 
   * 각 단어에 대해서 어떤 문서에 몇 번 등장했는지 기록.
   * 
   * @param {*} id 문서 ID
   * @param {*} termFrequency 해당 문서의 단어 빈도 객체
   */
  updateIndex(id, termFrequency) {
    Object.keys(termFrequency).forEach(term => {
      if (!this.index[term]) {
        this.index[term] = {};
      }
      this.index[term][id] = termFrequency[term];
    });
  }
  /** 모든 단어의 IDF(역문서 빈도)를 계산.
   * 
   * 전체 문서 수를 구합니다.
   * 각 단어가 등장한 문서 수를 계산합니다.
   * IDF 공식(log(전체 문서 수 / 단어가 등장한 문서 수))을 적용합니다.
   */
  calculateIDF() {
    const N = this.documents.length;
    Object.keys(this.index).forEach(term => {
      const docFrequency = Object.keys(this.index[term]).length;
      this.idf[term] = Math.log(N / docFrequency);
    });
  }
  /**주어진 쿼리로 문서를 검색합니다.
   * 
   * 쿼리를 토큰화합니다.
   * IDF를 계산합니다.
   * 각 문서에 대해 TF-IDF 점수를 계산합니다.
   * 점수에 따라 문서를 정렬합니다.
   * 정렬된 결과를 반환합니다.
   *
   * @param {*} query 검색할 쿼리 문자열
   * @returns 관련성 점수로 정렬된 검색 결과 배열
   */
  search(query) {
    const queryTokens = this.tokenize(query);
    const scores = {};

    this.calculateIDF();

    this.documents.forEach(doc => {
      let score = 0;
      queryTokens.forEach(token => {
        if (this.index[token] && this.index[token][doc.id]) {
          const tf = this.index[token][doc.id] / Object.values(doc.termFrequency).reduce((a, b) => a + b);
          const idf = this.idf[token];
          score += tf * idf;
        }
      });
      scores[doc.id] = score;
    });

    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([id, score]) => ({
        id: parseInt(id),
        score,
        text: this.documents.find(doc => doc.id === parseInt(id)).text
      }));
  }
};

module.exports = CardSearchAlgorithm;