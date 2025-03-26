const express = require('express');
const router = express.Router();
const leaveSuggestionController = require('../controllers/leaveSuggestionController');
const auth = require('../middleware/auth'); // Middleware to authenticate user sessions

// Route for leave suggestions
// router.get('/leave-suggestions', auth, leaveSuggestionController.suggestLeave);

// Route for Calendarific API testing
router.get('/calendarific', async (req, res) => {
  // Debugging
  console.log("▶ Query Parameters:", {
    api_key: process.env.CALENDARIFIC_API_KEY,
    country: req.query.countryCode,
    year: req.query.year
  });

  const { apiKey, countryCode, year } = req.query;
  if (!apiKey || !countryCode || !year) {
    return res.status(400).json({ error: 'Missing required parameters: apiKey, countryCode, or year' });
  }

  try {
    const response = await axios.get('https://calendarific.com/api/v2/holidays', {
      params: { api_key: apiKey, country: countryCode, year: year }
    });
    console.log("▶ API Response:", response.data); // Debugging
    res.json({ holidays: response.data.response.holidays });
  } catch (error) {
    console.error("▶ Error fetching holidays:", error.message);
    res.status(500).json({ error: 'Failed to fetch holidays from Calendarific API' });
  }
});

module.exports = router;
