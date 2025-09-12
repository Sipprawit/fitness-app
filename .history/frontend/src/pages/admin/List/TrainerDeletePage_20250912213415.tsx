// src/pages/admin/List/TrainerDeletePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetTrainerById, DeleteTrainerById } from '../../../services/https';
import type { TrainerInterface } from '../../../interface/ITrainer';
import { useNotification } from '../../../components/Notification/NotificationProvider';
import './userlist.css';

const TrainerDeletePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [trainer, setTrainer] = useState<TrainerInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchTrainer = async () => {
            if (!id) return;
            try {
                const res = await GetTrainerById(parseInt(id, 10));
                if (res.status === 200) {
                    setTrainer(res.data);
                } else {
                    console.error("Failed to fetch trainer:", res.data);
                }
            } catch (error) {
                console.error("Failed to fetch trainer:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainer();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        try {
            const res = await DeleteTrainerById(parseInt(id, 10));
            if (res.status === 200) {
                showNotification({
                    type: 'success',
                    title: 'ลบเทรนเนอร์สำเร็จ',
                    message: 'ลบข้อมูลเทรนเนอร์เรียบร้อยแล้ว',
                    duration: 2000
                });
                setTimeout(() => {
                    navigate('/admin/List?view=trainers');
                }, 1000);
            } else {
                showNotification({
                    type: 'error',
                    title: 'ไม่สามารถลบข้อมูลได้',
                    message: 'เกิดข้อผิดพลาดในการลบข้อมูลเทรนเนอร์',
                    duration: 3000
                });
            }
        } catch (error) {
            console.error('Failed to delete trainer:', error);
            showNotification({
                type: 'error',
                title: 'ไม่สามารถลบข้อมูลได้',
                message: 'เกิดข้อผิดพลาดในการลบข้อมูลเทรนเนอร์',
                duration: 3000
            });
        }
    };
    
    if (loading) {
        return <div className="main-content"><div className="content-section"><p>กำลังโหลด...</p></div></div>;
    }

    const trainerName = trainer ? `${trainer.first_name || ''} ${trainer.last_name || ''}`.trim() || 'เทรนเนอร์นี้' : 'เทรนเนอร์นี้';

    return (
        <div className="main-content">
            <div className="content-section">
                <div className="delete-confirm-container">
                    <h2 className="delete-title">ยืนยันการลบ</h2>
                    <p className="delete-message">คุณต้องการลบ {trainerName} หรือไม่?</p>
                    <div className="delete-actions">
                        <button onClick={() => navigate('/admin/List?view=trainers')} className="back-button">ยกเลิก</button>
                        <button onClick={handleDelete} className="delete-button-confirm">ลบเทรนเนอร์</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerDeletePage;
