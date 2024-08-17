const db = require('../models');
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
const getCardByCategory = async (req, res) => {
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

module.exports = {
    getCardByCategory
};












