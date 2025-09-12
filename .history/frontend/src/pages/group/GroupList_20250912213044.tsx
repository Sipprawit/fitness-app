// src/components/GroupList.tsx
import './GroupList.css';
import React from 'react';
import type { WorkoutGroup } from './groupSystem';
import { useNotification } from '../../components/Notification/NotificationProvider';

interface GroupListProps {
  groups: WorkoutGroup[];
  onCreate: () => void;
  onView: (group: WorkoutGroup) => void;
  onJoin: (groupId: number) => void;
  currentUserId: number;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onCreate, onView, onJoin, currentUserId }) => {
  return (
    <div className="group-list-container">
      {/* === จุดที่แก้ไข: ลบ filter-bar ทั้งหมดออกไป === */}
      
      <button className="create-group-btn" onClick={onCreate}>+ สร้างกลุ่มใหม่</button>
      
      <div className="groups">
        {groups.map(group => (
          <div key={group.id} className="group-card">
            <h4>{group.name}</h4>
            <p>เป้าหมาย: {group.goal}</p>
            <p>สมาชิก: {group.members.length}/{group.maxMembers}</p>
            <p>เริ่ม: {group.startDate}</p>
            <p>สถานะ: {group.members.length >= group.maxMembers ? 'เต็มแล้ว' : group.status}</p>
            {group.members.some(m => m.userId === currentUserId)
              ? (
                  <button className="join-button" onClick={() => onView(group)}>ดูรายละเอียด</button>
                )
              : (
                  <>
                    <button
                      className="join-button"
                      onClick={() => {
                        if (group.members.length >= group.maxMembers) {
                          alert('กลุ่มเต็มแล้ว');
                          return;
                        }
                        onJoin(group.id);
                      }}
                      disabled={group.members.length >= group.maxMembers}
                    >
                      {group.members.length >= group.maxMembers ? 'เต็มแล้ว' : 'เข้าร่วม'}
                    </button>
                    <button className="join-button" onClick={() => onView(group)}>ดูรายละเอียด</button>
                  </>
                )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;