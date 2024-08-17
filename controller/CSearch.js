const SearchAlgorithm = require('../utils/searchAlgorithm');
const db = require('../models');
const search = new SearchAlgorithm();
const { Card } = require('../models/index');
const { Op } = require('sequelize'); // 

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
    if (cardDetails.length === 0) {
      const cards = await Card.findAll({
        where: { card_name: { [Op.like]: `%${query}%` } },
        attributes: ['card_id', 'card_name', 'card_image'],
      });
      
      cardDetails.push(...cards.map(card => ({
        card_id: card.card_id,
        card_name: card.card_name,
        card_image: card.card_image,
      })));
    }
    // console.log('cardDetails >>>>> ', cardDetails);
    
    res.render('search', { cards: cardDetails });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).send('Server Error');
  }
};




// 모델에서 혜택 top3 조회 함수
const searchByCategory = async (category) => {
    // console.log('getTop3Cards 실행');
    // console.log('category >>>>>',category);
    
    
    // 카테고리 이름 + '_ranking' > 카드모델에서 지정된 랭킹 관련 컬럼명 규칙!
    const cards = await db.Benefit.findAll({
        where: {
            category_name : category,
        },
        include: [{
            model: db.Card,
            attributes: ['card_id','card_name','card_image'],
        }],
        attributes: ['card_id', 'category_name']
    });
    return cards;
};

// 가져온 혜택 top3 -> commend.ejs 전달
exports.getCardByCategory = async (req, res) => {
    const category = req.query.category;
    try {
        const cards = await searchByCategory(category);
        const cardDetails = cards.map(card => ({
            card_id: card.Card.card_id,
            card_name: card.Card.card_name,
            card_image: card.Card.card_image,
            category_name: card.category_name
        }));
        res.render('search', { category, cards: cardDetails });
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).send('Internal Server Error');
    }
};


