const router = require('express').Router();
const axios = require('axios');
const Review = require('../models/Review');

router.get('/:imdbID', async (req, res) => {
  try {
    const { imdbID } = req.params;
    console.log('Fetching movie and reviews for IMDb ID:', imdbID);
    console.log('Using OMDb API Key:', process.env.OMDB_API_KEY);

    const [omdbRes, localReviews] = await Promise.all([
      axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.OMDB_API_KEY}`),
      Review.find({ imdbID }).sort({ createdAt: -1 })
    ]);

    console.log('OMDb movie fetched:', omdbRes.data.Title);
    console.log('Number of local reviews:', localReviews.length);

    res.json({
      movie: omdbRes.data,
      reviews: localReviews
    });
  } catch (err) {
    console.error('Error fetching movie or reviews:', err);
    res.status(500).json({
      message: 'Failed to fetch movie info',
      error: err.message
    });
  }
});

module.exports = router;
