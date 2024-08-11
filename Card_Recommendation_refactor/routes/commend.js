const express = require('express');
const controller = require('../controller/CCommend');
const router = express.Router();

router.get('/', controller.showTop3Cards);

module.exports = router;