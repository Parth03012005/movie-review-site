const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
};

exports.createReview = async (req, res) => {
  const newReview = new Review(req.body);
  const saved = await newReview.save();
  res.json(saved);
};
