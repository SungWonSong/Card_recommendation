const db = require('../models');
// 모델에서 혜택 top3 조회 함수
const getTop3Cards = async (category) => {
    console.log('getTop3Cards 실행');
    
    // 카테고리 이름 + '_ranking' > 카드모델에서 지정된 랭킹 관련 컬럼명 규칙!
    const cards = await db.Benefit.findAll({
        where: {
            category_name:category,
        },
        // top3 가져오기!
        order: [['benefit_ranking', 'ASC']],
        limit: 3
    });
    console.log('cards>>>>>>>>>>',cards);
    
    // 각 카드에 대한 상위 2개의 댓글 가져오기
    for (const card of cards) {
        const comments = await db.Comment.findAll({
            where: { card_id: card.card_id },
            include: [{
                model: db.User,
                attributes: ['nickname'],
            }],
            attributes: {
                include: [
                    [
                        db.Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM CommentLike AS cl
                            WHERE cl.comment_id = Comment.comment_id
                        )`),
                        'likeCount'
                    ]
                ]
            },
            order: [
                [db.Sequelize.literal('likeCount'), 'DESC'],
                ['createdAt', 'DESC']
            ],
            limit: 2
        });
        card.comments = comments; // 카드 객체에 댓글 추가
    }
    return cards;
};
// 가져온 혜택 top3 -> commend.ejs 전달
const showTop3Cards = async (req, res) => {
    const category = req.query.category;
    try {
        console.log('1');
        const cards = await getTop3Cards(category);
        console.log('2');
        res.render('commend', { category, cards });
        console.log('3');
        
        // 여기서 카테고리값이랑 top3카드 정보 프론트에 전달!
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
    showTop3Cards
};












