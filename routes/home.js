const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.showHome);
router.get('/home', homeController.showHome);

module.exports = router;