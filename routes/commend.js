const express = require('express');
const controller = require('../controller/CCommend');
const router = express.Router();

router.get('/', controller.getCardByCategory);

module.exports = router;