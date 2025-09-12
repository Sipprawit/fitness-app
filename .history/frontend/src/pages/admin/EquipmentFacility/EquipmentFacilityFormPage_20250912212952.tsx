// src/pages/admin/EquipmentFacility/EquipmentFacilityFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Equipment, Facility } from '../../../types';
import { getEquipmentById, createEquipment, updateEquipment, getFacilityById, createFacility, updateFacility } from '../../../services/apiService';
import { useNotification } from '../../../components/Notification/NotificationProvider';
import './EquipmentFacility.css';

interface EquipmentFacilityFormProps {
    itemType: 'equipment' | 'facility';
}

const EquipmentFacilityFormPage: React.FC<EquipmentFacilityFormProps> = ({ itemType }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (isEditMode && id && itemType) {
            const fetchData = async () => {
                if (!id) return;
                try {
                    const numericId = parseInt(id, 10);
                    let data;

                    if (itemType === 'equipment') {
                        data = await getEquipmentById(numericId);
                        setFormData({
                            ...data,
                        });
                    } else {
                        data = await getFacilityById(numericId);
                        setFormData({
                            ...data
                        });
                    }
                } catch (error) {
                    console.error(`Failed to fetch ${itemType} data:`, error);
                }
            };
            fetchData();
        }
    }, [id, isEditMode, itemType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (['usageHours', 'capacity'].includes(name) && value === '') {
            setFormData((prev: any) => ({ ...prev, [name]: 0 }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const submissionData = {
            ...formData,
            usageHours: parseInt(String(formData.usageHours || 0), 10),
            capacity: parseInt(String(formData.capacity || 0), 10),
        };

        try {
            if (isEditMode && id) {
                const numericId = parseInt(id, 10);
                if (itemType === 'equipment') {
                    await updateEquipment(numericId, submissionData as Equipment);
                } else {
                    await updateFacility(numericId, submissionData as Facility);
                }
            } else {
                if (itemType === 'equipment') {
                    await createEquipment(submissionData as Omit<Equipment, 'id'>);
                } else {
                    await createFacility(submissionData as Omit<Facility, 'id'>);
                }
            }
            navigate(itemType === 'facility' ? '/admin/equipment?view=facility' : '/admin/equipment');
        } catch (error) {
            console.error(`Failed to save ${itemType}:`, error);
            alert("ไม่สามารถบันทึกข้อมูลได้");
        }
    };
    
    const renderEquipmentForm = () => (
        <>
            <div className="form-field">
                <label className="required">ชื่อ</label>
                <input name="name" value={formData.name || ''} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label>ประเภท</label>
                <input name="type" value={formData.type || ''} onChange={handleChange} />
            </div>
            <div className="form-field">
                <label>โซน</label>
                <input name="zone" value={formData.zone || ''} onChange={handleChange} />
            </div>
            <div className="form-field">
                <label className="required">สถานะ</label>
                <select name="status" value={formData.status || ''} onChange={handleChange} required>
                    <option value="" disabled>--- เลือกสถานะ ---</option>
                    <option value="Available">พร้อมใช้งาน</option>
                    <option value="Maintenance">ซ่อมบำรุง</option>
                    <option value="Broken">เสีย</option>
                </select>
            </div>
            <div className="form-field">
                <label>สภาพ</label>
                <select name="condition" value={formData.condition || ''} onChange={handleChange}>
                    <option value="" disabled>--- เลือกสภาพ ---</option>
                    <option value="Good">ดี</option>
                    <option value="Needs Repair">ต้องซ่อม</option>
                    <option value="Needs Replacement">ต้องเปลี่ยน</option>
                </select>
            </div>
            <div className="form-field">
                <label>ชั่วโมงการใช้งาน</label>
                <input type="number" name="usageHours" value={formData.usageHours || ''} onChange={handleChange} onBlur={handleBlur} />
            </div>
        </>
    );

    const renderFacilityForm = () => (
        <>
            <div className="form-field">
                <label className="required">ชื่อ</label>
                <input name="name" value={formData.name || ''} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label>โซน</label>
                <input name="zone" value={formData.zone || ''} onChange={handleChange} />
            </div>
            <div className="form-field">
                <label className="required">ความจุ</label>
                <input type="number" name="capacity" value={formData.capacity || ''} onChange={handleChange} onBlur={handleBlur} required />
            </div>
            <div className="form-field">
                <label className="required">สถานะ</label>
                <select name="status" value={formData.status || ''} onChange={handleChange} required>
                    <option value="" disabled>--- เลือกสถานะ ---</option>
                    <option value="Available">เปิดใช้งาน</option>
                    <option value="Maintenance">ซ่อมบำรุง</option>
                </select>
            </div>
        </>
    );

    return (
        <div className="main-content">
            <div className="content-section">
                <h2 className="form-title">
                    {isEditMode ? 'แก้ไข' : 'เพิ่ม'} {itemType === 'equipment' ? 'อุปกรณ์' : 'สิ่งอำนวยความสะดวก'}
                </h2>
                <form onSubmit={handleSubmit} className="form-grid-container">
                    {itemType === 'equipment' ? renderEquipmentForm() : renderFacilityForm()}
                    <div className="form-actions-bottom">
                        <button type="button" onClick={() => navigate(itemType === 'equipment' ? '/admin/equipment' : '/admin/equipment?view=facility')} className="back-button">ยกเลิก</button>
                        <button type="submit" className="save-button">{isEditMode ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่ม'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentFacilityFormPage;