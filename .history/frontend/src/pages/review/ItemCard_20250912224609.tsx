// src/pages/review/ItemCard.tsx

import React from 'react';
import StarRating from './StarRating'; // ใช้แสดงดาว (แบบอ่านอย่างเดียว)
import type { TrainingItem, Review } from './ReviewSystem'; // Import Type เข้ามา
import './ItemCard.css'; // Import ไฟล์ CSS (เราจะสร้างไฟล์นี้กัน)

interface ItemCardProps {
  item: TrainingItem;
  onReviewClick: (item: TrainingItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onReviewClick }) => {
  // ป้องกันกรณีที่ Reviews เป็น undefined/null จาก API
  const reviews: Review[] = Array.isArray(item.Reviews) ? item.Reviews : [];

  // คำนวณคะแนนเฉลี่ยจากรีวิวทั้งหมด
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + (review?.Rating || 0), 0) / reviews.length
    : 0;
  
  // ดึง 2 รีวิวล่าสุด (เรียงจากใหม่ไปเก่า)
  const latestTwoReviews = [...reviews]
    .sort((a, b) => new Date(b?.CreatedAt || 0).getTime() - new Date(a?.CreatedAt || 0).getTime())
    .slice(0, 2);
  

  // --- 2. ส่วนแสดงผล (JSX) ---
  return (
    <div className="item-card">
      {/* ส่วนรูปภาพและข้อมูลพื้นฐาน */}
      <div className="item-image-container">
        {item.ImageURL ? (
          <img 
            key={`img-${item.ID}-${item.ImageURL}`}
            src={item.ImageURL} 
            alt={item.Name === 'N/A' ? 'N/A' : item.Name}
            className="item-image"
            onLoad={(e) => {
              // เมื่อรูปโหลดสำเร็จ ให้ซ่อน placeholder
              const target = e.target as HTMLImageElement;
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'none';
            }}
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
          className="item-image-placeholder" 
          style={{ display: item.ImageURL ? 'none' : 'flex' }}
        >
          <span>รูป {item.Name === 'N/A' ? 'N/A' : item.Name}</span>
        </div>
      </div>
      <div className="item-details">
        <h4>{item.category}: {item.Name === 'N/A' ? 'N/A' : item.Name}</h4>
      </div>

      <hr className="divider" />

      {/* ส่วนแสดงความคิดเห็นล่าสุด */}
      <div className="latest-reviews-section">
        <p className="section-title">ความคิดเห็นล่าสุด:</p>
        {latestTwoReviews.length > 0 ? (
          latestTwoReviews.map((review: Review) => {
            return (
              <div key={review?.ID} className="review-entry">
                <div className="review-author">
                  {review?.User?.ProfileImage ? (
                    <img 
                      src={review.User.ProfileImage.startsWith('http') ? review.User.ProfileImage : `http://localhost:8000${review.User.ProfileImage}`} 
                      alt={`${review?.User?.FirstName || ''} ${review?.User?.LastName || ''}`} 
                      className="author-avatar"
                      onError={(e) => {
                        // ถ้ารูปโปรไฟล์ไม่โหลดได้ ให้ใช้รูป default
                        const target = e.target as HTMLImageElement;
                        target.src = `https://i.pravatar.cc/150?u=${review?.User?.FirstName || 'user'}`;
                      }}
                    />
                  ) : (
                    <img 
                      src={`https://i.pravatar.cc/150?u=${review?.User?.FirstName || 'user'}`} 
                      alt={`${review?.User?.FirstName || ''} ${review?.User?.LastName || ''}`} 
                      className="author-avatar" 
                    />
                  )}
                  <span>{review?.User?.FirstName || ''} {review?.User?.LastName || ''}</span>
                  <div className="review-rating-stars">
                    <StarRating rating={review?.Rating || 0} readOnly={true} sizeClass="small" theme="success" />
                  </div>
                </div>
                <p className="review-comment">"{review?.Comment || ''}"</p>
                <span className="review-date">{review?.CreatedAt ? new Date(review.CreatedAt).toLocaleDateString('th-TH') : ''}</span>
              </div>
            );
          })
        ) : (
          <p className="no-reviews">ยังไม่มีรีวิว</p>
        )}
      </div>
      
      {/* ส่วนคะแนนเฉลี่ยและปุ่ม */}
      <div className="summary-section">
        <div className="average-rating">
          {reviews.length > 0 ? (
            <>
              <StarRating rating={averageRating} readOnly={true} sizeClass="medium" theme="warning" />
              <span className="rating-text">
                คะแนนเฉลี่ย {averageRating.toFixed(1)}/5 ({reviews.length} รีวิว)
              </span>
            </>
          ) : (
            <>
              <StarRating rating={0} readOnly={true} sizeClass="medium" theme="warning" />
              <span className="rating-text">
                คะแนนเฉลี่ย 0.0/5 (0 รีวิว)
              </span>
            </>
          )}
        </div>
        <button className="review-button" onClick={() => onReviewClick(item)}>
          รีวิว & ให้คะแนน
        </button>
      </div>
    </div>
  );
};

export default ItemCard;