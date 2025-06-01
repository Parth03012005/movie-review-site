// src/components/MovieDetails.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { isLoggedIn } from '../utils/auth';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

export default function MovieDetails({ imdbID }) {
  const [movie, setMovie] = useState(null);
  const [imdbReviews, setImdbReviews] = useState([]);
  const [localReviews, setLocalReviews] = useState([]);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!imdbID) return;
    setError('');
    setMovie(null);
    setImdbReviews([]);
    setLocalReviews([]);
    setShowReviewForm(false);

    const fetchData = async () => {
      try {
        // OMDb movie details
        const movieRes = await axios.get(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=short`);
        if (movieRes.data.Response === 'True') {
          setMovie(movieRes.data);
        } else {
          setError(movieRes.data.Error);
          return;
        }

        // Your MongoDB reviews from backend
        const reviewsRes = await axios.get(`http://localhost:5000/api/reviews?imdbID=${imdbID}`);
        setLocalReviews(reviewsRes.data);

        // Simulated IMDb reviews (not available in OMDb)
        setImdbReviews([]);
      } catch (err) {
        console.error('MovieDetails error:', err);
        setError('Something went wrong while fetching details or reviews');
      }
    };

    fetchData();
  }, [imdbID]);

  const handleAddReview = (newReview) => {
    setLocalReviews([newReview, ...localReviews]);
    setShowReviewForm(false);
  };

  if (!imdbID) return null;

  return (
    <div className="movie-details">
      {error && <p className="error-text">{error}</p>}

      {movie && (
        <>
          <h2 className="movie-title">{movie.Title} <span className="movie-year">({movie.Year})</span></h2>
          <img
            className="movie-poster"
            src={movie.Poster !== 'N/A' ? movie.Poster : ''}
            alt={movie.Title}
          />
          <p><b>Genre:</b> {movie.Genre}</p>
          <p><b>Duration:</b> {movie.Runtime}</p>
          <p><b>Plot:</b> {movie.Plot}</p>

          <section className="reviews-section">
            <h3>IMDb Reviews</h3>
            {imdbReviews.length === 0 ? (
              <p>No IMDb user reviews available.</p>
            ) : (
              <ReviewList reviews={imdbReviews} />
            )}
          </section>

          <section className="reviews-section">
            <h3>User Reviews</h3>
            <ReviewList reviews={localReviews} />
          </section>

          {isLoggedIn() ? (
            showReviewForm ? (
              <ReviewForm
                imdbID={imdbID}
                onAdd={handleAddReview}
                onCancel={() => setShowReviewForm(false)}
              />
            ) : (
              <button className="btn btn-primary" onClick={() => setShowReviewForm(true)}>Add Your Review</button>
            )
          ) : (
            <p><i>Please log in to add your review.</i></p>
          )}
        </>
      )}
    </div>
  );
}
