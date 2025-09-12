// src/components/CreateGroupForm.tsx
import './CreateGroupForm.css';
import React, { useState } from 'react';
import { useNotification } from '../../components/Notification/NotificationProvider';

interface CreateGroupFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [maxMembers, setMaxMembers] = useState(10);
  const { showNotification } = useNotification();
  
  // === จุดที่แก้ไข 1: เพิ่ม State สำหรับเก็บวันที่ และกำหนดค่าเริ่มต้นเป็นวันปัจจุบัน ===
  const getTodayString = () => {
    const today = new Date();
    // แปลงเป็นรูปแบบ YYYY-MM-DD ที่ input type="date" ต้องการ
    return today.toISOString().split('T')[0];
  };
  const [startDate, setStartDate] = useState(getTodayString());
  // === สิ้นสุดจุดที่แก้ไข 1 ===

  const handleSubmit = () => {
    // เพิ่มการตรวจสอบว่าได้เลือกวันที่แล้ว
    if (!name || !goal || !startDate) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    // === จุดที่แก้ไข 3: ส่ง `startDate` ที่เลือกไปด้วย ===
    onSubmit({ name, goal, maxMembers, status: 'เปิดรับสมัคร', startDate });
  };

  return (
    <div className="form-container">
      <h3>สร้างกลุ่มใหม่</h3>
      <div className="form-field">
        <label>ชื่อกลุ่ม:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-field">
        <label>เป้าหมาย:</label>
        <input type="text" value={goal} onChange={e => setGoal(e.target.value)} />
      </div>
      <div className="form-field">
        <label>จำนวนสมาชิกสูงสุด:</label>
        <input type="number" value={maxMembers} onChange={e => setMaxMembers(parseInt(e.target.value))} min="1" />
      </div>
      
      {/* === จุดที่แก้ไข 2: เพิ่มช่องเลือกวันที่ === */}
      <div className="form-field">
        <label>วันที่เริ่ม:</label>
        <input 
          type="date" 
          value={startDate} 
          onChange={e => setStartDate(e.target.value)}
          min={getTodayString()} // กำหนดให้เลือกได้ตั้งแต่วันนี้เป็นต้นไป
        />
      </div>
      {/* === สิ้นสุดจุดที่แก้ไข 2 === */}
      
      <div className="form-actions">
        <button onClick={onBack}>ย้อนกลับ</button>
        <button className="submit-button" onClick={handleSubmit}>เสร็จสิ้น</button>
      </div>
    </div>
  );
};

export default CreateGroupForm;