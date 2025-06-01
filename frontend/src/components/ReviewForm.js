import { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

export default function ReviewForm({ imdbID, onAdd, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = getToken();
      if (!token) throw new Error('You must be logged in to add a review.');

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.post(
        'http://localhost:5000/api/reviews',
        { imdbID, rating, comment },
        config
      );

      onAdd(res.data);
      setRating(5);
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add review');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px', marginBottom: '20px' }}>
      <div>
        <label>Rating: </label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))}>
          {[5,4,3,2,1].map(num => (
            <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Comment: </label><br />
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
          cols={40}
          required
          placeholder="Write your review here..."
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Submit Review</button>
      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      )}
    </form>
  );
}
