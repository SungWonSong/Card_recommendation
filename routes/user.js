const express = require('express');
const controller = require('../controller/Cuser');
const {authenticateToken, checkLoginStatus} = require('../middleware/token');
const router = express.Router();

router.get('/signup', controller.signUp);
router.post('/signup', controller.postsignUp);
router.get('/login', controller.logIn);
router.post('/login', controller.postlogIn);
router.post('/logout', controller.logout);
router.get('/authenticateToken', authenticateToken, checkLoginStatus);

// 닉네임, 아이디 중복검사를 모델에서 실시하고 있지만, 
// 실시간으로 중복검사를 프론트엔드에서 수행하려면 라우트 필요 
router.post('/check-nickname', controller.checkDuplicateNickname); // 닉네임 중복 확인
router.post('/check-userId', controller.checkDuplicateId); // 아이디 중복 확인

module.exports = router;