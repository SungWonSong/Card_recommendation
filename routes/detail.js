const express = require('express');
const router = express.Router();
const detailController = require('../controller/Cdetail');
const { authenticateToken } = require('../middleware/token'); // authenticateToken 미들웨어로 사용!


// 카드 상세 페이지 라우트
router.get('/:cardId', authenticateToken, detailController.showCardDetails);

// 카드 좋아요 라우트
router.post('/likeCard', authenticateToken, detailController.toggleLikeCard);

// 댓글 페이지 보여주기
router.get('/', authenticateToken, detailController.showComments);

// 댓글 추가하기
router.post('/', authenticateToken, detailController.addComment);

// 댓글 수정하기
router.patch('/edit/:id', authenticateToken, detailController.editComment);

// 댓글 삭제하기
router.delete('/delete/:id', authenticateToken, detailController.deleteComment);

// 댓글 좋아요 토글
router.post('/likeComment', authenticateToken, detailController.toggleLike);


module.exports = router;