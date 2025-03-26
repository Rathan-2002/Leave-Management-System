const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const leaveSuggestionController = require('../controllers/leaveSuggestionController');
const auth = require('../middleware/auth');

router.get('/apply', auth, leaveController.showApplyLeave);
router.post('/apply', auth, leaveController.applyLeave);
router.get('/status', auth, leaveController.showLeaveStatus);
router.get('/suggestions', auth, leaveSuggestionController.suggestLeave);

module.exports = router;


