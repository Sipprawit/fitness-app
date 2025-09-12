import React, { useState } from 'react';
import StarRating from './../review/StarRating';
import type { TrainingItem } from './ReviewSystem'; // ใช้ Type จาก ReviewSystem
import { useNotification } from '../../components/Notification/NotificationProvider';
import './ReviewPage.css';

interface ReviewPageProps {
  item: TrainingItem;
  onSubmit: (itemId: number, review: { rating: number; comment: string }) => void;
  onBack: () => void;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ item, onSubmit, onBack }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { showNotification } = useNotification();

  const handleSubmit = () => {
    if (rating === 0) {
      alert('กรุณาให้คะแนนอย่างน้อย 1 ดาว');
      return;
    }
    onSubmit(item.ID, { rating, comment });
  };

  return (
    <div className="review-form-container">
      <div className="review-form-card">
        <div className="review-image-container">
          {item.ImageURL ? (
            <img 
              src={item.ImageURL} 
              alt={item.Name}
              className="review-image"
              onError={(e) => {
                // ถ้ารูปไม่โหลดได้ ให้แสดง placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="review-image-placeholder" 
            style={{ display: item.ImageURL ? 'none' : 'flex' }}
          >
            <span>รูป {item.Name}</span>
          </div>
        </div>
        <div className="review-item-info">
          <h4>{item.category}: {item.Name}</h4>
        </div>
        <div className="review-rating-section">
          <label className="rating-label">ให้คะแนน</label>
          <StarRating 
            onRatingChange={setRating} 
            rating={rating} 
            theme="primary"
            sizeClass="large"
          />
        </div>
        <textarea
          className="review-comment-textarea"
          placeholder="แสดงความคิดเห็น..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="review-button-group">
          <button type="button" className="back-button" onClick={onBack}>ย้อนกลับ</button>
          <button type="button" className="submit-button" onClick={handleSubmit}>เสร็จสิ้น</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;