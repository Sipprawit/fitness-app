// src/pages/admin/ClassActivity/ClassDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ClassActivity } from '../../../types';
import { getClassById } from '../../../services/apiService';
import './ClassActivity.css';

const ClassDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<ClassActivity | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClassData = async () => {
            if (!id) {
                setError("ไม่พบ ID ของคลาส");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const numericId = parseInt(id, 10);
                const data = await getClassById(numericId);
                setClassData(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch class data:", err);
                setError("ไม่สามารถโหลดข้อมูลคลาสได้");
            } finally {
                setLoading(false);
            }
        };

        fetchClassData();
    }, [id]);


    
    const handleGoBack = () => {
        navigate('/admin/classes');
    };

    if (loading) return <div>กำลังโหลด...</div>;
    if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;
    if (!classData) return <div>ไม่พบข้อมูลคลาส</div>;

    return (
        <div className="main-content">
            <div className="content-section class-detail-card">
                <div className="class-detail-header">
                    <h2 className="form-title">รายละเอียดคลาส: {classData.name}</h2>
                </div>
                <div className="class-detail-content">
                    <img src={classData.imageUrl} alt={classData.name} className="class-detail-image" />
                    <div className="class-detail-info">
                        <p><strong>ชื่อกิจกรรม:</strong> {classData.name}</p>
                        <p><strong>รายละเอียด:</strong> {classData.description}</p>
                        <p><strong>วันที่:</strong> {classData.date}</p>
                        <p><strong>เวลา:</strong> {classData.startTime} - {classData.endTime}</p>
                        <p><strong>สถานที่:</strong> {classData.location}</p>
                        <p><strong>สถานะ:</strong> {classData.currentParticipants}/{classData.capacity}</p>
                        {/* แก้ไขส่วนของปุ่ม */}
                        <div className="form-actions-bottom">
                            <button onClick={handleGoBack} className="back-button">ย้อนกลับ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailPage;