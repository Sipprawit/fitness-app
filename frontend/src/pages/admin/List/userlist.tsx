import { useState, useEffect } from "react";
import { message } from "antd";
import { GetUsers, GetTrainers } from "../../../services/https";
import type { UsersInterface } from "../../../interface/IUser";
import type { TrainerInterface } from "../../../interface/ITrainer";
import { useNavigate, useLocation } from "react-router-dom";
import "./userlist.css";

type ViewMode = 'members' | 'trainers';

function Customers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('members');
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [trainers, setTrainers] = useState<TrainerInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const getUsers = async () => {
    try {
      const res = await GetUsers();
      if (res.status === 200) {
        console.log("Users data from API:", res.data);
        setUsers(res.data);
      } else {
        setUsers([]);
        messageApi.open({ type: "error", content: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
      }
    } catch (error) {
      setUsers([]);
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    }
  };

  const getTrainers = async () => {
    try {
      const res = await GetTrainers();
      if (res.status === 200) {
        setTrainers(res.data);
      } else {
        setTrainers([]);
        messageApi.open({ type: "error", content: "ไม่สามารถดึงข้อมูลเทรนเนอร์ได้" });
      }
    } catch (error) {
      setTrainers([]);
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    }
  };

  const handleDeleteUser = (id: number | undefined) => {
    if (!id) return;
    navigate(`/user/delete/${id}`);
  };

  const handleDeleteTrainer = (id: number | undefined) => {
    if (!id) return;
    navigate(`/trainer/delete/${id}`);
  };

  // ฟังก์ชันแปลงสถานะเป็นภาษาไทย
  const getActorThai = (actor: string) => {
    const actorMap: { [key: string]: string } = {
      'admin': 'ผู้ดูแลระบบ',
      'member': 'สมาชิก',
      'trainer': 'เทรนเนอร์'
    };
    return actorMap[actor] || actor;
  };

  // ฟังก์ชันแปลงเพศเป็นภาษาไทย
  const getGenderThai = (gender: any) => {
    if (typeof gender === 'string') return gender;
    if (gender && gender.gender) return gender.gender;
    return '-';
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const view = queryParams.get('view');
    if (view === 'trainers') {
      setViewMode('trainers');
    } else {
      setViewMode('members');
    }
  }, [location.search]);

  useEffect(() => {
    getUsers();
    getTrainers();
  }, []);

  return (
    <>
      {contextHolder}
      <div className="main-content">
        <div className="content-section">
          <div className="header-with-button">
            <h2>จัดการสมาชิกและเทรนเนอร์</h2>
            <button
              onClick={() => {
                if (viewMode === 'members') navigate('/customer/create');
                else navigate('/trainer/profile/addTrainer');
              }}
              className="add-button-main"
            >
              +
            </button>
          </div>

          <div className="view-toggle">
            <button onClick={() => navigate('/admin/List')} className={viewMode === 'members' ? 'active' : ''}>สมาชิก</button>
            <button onClick={() => navigate('/admin/List?view=trainers')} className={viewMode === 'trainers' ? 'active' : ''}>เทรนเนอร์</button>
          </div>

          {viewMode === 'members' ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>อีเมล</th>
                    <th>อายุ</th>
                    <th>เพศ</th>
                    <th>วันเกิด</th>
                    <th>บทบาท</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.ID || user.id || index}>
                        <td>{index + 1}</td>
                        <td>{user.first_name || '-'}</td>
                        <td>{user.last_name || '-'}</td>
                        <td>{user.email || '-'}</td>
                        <td>{user.age || '-'}</td>
                        <td>{getGenderThai(user.gender)}</td>
                        <td>{user.birthDay || user.birthday || '-'}</td>
                        <td><span className={`actor ${user.actor?.toLowerCase() || 'member'}`}>{getActorThai(user.actor || 'member')}</span></td>
                        <td className="actions-cell">
                          <button onClick={() => navigate(`/customer/edit/${user.ID || user.id}`)} className="icon-button edit-button">✏️</button>
                          {myId !== (user.ID || user.id)?.toString() && (
                            <button onClick={() => handleDeleteUser(user.ID || user.id)} className="icon-button delete-button">🗑️</button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={9}>ยังไม่มีสมาชิกในขณะนี้</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>อีเมล</th>
                    <th>ทักษะ</th>
                    <th>เบอร์โทร</th>
                    <th>เพศ</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(trainers) && trainers.length > 0 ? (
                    trainers.map((trainer, index) => (
                      <tr key={trainer.ID || index}>
                        <td>{index + 1}</td>
                        <td>{trainer.first_name || '-'}</td>
                        <td>{trainer.last_name || '-'}</td>
                        <td>{trainer.email || '-'}</td>
                        <td>{trainer.skill || '-'}</td>
                        <td>{trainer.tel || '-'}</td>
                        <td>{trainer.gender_id || '-'}</td>
                        <td className="actions-cell">
                          <button onClick={() => navigate(`/trainer/edit/${trainer.ID}`)} className="icon-button edit-button">✏️</button>
                          <button onClick={() => handleDeleteTrainer(trainer.ID)} className="icon-button delete-button">🗑️</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={8}>ยังไม่มีเทรนเนอร์ในขณะนี้</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Customers;
