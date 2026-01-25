import { Star } from "lucide-react";
import  '../review.css'

const reviews = [
  {
    name: "James Carter",
    state: "California",
    rating: 5,
    comment: "Excellent delivery service. Fast, reliable, and professional.",
  },
  {
    name: "Maria Gonzales",
    state: "Texas",
    rating: 4,
    comment: "Very good experience. Package arrived safely and on time.",
  },
  {
    name: "David Johnson",
    state: "New York",
    rating: 5,
    comment: "Outstanding customer support and smooth tracking system.",
  },
  {
    name: "Ashley Brown",
    state: "Florida",
    rating: 4,
    comment: "Reliable service. I’ll definitely use them again.",
  },
  {
    name: "Michael Lee",
    state: "Illinois",
    rating: 5,
    comment: "Top-tier logistics company. Highly recommended.",
  },
];

export default function CustomerReviews() {
  return (
    <div className="reviews-wrapper">
      <h2 className="title">Customer Reviews </h2>
      <p className="titles">see what our clients speak</p>

      <div className="reviews-container">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-header">
              <div>
                <h3>{review.name}</h3>
                <span className="state">{review.state}</span>
              </div>

              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < review.rating ? "#FFD700" : "transparent"}
                    stroke="#FFD700"
                  />
                ))}
              </div>
            </div>

            <p className="comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
