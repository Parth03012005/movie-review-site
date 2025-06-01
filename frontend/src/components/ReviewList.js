export default function ReviewList({ reviews }) {
  if (!reviews.length) return <div className="no-reviews">No reviews yet.</div>;

  return (
    <ul className="review-list">
      {reviews.map(r => (
        <li key={r._id} className="review-item">
          <b className="reviewer">{r.reviewer}</b>: <span className="comment">{r.comment}</span> — <i className="rating">Rating: {r.rating}/5</i>
        </li>
      ))}
    </ul>
  );
}
