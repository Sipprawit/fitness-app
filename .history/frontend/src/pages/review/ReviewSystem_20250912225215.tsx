import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItemCard from './../review/ItemCard';
import ReviewPage from './../review/ReviewPage';
import { GetTrainers, CreateReview, GetUserBookedClasses, GetUserBookedTrainers, GetReviewsByItem } from '../../services/https';
import { useNotification } from '../../components/Notification/NotificationProvider';
import './ReviewSystem.css';

// --- Interfaces ---
export interface User {
  ID: number;
  FirstName: string;
  LastName: string;
  ProfileImage?: string;
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
  const { showNotification } = useNotification();
  
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
    const userId = localStorage.getItem('id');
    
    if (!token || !userId) {
      console.error("No auth token or user ID found.");
      showNotification({
        type: 'error',
        title: 'ไม่สามารถเข้าสู่ระบบได้',
        message: 'กรุณาเข้าสู่ระบบใหม่',
        duration: 3000
      });
      return;
    }
    
    try {
      let response;
      if (filter === 'คลาส') {
        // ดึงเฉพาะคลาสที่ผู้ใช้จองแล้ว
        response = await GetUserBookedClasses(Number(userId));
      } else {
        // ดึงเฉพาะเทรนเนอร์ที่ผู้ใช้จองแล้ว
        response = await GetUserBookedTrainers(Number(userId));
      }

      if (response.status !== 200) {
        console.error(`API Error:`, response.data);
        setItems([]);
        return;
      }

      console.log(`API Response for user's booked ${filter}:`, response.data);
      console.log(`Full response object:`, response);
      const raw = Array.isArray(response.data) ? response.data : [];
      console.log(`Raw data length: ${raw.length}`);
      console.log(`First booking item:`, raw[0]);

      const formattedData: TrainingItem[] = await Promise.all(raw.map(async (booking: any) => {
        console.log(`Processing user's booked ${filter}:`, booking);
        console.log(`Booking keys:`, Object.keys(booking));
        console.log(`Booking values:`, Object.values(booking));
        
        // ดึงข้อมูลคลาสหรือเทรนเนอร์จาก booking
        let item;
        if (filter === 'คลาส') {
          // สำหรับคลาส: ข้อมูลอาจอยู่ใน class_activity หรือ class_activity_id
          item = booking.class_activity || booking.ClassActivity;
          if (!item && booking.class_activity_id) {
            // ถ้าไม่มีข้อมูลคลาสเต็ม ให้สร้างข้อมูลเบื้องต้น
            item = { id: booking.class_activity_id, name: `คลาส ID: ${booking.class_activity_id}` };
          }
        } else {
          // สำหรับเทรนเนอร์: ตรวจสอบ field ต่างๆ ที่อาจมี
          console.log(`Looking for trainer data in booking...`);
          console.log(`booking.trainer:`, booking.trainer);
          console.log(`booking.Trainer:`, booking.Trainer);
          console.log(`booking.schedule:`, booking.schedule);
          console.log(`booking.schedule.Trainer:`, booking.schedule?.Trainer);
          
          // ดึงข้อมูลเทรนเนอร์จาก schedule.Trainer
          item = booking.trainer || booking.Trainer || booking.schedule?.Trainer;
          
          if (!item) {
            // หา trainer_id จาก field ต่างๆ
            let trainerId = booking.trainer_id || booking.trainerID || booking.schedule?.TrainerID || booking.schedule?.trainer_id;
            
            if (trainerId) {
              console.log(`No trainer data found, fetching trainer with ID: ${trainerId}`);
              // ถ้าไม่มีข้อมูลเทรนเนอร์เต็ม ให้ดึงข้อมูลเทรนเนอร์จาก API
              try {
                const trainerResponse = await GetTrainers();
                if (trainerResponse.status === 200 && Array.isArray(trainerResponse.data)) {
                  const trainer = trainerResponse.data.find((t: any) => t.id === trainerId || t.ID === trainerId);
                  if (trainer) {
                    item = trainer;
                    console.log(`Found trainer data for ID ${trainerId}:`, trainer);
                  } else {
                    // ถ้าไม่เจอเทรนเนอร์ ให้สร้างข้อมูลเบื้องต้น
                    item = { id: trainerId, first_name: 'เทรนเนอร์', last_name: `ID: ${trainerId}` };
                  }
                } else {
                  // ถ้าไม่สามารถดึงข้อมูลเทรนเนอร์ได้ ให้สร้างข้อมูลเบื้องต้น
                  item = { id: trainerId, first_name: 'เทรนเนอร์', last_name: `ID: ${trainerId}` };
                }
              } catch (error) {
                console.error(`Failed to fetch trainer data for ID ${trainerId}:`, error);
                // ถ้าเกิด error ให้สร้างข้อมูลเบื้องต้น
                item = { id: trainerId, first_name: 'เทรนเนอร์', last_name: `ID: ${trainerId}` };
              }
            }
          }
        }
        
        if (!item) {
          console.warn(`No ${filter} data found in booking:`, booking);
          console.warn(`Available fields in booking:`, Object.keys(booking));
          console.warn(`Booking object:`, JSON.stringify(booking, null, 2));
          
          // ถ้าเป็นเทรนเนอร์และไม่พบข้อมูล ให้ลองสร้างข้อมูลเบื้องต้นจาก booking ID
          if (filter === 'เทรนเนอร์') {
            console.log(`Creating fallback trainer data from booking ID: ${booking.ID}`);
            item = { 
              id: booking.ID, 
              first_name: 'เทรนเนอร์', 
              last_name: `Booking ID: ${booking.ID}`,
              skill: 'ไม่ระบุทักษะ'
            };
          } else {
            return null;
          }
        }
        
        console.log(`Item Reviews:`, item.Reviews);
        console.log(`Item reviews:`, item.reviews);
        console.log(`Trainer data - first_name: ${item.first_name}, last_name: ${item.last_name}, skill: ${item.skill}`);
        console.log(`Class data - name: ${item.name}, Name: ${item.Name}, description: ${item.description}`);
        
        // ดึงข้อมูลรีวิวจาก item หรือจาก booking
        let rawReviews = Array.isArray(item.Reviews) ? item.Reviews : (Array.isArray(item.reviews) ? item.reviews : []);
        
        // ถ้าไม่มีรีวิวใน item ให้ลองดึงจาก booking
        if (rawReviews.length === 0 && booking.reviews) {
          rawReviews = Array.isArray(booking.reviews) ? booking.reviews : [];
        }
        
        // ถ้ายังไม่มีรีวิว ให้ดึงข้อมูลรีวิวจาก API
        if (rawReviews.length === 0) {
          try {
            console.log(`No reviews found in item/booking, fetching reviews from API for ${filter} ID: ${item.ID || item.id}`);
            const reviewResponse = await GetReviewsByItem(item.ID || item.id, filter === 'คลาส' ? 'classes' : 'trainers');
            
            if (reviewResponse && reviewResponse.status === 200) {
              rawReviews = Array.isArray(reviewResponse.data) ? reviewResponse.data : [];
              console.log(`Found reviews from API:`, rawReviews);
            }
          } catch (error) {
            console.error(`Failed to fetch reviews:`, error);
          }
        }
        
        console.log(`Final raw reviews:`, rawReviews);
        const normalizedReviews: Review[] = rawReviews.map((r: any) => ({
          ID: r.ID ?? r.id ?? 0,
          Rating: r.Rating ?? r.rating ?? 0,
          Comment: r.Comment ?? r.comment ?? '',
          CreatedAt: r.CreatedAt ?? r.createdAt ?? r.created_at ?? '',
          User: {
            ID: r.User?.ID ?? r.user?.ID ?? r.user?.id ?? 0,
            FirstName: r.User?.FirstName ?? r.user?.FirstName ?? r.user?.first_name ?? '',
            LastName: r.User?.LastName ?? r.user?.LastName ?? r.user?.last_name ?? '',
            ProfileImage: r.User?.ProfileImage ?? r.user?.ProfileImage ?? r.user?.profile_image ?? r.user?.avatar ?? '',
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
        
        console.log(`Formatted user's booked ${filter} item:`, result);
        return result;
      }));
      
      // กรอง null items ออก
      const validItems = formattedData.filter(item => item !== null);

      setItems(validItems);
    } catch (error: any) {
      console.error(`Failed to fetch ${filter}:`, error);
      
      if (error.response?.status === 401) {
        showNotification({
          type: 'error',
          title: 'เซสชันหมดอายุ',
          message: 'กรุณาล็อกอินใหม่',
          duration: 3000
        });
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
      showNotification({
        type: 'warning',
        title: 'กรุณาล็อกอินก่อนรีวิว',
        message: 'กรุณาเข้าสู่ระบบก่อนเขียนรีวิว',
        duration: 3000
      });
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
        showNotification({
          type: 'success',
          title: 'ขอบคุณสำหรับรีวิวครับ!',
          message: 'รีวิวของคุณได้รับการบันทึกเรียบร้อยแล้ว',
          duration: 2000
        });
        setItemToReview(null);
        console.log('Review submitted successfully, refreshing data...');
        await fetchItems(); // ดึงข้อมูลใหม่เพื่ออัปเดตหน้าจอ
        console.log('Data refreshed after review submission');
      } else {
        const msg = response.data?.error || 'ส่งรีวิวไม่สำเร็จ';
        showNotification({
          type: 'error',
          title: 'ไม่สามารถส่งรีวิวได้',
          message: msg,
          duration: 3000
        });
      }
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      
      if (error.response?.status === 401) {
        showNotification({
          type: 'error',
          title: 'เซสชันหมดอายุ',
          message: 'กรุณาล็อกอินใหม่',
          duration: 3000
        });
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      const msg = error.response?.data?.error || error.message || 'ส่งรีวิวไม่สำเร็จ';
      showNotification({
        type: 'error',
        title: 'ไม่สามารถส่งรีวิวได้',
        message: msg,
        duration: 3000
      });
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
            <p>คุณยังไม่ได้จอง{filter}ใดๆ หรือไม่พบ{filter}ที่ค้นหา</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              กรุณาจอง{filter}ก่อนจึงจะสามารถรีวิวได้
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;