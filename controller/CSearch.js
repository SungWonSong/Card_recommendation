const SearchAlgorithm = require('../utils/SearchAlgorithm');
const search = new SearchAlgorithm();
const { Card } = require('../models/index');

// 서버 시작 시 한 번만 실행
const bootSearchEngine = async () => {
  try {
    await search.setUpData();
    console.log('Search engine initialized successfully');
  } catch (err) {
    console.error('Failed to initialize search engine:', err);
  }
};

bootSearchEngine();
console.log('setUpData 실행됨');

exports.getCardDetails = async (req, res) => {
  try {
    const query = req.query.query;
    
    if (!query) {
      return res.status(400).send('Search query is required');
    }

    const searchResults = search.search(query);
    // console.log('searchResults >>>>', searchResults);

    const cardDetails = await Promise.all(searchResults.map(async (result) => {
      const card = await Card.findByPk(result.cardId);
      return {
        card_id: card.card_id,
        card_name: card.card_name,
        card_image: card.card_image,
      };
    }));
    if(cardDetails.length === 0){
      return res.render('404', { msg: '검색결과가 없습니다.' });
    }
    // console.log('cardDetails >>>>> ', cardDetails);
    
    res.render('search', { cards: cardDetails });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).send('Server Error');
  }
};