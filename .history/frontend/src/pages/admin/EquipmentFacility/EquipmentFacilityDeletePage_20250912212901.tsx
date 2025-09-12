// src/pages/admin/EquipmentFacility/EquipmentFacilityDeletePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEquipment, deleteFacility, getEquipmentById, getFacilityById } from '../../../services/apiService';
import { useNotification } from '../../../components/Notification/NotificationProvider';
import './EquipmentFacility.css';

interface EquipmentFacilityDeleteProps {
    itemType: 'equipment' | 'facility';
}

const EquipmentFacilityDeletePage: React.FC<EquipmentFacilityDeleteProps> = ({ itemType }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [itemName, setItemName] = useState('รายการนี้'); // เพิ่ม state สำหรับเก็บชื่อ
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchItemName = async () => {
            if (!id || !itemType) return;
            try {
                const numericId = parseInt(id, 10);
                let data;
                if (itemType === 'equipment') {
                    data = await getEquipmentById(numericId);
                } else {
                    data = await getFacilityById(numericId);
                }
                if (data && data.name) {
                    setItemName(data.name);
                }
            } catch (error) {
                console.error(`Failed to fetch ${itemType} name:`, error);
                setItemName('รายการนี้'); // ใช้ค่าเริ่มต้นหากเกิดข้อผิดพลาด
            } finally {
                setLoading(false);
            }
        };

        fetchItemName();
    }, [id, itemType]);

    const handleDelete = async () => {
        if (itemType && id) {
            try {
                const numericId = parseInt(id, 10);
                if (itemType === 'equipment') {
                    await deleteEquipment(numericId);
                } else {
                    await deleteFacility(numericId);
                }
                // แก้ไขการนำทางให้กลับไปที่หน้าเดิม
                if (itemType === 'equipment') {
                    navigate('/admin/equipment');
                } else {
                    navigate('/admin/equipment?view=facility');
                }
            } catch (error) {
                console.error(`Failed to delete ${itemType} with ID: ${id}`, error);
                alert("ไม่สามารถลบข้อมูลได้");
            }
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
                    <p className="delete-message">คุณต้องการลบ {itemName} หรือไม่?</p>
                    <div className="delete-actions">
                        <button onClick={() => navigate(itemType === 'equipment' ? '/admin/equipment' : '/admin/equipment?view=facility')} className="back-button">ยกเลิก</button>
                        <button onClick={handleDelete} className="delete-button-confirm">ลบ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentFacilityDeletePage;