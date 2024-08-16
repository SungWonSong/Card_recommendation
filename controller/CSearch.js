const searchAlgorithm = require('../utils/searchAlgorithm');

const { Card } = require('../models');
const { Op } = require('sequelize'); // Sequelize의 Op 객체 가져오기

exports.getCardDetails = async (req, res) => {
    try {
        const query = req.query.query; // 검색어 받기
        const condition = {};
        
        condition.card_name = {
            [Op.like]: `%${query}%`
        };
        
        console.log("기타 검색어 조건 적용");
    
        const cards = await Card.findAll({
            where: condition,
            attributes: ['card_id','card_name','card_image'],
        });
        console.log(`검색된 카드 수: ${cards.length}`);
        res.render('search', { cards });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}; 

