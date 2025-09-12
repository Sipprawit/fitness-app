import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItemCard from './../review/ItemCard';
import ReviewPage from './../review/ReviewPage';
import { GetAllClasses, GetTrainers, CreateReview } from '../../services/https';
import './ReviewSystem.css';

// --- Interfaces ---
export interface User {
  ID: number;
  FirstName: string;
  LastName: string;
}
export interface Review {
  ID: number;
  User: User; // Backend ส่งมาเป็น user (ตัวเล็ก) -> normalize เป็น User
  Rating: number;
  Comment: string;
  CreatedAt: string;
}
export type Category = 'คลาส' | 'เทรนเนอร์';
export interface TrainingItem {
  ID: number;
  Name: string;
  ImageURL: string;
  Trainer?: { Name: string };
  Reviews: Review[];
  category: Category;
  relatedName: string;
}

const ReviewSystem: React.FC = () => {
  // --- URL Parameters ---
  const [searchParams, setSearchParams] = useSearchParams();
  
  // --- State Management ---
  const [items, setItems] = useState<TrainingItem[]>([]);
  const [filter, setFilter] = useState<Category>(() => {
    // อ่าน filter จาก URL parameter หรือใช้ 'คลาส' เป็นค่าเริ่มต้น
    const urlFilter = searchParams.get('filter') as Category;
    return urlFilter && ['คลาส', 'เทรนเนอร์'].includes(urlFilter) ? urlFilter : 'คลาส';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [itemToReview, setItemToReview] = useState<TrainingItem | null>(null);

  // --- API Calls ---
  const fetchItems = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No auth token found.");
      alert("User not authenticated");
      return;
    }
    try {
      let response;
      if (filter === 'คลาส') {
        response = await GetAllClasses();
      } else {
        response = await GetTrainers();
      }

      if (response.status !== 200) {
        console.error(`API Error:`, response.data);
        setItems([]);
        return;
      }

      console.log(`API Response for ${filter}:`, response.data);
      const raw = Array.isArray(response.data) ? response.data : [];
      console.log(`Raw data length: ${raw.length}`);

      const formattedData: TrainingItem[] = raw.map((item: any) => {
        console.log(`Processing ${filter} item:`, item);
        console.log(`Item Reviews:`, item.Reviews);
        console.log(`Trainer data - first_name: ${item.first_name}, last_name: ${item.last_name}, skill: ${item.skill}`);
        console.log(`Class data - name: ${item.name}, Name: ${item.Name}, description: ${item.description}`);
        
        const rawReviews = Array.isArray(item.Reviews) ? item.Reviews : (Array.isArray(item.reviews) ? item.reviews : []);
        const normalizedReviews: Review[] = rawReviews.map((r: any) => ({
          ID: r.ID ?? r.id ?? 0,
          Rating: r.Rating ?? r.rating ?? 0,
          Comment: r.Comment ?? r.comment ?? '',
          CreatedAt: r.CreatedAt ?? r.createdAt ?? r.created_at ?? '',
          User: {
            ID: r.User?.ID ?? r.user?.ID ?? r.user?.id ?? 0,
            FirstName: r.User?.FirstName ?? r.user?.FirstName ?? r.user?.first_name ?? '',
            LastName: r.User?.LastName ?? r.user?.LastName ?? r.user?.last_name ?? '',
          },
        }));

        // สำหรับคลาส: ใช้ชื่อคลาสจากฐานข้อมูล, สำหรับเทรนเนอร์: ใช้ชื่อเทรนเนอร์เอง
        const trainerName = filter === 'คลาส' 
          ? (item.name || item.Name || 'คลาส')
          : (item.first_name && item.last_name ? `${item.first_name} ${item.last_name}` : (item.first_name || item.last_name ? `${item.first_name || ''} ${item.last_name || ''}`.trim() : 'เทรนเนอร์'));
        
        // สำหรับเทรนเนอร์: ใช้ชื่อเทรนเนอร์เอง, สำหรับคลาส: ใช้ชื่อคลาส
        const displayName = filter === 'คลาส' ? trainerName : trainerName;
        const relatedName = filter === 'คลาส' ? (item.name || item.Name || 'คลาส') : (item.skill || 'ทักษะไม่ระบุ');

        // Construct full image URL for trainers
        let imageURL = item.ImageURL ?? item.image_url ?? item.ProfileImage ?? item.profile_image ?? item.imageUrl ?? '';
        if (imageURL && !imageURL.startsWith('http')) {
          // If it's a relative path, prepend the backend URL
          imageURL = `http://localhost:8000${imageURL}`;
        }

        const result = {
          ID: item.ID ?? item.id ?? 0,
          Name: displayName,
          ImageURL: imageURL,
          Trainer: { Name: trainerName },
          Reviews: normalizedReviews,
          category: filter,
          relatedName: relatedName,
        } as TrainingItem;
        
        console.log(`Formatted ${filter} item:`, result);
        return result;
      });

      setItems(formattedData);
    } catch (error: any) {
      console.error(`Failed to fetch ${filter}:`, error);
      
      if (error.response?.status === 401) {
        alert('เซสชันหมดอายุ กรุณาล็อกอินใหม่');
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      setItems([]); // ถ้า error ให้เคลียร์ข้อมูล
    }
  };
  
  const handleSubmitReview = async (itemId: number, review: { rating: number; comment: string }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('กรุณาล็อกอินก่อนรีวิว');
      window.location.href = '/login';
      return;
    }
    
    const reviewData = {
      rating: review.rating,
      comment: review.comment,
      reviewableID: itemId,
      reviewableType: itemToReview?.category === 'คลาส' ? 'classes' : 'trainers',
    };
    
    try {
      const response = await CreateReview(reviewData);
      
      if (response.status === 200 || response.status === 201) {
        alert('ขอบคุณสำหรับรีวิวครับ!');
        setItemToReview(null);
        console.log('Review submitted successfully, refreshing data...');
        await fetchItems(); // ดึงข้อมูลใหม่เพื่ออัปเดตหน้าจอ
        console.log('Data refreshed after review submission');
      } else {
        const msg = response.data?.error || 'ส่งรีวิวไม่สำเร็จ';
        alert(`ส่งรีวิวไม่สำเร็จ: ${msg}`);
      }
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      
      if (error.response?.status === 401) {
        alert('เซสชันหมดอายุ กรุณาล็อกอินใหม่');
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      const msg = error.response?.data?.error || error.message || 'ส่งรีวิวไม่สำเร็จ';
      alert(`ส่งรีวิวไม่สำเร็จ: ${msg}`);
    }
  };

  // --- Effects ---
  useEffect(() => {
    // Clear items first to force re-render
    setItems([]);
    fetchItems();
  }, [filter]);

  // อัปเดต URL เมื่อ filter เปลี่ยน
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('filter', filter);
    setSearchParams(newSearchParams, { replace: true });
  }, [filter, searchParams, setSearchParams]);

  // --- Data Filtering ---
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item =>
      (item.Name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // --- Event Handlers ---
  const handleReviewClick = (item: TrainingItem) => setItemToReview(item);
  const handleBackToList = () => setItemToReview(null);

  // --- Render Logic ---
  if (itemToReview) {
    return <ReviewPage item={itemToReview} onSubmit={handleSubmitReview} onBack={handleBackToList} />;
  }

  return (
    <div className="review-system-container">
      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value as Category)}>
          <option value="คลาส">ตัวกรอง: คลาส</option>
          <option value="เทรนเนอร์">ตัวกรอง: เทรนเนอร์</option>
        </select>
        <input
          type="text"
          placeholder={`ค้นหา${filter}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="item-list-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ItemCard key={`${filter}-${item.ID}`} item={item} onReviewClick={handleReviewClick} />
          ))
        ) : (
          <div className="no-items-message">
            <p>ไม่พบ{filter}ที่ค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;