// src/pages/admin/ClassActivity/ClassActivityDeletePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteClass, getClassById } from '../../../services/apiService';
import { useNotification } from '../../../components/Notification/NotificationProvider';
import './ClassActivity.css'; // ใช้ไฟล์ CSS เดียวกันกับหน้า Class Activity

const ClassActivityDeletePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [className, setClassName] = useState('คลาสนี้'); // เพิ่ม state สำหรับเก็บชื่อคลาส
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchClassName = async () => {
            if (!id) return;
            try {
                const numericId = parseInt(id, 10);
                const data = await getClassById(numericId);
                if (data && data.name) {
                    setClassName(data.name);
                }
            } catch (error) {
                console.error("Failed to fetch class name:", error);
                setClassName('คลาสนี้'); // ใช้ค่าเริ่มต้นหากเกิดข้อผิดพลาด
            } finally {
                setLoading(false);
            }
        };

        fetchClassName();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        try {
            await deleteClass(parseInt(id, 10));
            navigate('/admin/classes');
        } catch (error) {
            console.error('Failed to delete class:', error);
            alert('ไม่สามารถลบข้อมูลได้');
        }
    };
    
    if (loading) {
        return <div className="main-content"><div className="content-section"><p>กำลังโหลด...</p></div></div>;
    }

    return (
        <div className="main-content">
            <div className="content-section">
                <div className="delete-confirm-container">
                    <h2 className="delete-title">ยืนยันการลบ</h2>
                    <p className="delete-message">คุณต้องการลบ {className} หรือไม่?</p>
                    <div className="delete-actions">
                        <button onClick={() => navigate('/admin/classes')} className="back-button">ยกเลิก</button>
                        <button onClick={handleDelete} className="delete-button-confirm">ลบ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassActivityDeletePage;