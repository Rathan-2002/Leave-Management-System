const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/register', accountController.showRegister);
router.post('/register', accountController.registerUser);
router.get('/login', accountController.showLogin);
router.post('/login', accountController.loginUser);
router.get('/logout', accountController.logoutUser);

module.exports = router;