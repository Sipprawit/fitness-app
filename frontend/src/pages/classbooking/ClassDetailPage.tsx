// src/pages/classbooking/ClassDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { ClassActivity } from '../../types';
import { getClassById } from '../../services/apiService';
import { BookClass, GetUserClassBooking, CancelClassBooking } from '../../services/https';
import '../admin/ClassActivity/ClassActivity.css';

const ClassDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<ClassActivity | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
    const [userBooking, setUserBooking] = useState<any>(null);
    const [isBooked, setIsBooked] = useState<boolean>(false);

    // ฟังก์ชันตรวจสอบว่าเลยเวลาไปแล้วหรือไม่
    const isClassTimePassed = (classData: ClassActivity | null): boolean => {
        if (!classData) return false;
        
        const classDateTime = dayjs(`${classData.date} ${classData.startTime}`, 'YYYY-MM-DD HH:mm');
        const now = dayjs();
        
        return now.isAfter(classDateTime);
    };

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

                // ตรวจสอบการจองของผู้ใช้
                const userIdStr = localStorage.getItem('id');
                if (userIdStr) {
                    const userId = parseInt(userIdStr, 10);
                    const bookingRes = await GetUserClassBooking(userId, numericId);
                    if (bookingRes?.status === 200) {
                        setUserBooking(bookingRes.data);
                        setIsBooked(true);
                    } else {
                        setUserBooking(null);
                        setIsBooked(false);
                    }
                }
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
        navigate('/booking');
    };

    const handleOpenConfirm = () => {
        const userIdStr = localStorage.getItem('id');
        if (!userIdStr) {
            Modal.error({ title: 'เกิดข้อผิดพลาด', content: 'กรุณาเข้าสู่ระบบก่อนทำการจอง' });
            return;
        }
        setConfirmVisible(true);
    };

    const handleConfirmBooking = async () => {
        if (!id) return;
        const userIdStr = localStorage.getItem('id');
        if (!userIdStr) return;
        try {
            const res = await BookClass(parseInt(id, 10), parseInt(userIdStr, 10));
            if (res?.status === 200 || res?.status === 201) {
                message.success('จองคลาสสำเร็จ');
                const data = await getClassById(parseInt(id, 10));
                setClassData(data);
                // อัปเดตสถานะการจอง
                setUserBooking(res.data);
                setIsBooked(true);
            } else {
                Modal.error({ title: 'จองไม่สำเร็จ', content: res?.data?.error || 'เกิดข้อผิดพลาด' });
            }
        } catch (e: any) {
            Modal.error({ title: 'จองไม่สำเร็จ', content: e?.response?.data?.error || 'เกิดข้อผิดพลาดในการจอง' });
        } finally {
            setConfirmVisible(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!userBooking?.ID) return;
        try {
            const res = await CancelClassBooking(userBooking.ID);
            if (res?.status === 200) {
                message.success('ยกเลิกการจองสำเร็จ');
                const data = await getClassById(parseInt(id!, 10));
                setClassData(data);
                // อัปเดตสถานะการจอง
                setUserBooking(null);
                setIsBooked(false);
            } else {
                Modal.error({ title: 'ยกเลิกไม่สำเร็จ', content: res?.data?.error || 'เกิดข้อผิดพลาด' });
            }
        } catch (e: any) {
            Modal.error({ title: 'ยกเลิกไม่สำเร็จ', content: e?.response?.data?.error || 'เกิดข้อผิดพลาดในการยกเลิก' });
        }
    };

    // รองรับ onClick ที่ปุ่มปัจจุบันชี้มาที่ handleBookClass
    const handleBookClass = () => {
        handleOpenConfirm();
    };

    if (loading) return <div>กำลังโหลด...</div>;
    if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;
    if (!classData) return <div>ไม่พบข้อมูลคลาส</div>;

    return (
        <>
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
                            <button onClick={handleGoBack} className="back-button-gray">ย้อนกลับ</button>
                            {isBooked ? (
                                isClassTimePassed(classData) ? (
                                    <button 
                                        disabled
                                        className="book-button"
                                        style={{ 
                                            backgroundColor: '#ccc', 
                                            cursor: 'not-allowed',
                                            opacity: 0.6 
                                        }}
                                        title="ไม่สามารถยกเลิกได้เนื่องจากเลยเวลาไปแล้ว"
                                    >
                                        ไม่สามารถยกเลิกได้
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleCancelBooking}
                                        className="book-button"
                                    >
                                        ยกเลิกการจอง
                                    </button>
                                )
                            ) : (
                                isClassTimePassed(classData) ? (
                                    <button 
                                        disabled
                                        className="book-button"
                                        style={{ 
                                            backgroundColor: '#ccc', 
                                            cursor: 'not-allowed',
                                            opacity: 0.6 
                                        }}
                                        title="ไม่สามารถจองได้เนื่องจากเลยเวลาไปแล้ว"
                                    >
                                        ไม่สามารถจองได้
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleBookClass}
                                        className="book-button"
                                    >
                                        จองคลาส
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal
            title="ยืนยันการจอง"
            open={confirmVisible}
            onOk={handleConfirmBooking}
            onCancel={() => setConfirmVisible(false)}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
        >
            <p>ต้องการยืนยันการจองคลาสนี้หรือไม่?</p>
        </Modal>
        </>
    );
};

export default ClassDetailPage;
