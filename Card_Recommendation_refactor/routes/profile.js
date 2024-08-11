const express = require('express');
const controller = require('../controller/CProfile');
const router = express.Router();
const { authenticateToken } = require('../middleware/token'); // 변경된 부분: 중괄호 추가

router.get('/', authenticateToken, controller.getProfile);
router.patch('/edit', authenticateToken, controller.patchProfile);
router.delete('/delete', authenticateToken, controller.deleteProfile);
router.delete('/comments/:commentId', authenticateToken, controller.deleteComment);
router.delete('/cards/unlike/:cardId', authenticateToken, controller.unlikeCard);

module.exports = router;