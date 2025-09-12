// src/pages/admin/List/UserDeletePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetUsersById, DeleteUsersById } from '../../../services/https';
import type { UsersInterface } from '../../../interface/IUser';
import { useNotification } from '../../../components/Notification/NotificationProvider';
import './userlist.css';

const UserDeletePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UsersInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                const res = await GetUsersById(id);
                if (res.status === 200) {
                    setUser(res.data);
                } else {
                    console.error("Failed to fetch user:", res.data);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        try {
            const res = await DeleteUsersById(id);
            if (res.status === 200) {
                showNotification({
                    type: 'success',
                    title: 'ลบสมาชิกสำเร็จ',
                    message: 'ลบข้อมูลสมาชิกเรียบร้อยแล้ว',
                    duration: 2000
                });
                setTimeout(() => {
                    navigate('/admin/List');
                }, 1000);
            } else {
                showNotification({
                    type: 'error',
                    title: 'ไม่สามารถลบข้อมูลได้',
                    message: 'เกิดข้อผิดพลาดในการลบข้อมูลสมาชิก',
                    duration: 3000
                });
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            showNotification({
                type: 'error',
                title: 'ไม่สามารถลบข้อมูลได้',
                message: 'เกิดข้อผิดพลาดในการลบข้อมูลสมาชิก',
                duration: 3000
            });
        }
    };
    
    if (loading) {
        return <div className="main-content"><div className="content-section"><p>กำลังโหลด...</p></div></div>;
    }

    const userName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'สมาชิกนี้' : 'สมาชิกนี้';

    return (
        <div className="main-content">
            <div className="content-section">
                <div className="delete-confirm-container">
                    <h2 className="delete-title">ยืนยันการลบ</h2>
                    <p className="delete-message">คุณต้องการลบ {userName} หรือไม่?</p>
                    <div className="delete-actions">
                        <button onClick={() => navigate('/admin/List')} className="back-button">ยกเลิก</button>
                        <button onClick={handleDelete} className="delete-button-confirm">ลบสมาชิก</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDeletePage;
