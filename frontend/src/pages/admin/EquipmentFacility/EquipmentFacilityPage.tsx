// src/pages/admin/EquipmentFacility/EquipmentFacilityPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Equipment, Facility } from '../../../types'; // ต้องแก้ไข type ในไฟล์นี้ด้วย
import { getAllEquipments, getAllFacilities } from '../../../services/apiService';
import './EquipmentFacility.css';

type ViewMode = 'equipment' | 'facility';

const EquipmentFacilityPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [viewMode, setViewMode] = useState<ViewMode>('equipment');
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ฟังก์ชันแปลงสถานะเป็นภาษาไทย
    const getStatusThai = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'Available': 'พร้อมใช้งาน',
            'Maintenance': 'ซ่อมบำรุง',
            'Broken': 'เสีย',
            'Open': 'เปิดใช้งาน'
        };
        return statusMap[status] || status;
    };

    // ฟังก์ชันแปลงสภาพเป็นภาษาไทย
    const getConditionThai = (condition: string) => {
        const conditionMap: { [key: string]: string } = {
            'Good': 'ดี',
            'Needs Repair': 'ต้องซ่อม',
            'Needs Replacement': 'ต้องเปลี่ยน'
        };
        return conditionMap[condition] || condition;
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const view = queryParams.get('view');
        if (view === 'facility') {
            setViewMode('facility');
        } else {
            setViewMode('equipment');
        }
    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [eqData, faData] = await Promise.all([
                    getAllEquipments(),
                    getAllFacilities(),
                ]);
                setEquipments(Array.isArray(eqData) ? eqData : []);
                setFacilities(Array.isArray(faData) ? faData : []);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("ไม่สามารถโหลดข้อมูลได้");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>กำลังโหลดข้อมูล...</div>;
    if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;

    return (
        <div className="main-content">
            <div className="content-section">
                <div className="header-with-button">
                    <h2>จัดการอุปกรณ์และสิ่งอำนวยความสะดวก</h2>
                    <button
                        onClick={() => {
                            if (viewMode === 'equipment') navigate('/equipment/add');
                            else navigate('/facility/add');
                        }}
                        className="add-button-main"
                    >
                        +
                    </button>
                </div>

                <div className="view-toggle">
                    <button onClick={() => navigate('/admin/equipment')} className={viewMode === 'equipment' ? 'active' : ''}>Equipment</button>
                    <button onClick={() => navigate('/admin/equipment?view=facility')} className={viewMode === 'facility' ? 'active' : ''}>Facility</button>
                </div>

                {viewMode === 'equipment' ? (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ชื่อ</th>
                                    <th>ประเภท</th>
                                    <th>โซน</th> {/* เปลี่ยนจาก Location เป็น Zone */}
                                    <th>สถานะ</th>
                                    <th>สภาพ</th> {/* เพิ่ม Condition */}
                                    <th>ชั่วโมงการใช้งาน</th> {/* เพิ่ม Usage Hours */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(equipments) && equipments.length > 0 ? (
                                    equipments.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.type}</td>
                                            <td>{item.zone}</td> {/* แสดง Zone */}
                                            <td><span className={`status ${item.status.toLowerCase()}`}>{getStatusThai(item.status)}</span></td>
                                            <td><span className={`condition ${item.condition.toLowerCase().replace(' ', '-')}`}>{getConditionThai(item.condition)}</span></td> {/* แสดง Condition */}
                                            <td>{item.usageHours}</td> {/* แสดง Usage Hours */}
                                            <td className="actions-cell">
                                                <button onClick={() => navigate(`/equipment/edit/${item.id}`)} className="icon-button edit-button">✏️</button>
                                                <button onClick={() => navigate(`/equipment/delete/${item.id}`)} className="icon-button delete-button">🗑️</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={7}>ยังไม่มีอุปกรณ์ในขณะนี้</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // ส่วนของ Facility ยังคงเดิม
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ชื่อ</th>
                                    <th>โซน</th>
                                    <th>สถานะ</th>
                                    <th>ความจุ</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(facilities) && facilities.length > 0 ? (
                                    facilities.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.zone}</td>
                                            <td><span className={`status ${item.status.toLowerCase()}`}>{getStatusThai(item.status)}</span></td>
                                            <td>{item.capacity}</td>
                                            <td className="actions-cell">
                                                <button onClick={() => navigate(`/facility/edit/${item.id}`)} className="icon-button edit-button">✏️</button>
                                                <button onClick={() => navigate(`/facility/delete/${item.id}`)} className="icon-button delete-button">🗑️</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5}>ยังไม่มีสิ่งอำนวยความสะดวกในขณะนี้</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquipmentFacilityPage;