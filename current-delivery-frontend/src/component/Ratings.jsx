import { Star } from "lucide-react";
import  '../review.css'
import { useTranslation } from "react-i18next";

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
 const {t} = useTranslation();
  return (
    <div className="reviews-wrapper">
      <h2 className="title">{t('Customer Reviews ')}</h2>
      <p className="titles">{t('see what our clients speak')}</p>

      <div className="reviews-container">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-header">
              <div>
                <h3>{t.review.name}</h3>
                <span className="state">{t.review.state}</span>
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

            <p className="comment">{t.review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
