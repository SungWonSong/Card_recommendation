const express = require('express');
const controller = require('../controller/CSearch');
const router = express.Router();

router.get('/search', controller.getCardDetails);
router.get('/category', controller.getCardByCategory);

module.exports = router;
