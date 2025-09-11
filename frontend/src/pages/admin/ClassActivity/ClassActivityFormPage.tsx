// src/pages/admin/ClassActivity/ClassActivityFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ClassActivity } from '../../../types';
import { getClassById, createClass, updateClass, uploadImage } from '../../../services/apiService';
import './ClassActivity.css';

const ClassActivityFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState<any>({
        name: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        capacity: '',
        imageUrl: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && id) {
            const fetchClassData = async () => {
                try {
                    const numericId = parseInt(id, 10);
                    const data = await getClassById(numericId);
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        date: data.date || '',
                        startTime: data.startTime || '',
                        endTime: data.endTime || '',
                        location: data.location || '',
                        capacity: data.capacity ? String(data.capacity) : '',
                        imageUrl: data.imageUrl || '',
                    });
                    if (data.imageUrl) {
                        setPreviewImage(data.imageUrl);
                    }
                } catch (error) {
                    console.error("Failed to fetch class data:", error);
                }
            };
            fetchClassData();
        }
    }, [id, isEditMode]);

    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewImage(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (formData.imageUrl) {
            setPreviewImage(formData.imageUrl);
        } else {
            setPreviewImage(null);
        }
    }, [selectedFile, formData.imageUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setFormData((prev: any) => ({ ...prev, imageUrl: '' }));
        } else {
            setSelectedFile(null);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        let finalImageUrl = formData.imageUrl;
        
        try {
            if (selectedFile) {
                finalImageUrl = await uploadImage(selectedFile);
            }

            const submissionData = {
                name: formData.name,
                description: formData.description,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                location: formData.location,
                capacity: parseInt(String(formData.capacity || 0), 10),
                imageUrl: finalImageUrl || '',
            };

            if (isEditMode && id) {
                const numericId = parseInt(id, 10);
                await updateClass(numericId, submissionData as any);
            } else {
                await createClass(submissionData as any);
            }
            navigate('/admin/classes');
        } catch (error) {
            console.error("Failed to save class:", error);
            alert("ไม่สามารถบันทึกข้อมูลได้");
        } finally {
            setIsLoading(false);
        }
    };

    const renderImageInput = () => (
        <div className="form-field full-width">
            <label className="required">รูปภาพ</label>
            <div className="image-input-container">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!isEditMode || (isEditMode && !formData.imageUrl && !selectedFile)}
                />
            </div>

            {previewImage && (
                <div className="image-preview">
                    <img src={previewImage} alt="ตัวอย่างรูปภาพ" />
                </div>
            )}
        </div>
    );

    if (isLoading) return <div>กำลังบันทึกข้อมูล...</div>;

    return (
        <div className="main-content">
            <div className="content-section">
                <h2 className="form-title">{isEditMode ? 'แก้ไขข้อมูลคลาส/กิจกรรม' : 'เพิ่มข้อมูลคลาส/กิจกรรม'}</h2>
                <form onSubmit={handleSubmit} className="form-grid-container">
                    <div className="form-field-full">
                        <label className="required">ชื่อกิจกรรม</label>
                        <input name="name" value={formData.name || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-field-full">
                        <label className="required">รายละเอียด</label>
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={4} required/>
                    </div>
                    <div className="form-field">
                        <label className="required">วันที่</label>
                        <input type="date" name="date" value={formData.date || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label className="required">เวลาเริ่ม</label>
                        <input name="startTime" placeholder="13:00" value={formData.startTime || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label className="required">เวลาสิ้นสุด</label>
                        <input name="endTime" placeholder="14:00" value={formData.endTime || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label className="required">สถานที่</label>
                        <input name="location" value={formData.location || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label className="required">ความจุ (คน)</label>
                        <input type="number" name="capacity" value={formData.capacity || ''} onChange={handleChange} required min="1" />
                    </div>
                    
                    {renderImageInput()}
                    
                    <div className="form-actions-bottom">
                        <button type="button" onClick={() => navigate('/admin/classes')} className="back-button">ยกเลิก</button>
                        <button type="submit" className="save-button">{isEditMode ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่ม'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassActivityFormPage;