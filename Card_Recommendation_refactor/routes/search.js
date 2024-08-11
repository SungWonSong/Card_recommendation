const express = require('express');
const controller = require('../controller/CSearch');
const router = express.Router();

router.get('/', controller.getCardDetails);

module.exports = router;
