const router = require('express').Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// POST: Add new review (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const newReview = new Review({
      imdbID: req.body.imdbID,
      reviewer: req.user.username,
      comment: req.body.comment,
      rating: req.body.rating
    });
    const saved = await newReview.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
});

// ✅ GET: Fetch reviews by imdbID (public)
router.get('/', async (req, res) => {
  try {
    const { imdbID } = req.query;
    if (!imdbID) {
      return res.status(400).json({ message: 'imdbID is required' });
    }

    const reviews = await Review.find({ imdbID }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
});

module.exports = router;
