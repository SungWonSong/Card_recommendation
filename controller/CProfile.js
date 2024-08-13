const { User, Comment, CardLike, Card } = require('../models');

// 프로필 정보 가져오기 
exports.getProfile = async (req, res) => {
    try {
         // req.user.userId = 토큰에 있는 userId 값으로 DB 조회 = 12
        const user = await User.findByPk(req.user.userId, {
            // 댓글, 좋아요한 카드 정보 추가로 가져오기 
            include: [
                { model: Comment },
                { model: CardLike, include: [{ model: Card }] }
            ]
        });
        if (!user) return res.sendStatus(404);

        // DB에서 조회된 내용에서 원하는 값 내보내기! 
        res.render('profile', { nickname: user.nickname, comments: user.Comments, likedCards: user.CardLikes.map(like => like.Card) });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send({ message: '프로필 데이터를 가져오는 중 오류가 발생했습니다.' });
    }
};

// 프로필 get으로 정보 내보내기 
exports.patchProfile = async (req, res) => {
    try {
        // 요청 본문(req.body)에서 nickname 값 추출
        const { nickname } = req.body;
        // DB.user에서 토큰의 id값과 같은 user 찾기 
        // findByPk는 기본 키(primary key)를 기준으로 사용자를 찾는 메서드임
        const user = await User.findByPk(req.user.userId);
        if (!user) return res.sendStatus(404);

        // 여기서 닉네임 변경 -> 찾은 사용자 객체의 nickname 속성을 요청에서 받은 새로운 닉네임으로 설정! 
        user.nickname = nickname;
        // 변경된 사용자 객체를 데이터베이스에 저장
        await user.save();
        // 닉네임 업데이트가 성공하면 JSON 형식으로 성공 메시지를 클라이언트에게 응답함. 
        res.json({ message: 'Profile updated' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
    }
};

// 프로필 삭제 
exports.deleteProfile = async (req, res) => {
    try {
        // DB.user에서 토큰의 id값과 같은 user 찾기 
        // findByPk는 기본 키(primary key)를 기준으로 사용자를 찾는 메서드임
        const user = await User.findByPk(req.user.userId);
        if (!user) return res.sendStatus(404);

        // DB에서 유저 삭제! 
        await user.destroy();
        res.json({ message: '회원탈퇴되었습니다.' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).send({ message: '프로필 삭제 중 오류가 발생했습니다.' });
    }
};

// 내가 쓴 댓글 삭제 
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        console.log('댓글삭제 -> 내가 쓴 댓글 아이디값? req,params', req.params);
        const comment = await Comment.findByPk(commentId);
        if (!comment || comment.userid !== req.user.userId) return res.sendStatus(404);
        await comment.destroy();
        res.json({ message: '댓글이 삭제되었습니다.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send({ message: '댓글 삭제 중 오류가 발생했습니다.' });
    }
};

// 내가 좋아요한 카드 삭제 
exports.unlikeCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const cardLike = await CardLike.findOne({ where: { user_id: req.user.userId, card_id: cardId } });
        if (!cardLike) return res.sendStatus(404);

        await cardLike.destroy();
        res.json({ message: '좋아요가 취소되었습니다.' });
    } catch (error) {
        console.error('Error unliking card:', error);
        res.status(500).send({ message: '좋아요 취소 중 오류가 발생했습니다.' });
    }
};

exports.getLikedCards = async (req, res) => {
    try {
        const likedCards = await CardLike.findAll({
            where: { user_id: req.user.userId },
            include: [{ model: Card }]
        });

        res.json(likedCards.map(like => like.Card));
    } catch (error) {
        console.error('Error fetching liked cards:', error);
        res.status(500).send({ message: '좋아요한 카드를 가져오는 중 오류가 발생했습니다.' });
    }
};