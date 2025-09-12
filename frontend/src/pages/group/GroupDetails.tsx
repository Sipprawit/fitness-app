// src/components/GroupDetails.tsx

import React from 'react';
import type { WorkoutGroup } from './groupSystem';
import './GroupDetails.css'; // สร้างไฟล์นี้ถ้ายังไม่มี

interface GroupDetailsProps {
  group: WorkoutGroup;
  onBack: () => void;
  onLeave: () => void;
  currentUserId: number;
  joinSuccessMessage?: string;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ group, onBack, onLeave, currentUserId, joinSuccessMessage }) => {
  const isMember = group.members.some(m => m.userId === currentUserId);
  return (
    <div className="group-details-card">
      
      {/* === ส่วนหัว === */}
      <div className="details-header">
        <h2 className="details-group-name">{group.name}</h2>
        <p className="details-group-id">#GROUPID: {group.id}</p>
      </div>

      {/* === ส่วนข้อมูลสรุป === */}
      <div className="details-info-section">
        <p><span className="info-label">เป้าหมาย:</span> <span className="info-value">{group.goal}</span></p>
        <p><span className="info-label">สมาชิก:</span> <span className="info-value">{group.members.length} / {group.maxMembers}</span></p>
        <p><span className="info-label">เริ่ม:</span> <span className="info-value">{group.startDate}</span></p>
        <p>
          <span className="info-label">สถานะ:</span> 
          <span className={`info-value status-indicator status-${group.status === 'เปิดรับสมัคร' ? 'open' : 'closed'}`}>
            {group.status}
          </span>
        </p>
      </div>

      {/* === ส่วนรายชื่อสมาชิก === */}
      <div className="details-members-section">
        <h3 className="section-title">สมาชิก</h3>
        {group.members.length > 0 ? (
          <table className="members-table">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME</th>
                <th>USER ID</th>
                <th>JOINED AT</th>
              </tr>
            </thead>
            <tbody>
              {group.members.map((member, index) => (
                <tr key={member.userId}>
                  <td>{index + 1}.</td>
                  <td>{member.name}</td>
                  <td>{member.userId}</td>
                  <td>{member.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-members-message">ยังไม่มีสมาชิกในกลุ่มนี้</p>
        )}
      </div>

      {/* === ส่วนปุ่ม === */}
      <div className="details-actions">
        <button className="back-button" onClick={onBack}>ย้อนกลับ</button>
        {isMember && (
          <button className="leave-button" onClick={onLeave}>ออกจากกลุ่ม</button>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;