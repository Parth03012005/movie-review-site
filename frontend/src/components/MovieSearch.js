// src/components/MovieSearch.js
import { useState } from 'react';
import axios from 'axios';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

export default function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const searchMovies = async () => {
    setError('');
    try {
      const res = await axios.get(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`);
      if (res.data.Response === 'True') {
        setResults(res.data.Search);
      } else {
        setResults([]);
        setError(res.data.Error);
      }
    } catch (err) {
      setError('Error searching movies');
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (query.trim()) searchMovies();
  };

  return (
    <div className="movie-search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          className="search-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies..."
          aria-label="Search movies"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul className="movie-list">
        {results.map(movie => (
          <li
            key={movie.imdbID}
            onClick={() => onSelect(movie.imdbID)}
            className="movie-list-item"
          >
            {movie.Title} ({movie.Year})
          </li>
        ))}
      </ul>
    </div>
  );
}
