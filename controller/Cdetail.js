const db = require('../models');
const { sequelize } = require('../models'); 

// 카드정보 및 좋아요 수 조회 함수 
const getCardDetails = async (cardId) => {
    // 카드 조회
    const card = await db.Card.findOne({
        where:{card_id : cardId},
        include:[{
            model : db.Benefit,
            attributes:['category_name','benefit_details'],
        }],
        attributes:['card_image','card_name','card_corp','card_id']
    });
    console.log('card >>>>',card);
    console.log('card.Benefit >>>>',card.Benefits);
    
    
    // 해당 카드의 좋아요 수 조회
    const likesCount = await db.CardLike.count({ where: { card_id: cardId } }) || 0;
    
    console.log('likesCOunt >>>>',likesCount);
    
    return { card, likesCount };
};

// 카드 상세 정보 및 좋아요 수  -> detail.ejs 전달(초기 페이지 로딩 시)
const showCardDetails = async (req, res) => {
    // url 경로매개변수(라우트에서 설정됨!)에서 카드ID가져오기 
    const cardId = req.params.cardId;
    try {
        const { card, likesCount } = await getCardDetails(cardId);
        // 조회된 카드가 존재한다면! 
        if (card) {
            res.render('detail', { 
                card, 
                likesCount,
                isLoggedIn: !!req.user 

                // 로그인 상태 확인 및 전달 (라우트에서 보낸 미들웨어 authenticateToken으로 확인함!)
                //authenticateToken는 요청의 헤더에 포함된 JWT(또는 다른 형태의 토큰)를 검증하고, 유효한 경우 사용자 정보를 req.user에 저장함.
                //req.user = { userId: 1, iat: 1720925636, exp: 1720929236 }
                // 여기서는 req.user( 추후 다른이름으로 변경하기!! ) 를 내보내는 게 아니라 req.user가 존재하는지 확인하는 거라 괜찮지 않을까 싶음! 
                
                // 가장 좋은 방법은 req.user에 userId만 내보내는 방법으로!!! 
            });
        } else {
            res.status(404).send('해당 카드를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('Error fetching card details:', error);
        res.status(500).send('Internal Server Error');
    }
};


//좋아요 버튼을 눌렀을 때!! > 좋아요 추가 및 취소 / 좋아요 수 갱신 
const toggleLike = async (req, res) => {
    // 값 존재 여부로 로그인 상태 확인 (라우트에서 보낸 미들웨어 authenticateToken으로 확인)
    // 이 확인은 authenticateToken 미들웨어가 req.user를 설정했는지 여부를 확인하는 역할을 함
    // 만약 설정되지 않았다면, 사용자가 로그인하지 않은 상태임 
    if (!req.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    
    // req.user가 존재하는 경우, 사용자가 로그인한 상태로 간주하고,(if문)
    // 요청 본문에서 cardId를 가져옴. 
    const { cardId } = req.body;

    //req.user.userId를 사용하여 좋아요 추가
    //req.user에서 userId 값만 가져오는거임! 
    const userId = req.user.userId; 

    // * sequelize 트랜잭션 시작 * : 
    const transaction = await sequelize.transaction();

    try {
        // 유저 아이디를 통해 현재 사용자가 해당 카드에 이미 좋아요 눌렀는지 확인
        // 좋아요를 눌렀으면 ' existingLike' 아니면 'null' 반영 
        // 트랜잭션 객체 사용해서 기존 좋아요 확인 
        const existingLike = await db.CardLike.findOne({ 
            where: { user_id: userId, card_id: cardId },
            transaction
        });
        
        // 이미 좋아요를 누른 사용자라면! 
        // 트랜잭션 객체 사용해서 좋아요 추가 또는 삭제 
        if (existingLike) {
            // 좋아요 삭제! 
            await existingLike.destroy({ transaction });
        } else {
            // 좋아요 추가! 
            await db.CardLike.create({ user_id: userId, card_id: cardId }, { transaction });
        }
        
        // 좋아요 수 갱신 (트랜잭션 객체 사용)
        const likesCount = await db.CardLike.count({ 
            where: { card_id: cardId },
            transaction 
        });
         // 모든 작업이 성공적으로 완료되면 트랜잭션 커밋함 -> 
         // 데이터베이스에서 트랜잭션 내의 모든 작업이 성공적으로 완료되었음을 선언, 
         // 트랜잭션 내에서 수행된 모든 데이터베이스 변경 사항을 영구적으로 저장함! 
        await transaction.commit();
        res.status(200).json({ likesCount });
    } catch (error) {
        // 작업 중 오류가 발생하면 모든 변경사항을 취소하고 데이터의 일관성을 유지함 
        await transaction.rollback();
        console.error('Error toggling like:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    showCardDetails,
    toggleLike
};