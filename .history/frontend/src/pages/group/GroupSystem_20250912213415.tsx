// src/components/GroupSystem.tsx

import { useState, useMemo, useEffect } from 'react';
import GroupList from './../group/GroupList';
import CreateGroupForm from './../group/CreateGroupForm';
import GroupDetails from './../group/GroupDetails';
import { GetGroups, CreateGroup, JoinGroup, LeaveGroup } from '../../services/https';
import { useNotification } from '../../components/Notification/NotificationProvider';

export interface GroupMember {
  userId: number;
  name: string;
  joinedAt: string;
}

export interface WorkoutGroup {
  id: number;
  name: string;
  goal: string;
  members: GroupMember[];
  maxMembers: number;
  startDate: string;
  status: 'เปิดรับสมัคร' | 'ปิดรับสมัคร';
}

const GroupSystem = () => {
  const [groups, setGroups] = useState<WorkoutGroup[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'details'>('list');
  const [selectedGroup, setSelectedGroup] = useState<WorkoutGroup | null>(null);
  const { showNotification } = useNotification();
  
  // === จุดที่แก้ไข 1: เพิ่ม State สำหรับเก็บคำค้นหา ===
  const [searchTerm, setSearchTerm] = useState('');
  // === สิ้นสุดจุดที่แก้ไข 1 ===

  // === เพิ่ม State สำหรับแสดงข้อความยืนยันการเข้าร่วมกลุ่ม ===
  const [joinSuccessMessage, setJoinSuccessMessage] = useState<string>('');
  // === สิ้นสุดการเพิ่ม State ===

  const currentUserId = Number(localStorage.getItem('id') || 0);

  const loadGroups = async (): Promise<WorkoutGroup[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found.');
      return [];
    }
    
    try {
      const res = await GetGroups();
      if (res.status !== 200) {
        console.error('API Error:', res.data);
        setGroups([]);
        return [];
      }
      
      const raw = Array.isArray(res.data) ? res.data : [];
      console.log('Raw groups data from API:', raw);
      const normalized: WorkoutGroup[] = raw.map((g: any) => {
        console.log('Processing group:', g.name, 'Members:', g.members);
        return {
        id: g.ID ?? g.id,
        name: g.name ?? g.Name,
        goal: g.goal ?? g.Goal ?? '',
        maxMembers: g.max_members ?? g.MaxMembers ?? 0,
        startDate: (g.start_date ?? g.StartDate) ? new Date(g.start_date ?? g.StartDate).toISOString().split('T')[0] : '',
        status: (g.status ?? g.Status ?? 'เปิดรับสมัคร') as WorkoutGroup['status'],
        members: Array.isArray(g.members) ? g.members.map((m: any) => {
          console.log('Processing member:', m, 'joined_at:', m.joined_at, 'created_at:', m.created_at);
          // ลองใช้ created_at หาก joined_at ไม่มี
          const joinedDate = m.joined_at || m.created_at || m.CreatedAt;
          console.log('Final joined date:', joinedDate);
          
          // หากไม่มีข้อมูลวันที่ ให้ใช้วันที่ปัจจุบันเป็น fallback
          const displayDate = joinedDate ? 
            new Date(joinedDate).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }) : 
            new Date().toLocaleDateString('th-TH', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
            
          return {
            userId: m.ID ?? m.id,
            name: m.name ?? (m.FirstName ? `${m.FirstName} ${m.LastName ?? ''}` : ''),
            joinedAt: displayDate,
          };
        }) : [],
        };
      });
      setGroups(normalized);
      return normalized;
    } catch (e) {
      console.error('Failed to load groups', e);
      setGroups([]);
      return [];
    }
  };

  useEffect(() => {
    loadGroups();
    const onFocus = () => loadGroups();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const handleCreateGroup = async (newGroupData: Omit<WorkoutGroup, 'id' | 'members'>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification({
        type: 'error',
        title: 'ไม่สามารถเข้าสู่ระบบได้',
        message: 'กรุณาเข้าสู่ระบบใหม่',
        duration: 3000
      });
      return;
    }
    
    try {
      const response = await CreateGroup({
        name: newGroupData.name,
        goal: newGroupData.goal,
        maxMembers: newGroupData.maxMembers,
        status: newGroupData.status,
        startDate: newGroupData.startDate, // YYYY-MM-DD
      });
      
      if (response.status === 200 || response.status === 201) {
        showNotification({
          type: 'success',
          title: 'สร้างกลุ่มสำเร็จ',
          message: `สร้างกลุ่ม "${newGroupData.name}" เรียบร้อยแล้ว`,
          duration: 2000
        });
        await loadGroups();
        setCurrentView('list');
      } else {
        const msg = response.data?.error || 'สร้างกลุ่มไม่สำเร็จ';
        showNotification({
          type: 'error',
          title: 'ไม่สามารถสร้างกลุ่มได้',
          message: msg,
          duration: 3000
        });
      }
    } catch (e) {
      console.error('Failed to create group', e);
      const msg = (e as any)?.response?.data?.error || 'สร้างกลุ่มไม่สำเร็จ';
      showNotification({
        type: 'error',
        title: 'ไม่สามารถสร้างกลุ่มได้',
        message: msg,
        duration: 3000
      });
    }
  };

  const handleViewGroup = (group: WorkoutGroup) => {
    setSelectedGroup(group);
    setCurrentView('details');
  };

  const handleJoinGroup = async (groupId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification({
        type: 'error',
        title: 'ไม่สามารถเข้าสู่ระบบได้',
        message: 'กรุณาเข้าสู่ระบบใหม่',
        duration: 3000
      });
      return;
    }
    
    try {
      const response = await JoinGroup(groupId);
      
      if (response.status === 200 || response.status === 201) {
        // แสดงข้อความยืนยันการเข้าร่วมกลุ่ม
        setJoinSuccessMessage('เข้าร่วมกลุ่มสำเร็จแล้ว!');
        
        showNotification({
          type: 'success',
          title: 'เข้าร่วมกลุ่มสำเร็จ',
          message: 'เข้าร่วมกลุ่มเรียบร้อยแล้ว',
          duration: 2000
        });
        
        // รีโหลดรายการกลุ่ม แล้วเปิดหน้ารายละเอียดของกลุ่มที่เพิ่งเข้าร่วม
        const updatedGroups = await loadGroups();
        const justJoined = updatedGroups.find(g => g.id === groupId);
        if (justJoined) {
          setSelectedGroup(justJoined);
          setCurrentView('details');
        }
        
        // ลบข้อความยืนยันหลังจาก 3 วินาที
        setTimeout(() => {
          setJoinSuccessMessage('');
        }, 3000);
      } else {
        const msg = response.data?.error || 'เข้าร่วมกลุ่มไม่สำเร็จ';
        showNotification({
          type: 'error',
          title: 'ไม่สามารถเข้าร่วมกลุ่มได้',
          message: msg,
          duration: 3000
        });
      }
    } catch (e) {
      console.error('Failed to join group', e);
      const msg = (e as any)?.response?.data?.error || 'เข้าร่วมกลุ่มไม่สำเร็จ';
      showNotification({
        type: 'error',
        title: 'ไม่สามารถเข้าร่วมกลุ่มได้',
        message: msg,
        duration: 3000
      });
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    try {
      const response = await LeaveGroup(groupId);
      
      if (response.status === 200 || response.status === 201) {
        showNotification({
          type: 'success',
          title: 'ออกจากกลุ่มสำเร็จ',
          message: 'ออกจากกลุ่มเรียบร้อยแล้ว',
          duration: 2000
        });
        await loadGroups();
        setCurrentView('list');
      } else {
        const msg = response.data?.error || 'ออกจากกลุ่มไม่สำเร็จ';
        showNotification({
          type: 'error',
          title: 'ไม่สามารถออกจากกลุ่มได้',
          message: msg,
          duration: 3000
        });
      }
    } catch (e) {
      console.error('Failed to leave group', e);
      showNotification({
        type: 'error',
        title: 'ไม่สามารถออกจากกลุ่มได้',
        message: 'ออกจากกลุ่มไม่สำเร็จ',
        duration: 3000
      });
    }
  };

  // === จุดที่แก้ไข 2: สร้างรายการกลุ่มที่กรองตามคำค้นหา ===
  const filteredGroups = useMemo(() => {
    if (!searchTerm) {
      return groups; // ถ้าไม่มีคำค้นหา ให้แสดงทั้งหมด
    }
    return groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]); // จะคำนวณใหม่เมื่อ groups หรือ searchTerm เปลี่ยน
  // === สิ้นสุดจุดที่แก้ไข 2 ===

  switch (currentView) {
    case 'create':
      return <CreateGroupForm onSubmit={handleCreateGroup} onBack={() => setCurrentView('list')} />;
    case 'details':
      return <GroupDetails group={selectedGroup!} onBack={() => setCurrentView('list')} onLeave={() => handleLeaveGroup(selectedGroup!.id)} currentUserId={currentUserId} joinSuccessMessage={joinSuccessMessage} />;
    case 'list':
    default:
      // === จุดที่แก้ไข 3: เพิ่มช่องค้นหาและส่ง `filteredGroups` ไปแสดงผล ===
      return (
        <div className="group-list-view">
          <div className="filter-bar">
            <input
              type="text"
              placeholder="ค้นหากลุ่ม..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* คุณอาจจะเพิ่มปุ่มค้นหาตรงนี้ถ้าต้องการ */}
          </div>
          <GroupList
            groups={filteredGroups} // <--- ส่งกลุ่มที่กรองแล้วไปแสดง
            onCreate={() => setCurrentView('create')}
            onView={handleViewGroup}
            onJoin={handleJoinGroup}
            currentUserId={currentUserId}
          />
        </div>
      );
      // === สิ้นสุดจุดที่แก้ไข 3 ===
  }
};

export default GroupSystem;