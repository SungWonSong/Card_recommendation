const express = require('express');
const controller = require('../controller/Cindex');
const router = express.Router();

router.get('/', controller.cover);
router.get('/index', controller.main);

module.exports = router;