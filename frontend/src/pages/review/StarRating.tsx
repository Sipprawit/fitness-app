// src/pages/review/StarRating.tsx

import React, { useState } from 'react';
import './StarRating.css'; // สร้างไฟล์ CSS นี้ถ้ายังไม่มี

interface StarRatingProps {
  rating?: number; // rating เริ่มต้น (สำหรับแสดงผล)
  onRatingChange?: (rating: number) => void; // ฟังก์ชันที่จะถูกเรียกเมื่อมีการให้คะแนน
  readOnly?: boolean; // prop ที่เพิ่มเข้ามา
  size?: number; // ขนาดของดาว
  theme?: 'default' | 'primary' | 'success' | 'warning' | 'danger'; // theme สี
  sizeClass?: 'small' | 'medium' | 'large'; // ขนาดแบบ class
  loading?: boolean; // สถานะ loading
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating = 0, 
  onRatingChange, 
  readOnly = false, // กำหนดค่า default เป็น false
  size = 24,
  theme = 'default',
  sizeClass = 'medium',
  loading = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rate: number) => {
    // ถ้า onRatingChange มีค่า (ไม่ใช่ readOnly mode) ให้เรียกใช้งาน
    if (onRatingChange) {
      onRatingChange(rate);
    }
  };

  // สร้าง className สำหรับ star-rating container
  const containerClasses = [
    'star-rating',
    theme !== 'default' ? theme : '',
    sizeClass,
    readOnly ? 'read-only' : '',
    loading ? 'loading' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {[1, 2, 3, 4, 5].map((star) => {
        const starValue = hoverRating || rating;
        return (
          <span
            key={star}
            className={`star ${starValue >= star ? 'filled' : ''} ${readOnly ? 'read-only' : ''}`}
            style={{ 
              fontSize: sizeClass === 'medium' ? `${size}px` : undefined,
              cursor: readOnly ? 'default' : 'pointer' 
            }}
            // ถ้าไม่ใช่โหมด readOnly ถึงจะให้มี event ต่างๆ
            onClick={() => !readOnly && !loading && handleClick(star)}
            onMouseEnter={() => !readOnly && !loading && setHoverRating(star)}
            onMouseLeave={() => !readOnly && !loading && setHoverRating(0)}
            tabIndex={readOnly ? -1 : 0}
            role="button"
            aria-label={`ให้คะแนน ${star} ดาว`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;