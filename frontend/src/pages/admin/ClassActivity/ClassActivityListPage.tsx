// src/pages/admin/ClassActivity/ClassActivityListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ClassActivity } from '../../../types';
import { getAllClasses } from '../../../services/apiService';
import './ClassActivity.css';

const   ClassActivityListPage: React.FC = () => {
    const [classes, setClasses] = useState<ClassActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const data = await getAllClasses();
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    setClasses([]);
                }
                setError(null);
            } catch (err) {
                console.error("Failed to fetch classes:", err);
                setError("ไม่สามารถโหลดข้อมูลได้");
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    // ฟังก์ชันใหม่สำหรับจัดการเมื่อคลิกที่การ์ดคลาส
    const handleClassClick = (id: number) => {
        navigate(`/admin/class/detail/${id}`);
    };

    const handleAdd = () => navigate('/class/add');
    const handleEdit = (id: number) => navigate(`/class/edit/${id.toString()}`);
    const handleDelete = (id: number) => navigate(`/class/delete/${id.toString()}`);

    if (loading) return <div>กำลังโหลด...</div>;
    if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;

    return (
        <div className="main-content">
            <div className="content-section">
                <div className="header-with-button">
                    <h2>จัดการตารางคลาส</h2>
                    <button onClick={handleAdd} className="add-button-main">+</button>
                </div>
                
                {Array.isArray(classes) && classes.length > 0 ? (
                    <div className="card-grid">
                        {classes.map(cls => (
                            <div key={cls.id} className="card">
                                {/* ทำให้รูปภาพเป็นลิงก์โดยใช้ onClick */}
                                <img 
                                    src={cls.imageUrl} 
                                    alt={cls.name} 
                                    className="card-image" 
                                    onClick={() => handleClassClick(cls.id)} 
                                    style={{cursor: 'pointer'}}
                                />
                                <div className="card-footer">
                                    <span className="card-name">{cls.name}</span>
                                    <span className="card-sub">{cls.startTime} - {cls.endTime} | {cls.currentParticipants}/{cls.capacity}</span>
                                    <div className="card-actions">
                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(cls.id); }} className="icon-button edit-button">✏️</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(cls.id); }} className="icon-button delete-button">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>ยังไม่มีคลาสหรือกิจกรรมในขณะนี้</p>
                )}
            </div>
        </div>
    );
};

export default ClassActivityListPage;