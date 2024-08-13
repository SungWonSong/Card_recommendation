const express = require('express');
const router = express.Router();
const commentController = require('../controller/CComment');
const { authenticateToken } = require('../middleware/token'); // 여기에 변경 사항 있습니다

// 댓글 페이지 보여주기
router.get('/', authenticateToken, commentController.showComments);

// 댓글 추가하기
router.post('/', authenticateToken, commentController.addComment);

// 댓글 수정하기
router.patch('/edit/:id', authenticateToken, commentController.editComment);

// 댓글 삭제하기
router.delete('/delete/:id', authenticateToken, commentController.deleteComment);

// 댓글 좋아요 토글
router.post('/like', authenticateToken, commentController.toggleLike);

module.exports = router;