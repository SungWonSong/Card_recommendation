const { Card } = require('../models');
const { Op } = require('sequelize'); // Sequelize의 Op 객체 가져오기
exports.getCardDetails = async (req, res) => {
    try {
        const query = req.query.query; // 검색어 받기
        const condition = {};
        // // 검색어에 따라 조건 설정
        // if (query === "교통") {
        //     condition.traffic_ox = true;
        //     console.log("교통 조건 적용");
        // } else if (query === "편의점") {
        //     condition.store_ox = true;
        //     console.log("편의점 조건 적용");
        // } else if (query === "카페") {
        //     condition.cafe_ox = true;
        //     console.log("카페 조건 적용");
        // } else if (query === "구독") {
        //     condition.sub_ox = true;
        //     console.log("구독 조건 적용");
        // } else if (query === "서적") {
        //     condition.book_ox = true;
        //     console.log("서적 조건 적용");
        // } else {
            // 그 외의 검색어는 card_name을 조건으로 설정
        condition.card_name = {
            [Op.like]: `%${query}%`
        };
        console.log("기타 검색어 조건 적용");
        // }
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