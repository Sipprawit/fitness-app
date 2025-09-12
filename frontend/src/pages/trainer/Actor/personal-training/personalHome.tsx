import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Select, 
  Button, 
  Space, 
  Card,
  Modal,
  message
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { GetCustomersByTrainerID, GetPersonalTrainingProgramsByCustomerID, GetCustomerBookedTimes, DeletePersonalTrainingProgram } from '../../../../services/https';
import type { UsersInterface } from '../../../../interface/IUser';
import type { IPersonalTrain } from '../../../../interface/IPersonalTrain';
import type { TrainBookingInterface } from '../../../../interface/ITrainBooking';

const { Title, Text } = Typography;

const PersonalHome: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [customers, setCustomers] = useState<UsersInterface[]>([]);
  const [trainingPrograms, setTrainingPrograms] = useState<IPersonalTrain[]>([]);
  const [bookedTimes, setBookedTimes] = useState<TrainBookingInterface[]>([]);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันลบโปรแกรมการฝึก
  const handleDeleteProgram = (programId: number) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณต้องการลบโปรแกรมการฝึกส่วนตัวนี้หรือไม่?',
      okText: 'ลบ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        setLoading(true);
        try {
          const response = await DeletePersonalTrainingProgram(programId);
          
          if (response.status === 200) {
            message.success('ลบโปรแกรมการฝึกสำเร็จ');
            // ลบโปรแกรมออกจาก state โดยตรง (เร็วกว่า)
            setTrainingPrograms(prevPrograms => 
              prevPrograms.filter(program => program.ID !== programId)
            );
          } else {
            message.error('เกิดข้อผิดพลาดในการลบโปรแกรมการฝึก');
          }
        } catch (error) {
          message.error('เกิดข้อผิดพลาดในการลบโปรแกรมการฝึก');
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // ดึงข้อมูลลูกค้าจาก API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // ดึงข้อมูล trainer ID จาก localStorage
        const trainerData = localStorage.getItem('user');
        
        if (!trainerData) {
          console.error('No trainer data found in localStorage');
          setCustomers([]);
          return;
        }
        
        console.log('Fetching customers for logged-in trainer');
        const response = await GetCustomersByTrainerID();
        console.log('API Response:', response);
        
        if (response.status === 200 && response.data) {
          console.log('Customers data:', response.data);
          console.log('Number of customers:', response.data.length);
          setCustomers(response.data);
        } else {
          console.error('Failed to fetch customers:', response.data);
          setCustomers([]);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      }
    };

    fetchCustomers();
  }, []);

  // ดึงข้อมูลโปรแกรมการฝึกส่วนตัวเมื่อเลือกลูกค้า
  const fetchTrainingPrograms = async (customerId: number) => {
    try {
      console.log('Fetching training programs for customer ID:', customerId);
      const response = await GetPersonalTrainingProgramsByCustomerID(customerId);
      console.log('Training Programs Response:', response);
      
      if (response.status === 200 && response.data) {
        console.log('Training Programs data:', response.data);
        setTrainingPrograms(response.data);
      } else {
        console.error('Failed to fetch training programs:', response.data);
        setTrainingPrograms([]);
      }
    } catch (error) {
      console.error('Error fetching training programs:', error);
      setTrainingPrograms([]);
    }
  };

  // ดึงข้อมูลเวลาที่ลูกค้าจองไว้
  const fetchBookedTimes = async (customerId: number) => {
    try {
      console.log('Fetching booked times for customer ID:', customerId);
      const response = await GetCustomerBookedTimes(customerId);
      console.log('Booked times response:', response);
      
      if (response.status === 200 && response.data) {
        console.log('Booked times data:', response.data);
        setBookedTimes(response.data);
      } else {
        console.log('No booked times found');
        setBookedTimes([]);
      }
    } catch (error) {
      console.error('Error fetching booked times:', error);
      setBookedTimes([]);
    }
  };

  // จัดการการเลือกลูกค้า
  const handleCustomerSelect = (customer: UsersInterface) => {
    console.log('Selected customer:', customer);
    setSelectedCustomer(`${customer.first_name} ${customer.last_name}`);
    if (customer.ID) {
      localStorage.setItem('selectedCustomerId', customer.ID.toString());
      console.log('Fetching training programs for customer ID:', customer.ID);
      fetchTrainingPrograms(customer.ID);
      fetchBookedTimes(customer.ID);
    }
  };


  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        backgroundColor: '#f4f6f8ff',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <main
        style={{
          flex: 1,
          width: '100%',
          padding: '16px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          maxWidth: '100%',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ color: '#010000ff', margin: 0 }}>
            โปรแกรมฝึกส่วนตัวของลูกค้า
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            ค้นหาโปรแกรมฝึกส่วนตัวของลูกค้าตามชื่อ
          </Text>
        </div>

        {/* Search and Filter Section */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>ค้นหาชื่อลูกค้า</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  จำนวนลูกค้า: {customers.length}
                </Text>
                 <Select
                   placeholder="เลือกชื่อลูกค้า"
                   value={selectedCustomer || undefined}
                   onChange={(value) => {
                     console.log('Select changed to:', value);
                     const customer = customers.find(c => `${c.first_name} ${c.last_name}` === value);
                     console.log('Found customer:', customer);
                     if (customer) {
                       handleCustomerSelect(customer);
                     }
                   }}
                   style={{ width: '100%' }}
                   size="large"
                   options={customers.map(customer => ({
                     value: `${customer.first_name} ${customer.last_name}`,
                     label: `${customer.first_name} ${customer.last_name}`,
                   }))}
                   disabled={customers.length === 0}
                 />
              </Space>
            </Col>
            
          </Row>
        </Card>


        {/* Customer Training Table */}
        {!selectedCustomer ? (
          <Card style={{ textAlign: 'center', padding: 48 }}>
            <Text type="secondary" style={{ fontSize: 18 }}>
              เลือกลูกค้าเพื่อดูรายการฝึกส่วนตัวของแต่ละคน
            </Text>
          </Card>
        ) : (
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Title level={3} style={{ color: '#010000ff', margin: 0 }}>
                รายการฝึกส่วนตัวของ {selectedCustomer}
              </Title>
            </div>
            
            {/* Booked Times Section */}
            {selectedCustomer && (
              <Card style={{ marginBottom: 24 }}>
                <Title level={4} style={{ color: '#010000ff', marginBottom: 16 }}>
                  เวลาที่จองไว้
                </Title>
                {bookedTimes.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d9d9d9' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                          <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>วันที่</th>
                          <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>เวลาเริ่ม</th>
                          <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>เวลาสิ้นสุด</th>
                          <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>สถานะ</th>
                          <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>การดำเนินการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookedTimes.map((booking) => (
                          <tr key={booking.ID}>
                            <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                              {booking.schedule?.available_date ? new Date(booking.schedule.available_date).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
                            </td>
                            <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                              {booking.schedule?.start_time ? new Date(booking.schedule.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : 'ไม่ระบุ'}
                            </td>
                            <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                              {booking.schedule?.end_time ? new Date(booking.schedule.end_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : 'ไม่ระบุ'}
                            </td>
                            <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '4px', 
                                backgroundColor: booking.booking_status === 'Confirmed' ? '#52c41a' : '#faad14',
                                color: 'white',
                                fontSize: '12px'
                              }}>
                                {booking.booking_status === 'Confirmed' ? 'ยืนยันแล้ว' : 'รอยืนยัน'}
                              </span>
                            </td>
                            <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                              <Button 
                                type="primary" 
                                size="small"
                                style={{ backgroundColor: '#C50000' }}
                                onClick={() => {
                                  const selectedCustomerData = customers.find(c => `${c.first_name} ${c.last_name}` === selectedCustomer);
                                  if (selectedCustomerData && booking.schedule) {
                                    navigate('/trainer/personal-training/add', { 
                                      state: { 
                                        customerId: selectedCustomerData.ID,
                                        customerName: selectedCustomer,
                                        scheduleId: booking.schedule.ID,
                                        scheduleDate: booking.schedule.available_date,
                                        scheduleStartTime: booking.schedule.start_time,
                                        scheduleEndTime: booking.schedule.end_time
                                      } 
                                    });
                                  }
                                }}
                              >
                                เพิ่มโปรแกรมฝึก
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                    ไม่พบเวลาที่จองไว้
                  </div>
                )}
              </Card>
            )}
            
             {/* Training Programs Table */}
             <div style={{ overflowX: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d9d9d9' }}>
                 <thead>
                   <tr style={{ backgroundColor: '#f5f5f5' }}>
                     <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>วันที่</th>
                     <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>เวลา</th>
                     <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>เป้าหมาย</th>
                     <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>รูปแบบการฝึก</th>
                     <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>เทรนเนอร์</th>
                     <th style={{ padding: '12px', border: '1px solid #d9d9d9', textAlign: 'left' }}>การดำเนินการ</th>
                   </tr>
                 </thead>
                 <tbody>
                   {trainingPrograms.length > 0 ? (
                     trainingPrograms.map((program) => (
                       <tr key={program.ID}>
                         <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                           {new Date(program.date).toLocaleDateString('th-TH')}
                         </td>
                         <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                           {program.time}
                         </td>
                         <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                           {program.goal?.goal || 'ไม่ระบุ'}
                         </td>
                         <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                           {program.format}
                         </td>
                         <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                           {program.trainer_name ? `${program.trainer_name.first_name} ${program.trainer_name.last_name}` : 'ไม่ระบุ'}
                         </td>
                         <td style={{ padding: '12px', border: '1px solid #d9d9d9' }}>
                           <Space>
                             <Button 
                               type="primary" 
                               size="small"
                               style={{ backgroundColor: '#1890ff' }}
                               onClick={() => {
                                 // Navigate to edit page
                                 console.log('Program data:', program);
                                 console.log('Program ID:', program.ID);
                                 if (program.ID) {
                                   navigate(`/trainer/personal-training/edit/${program.ID}`);
                                 } else {
                                   message.error('ไม่พบ ID ของโปรแกรมการฝึก');
                                 }
                               }}
                             >
                               แก้ไข
                             </Button>
                             <Button 
                               type="primary" 
                               size="small"
                               style={{ backgroundColor: '#ff4d4f' }}
                               onClick={() => handleDeleteProgram(program.ID)}
                               loading={loading}
                             >
                               ลบ
                             </Button>
                           </Space>
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={6} style={{ padding: '48px', textAlign: 'center', border: '1px solid #d9d9d9' }}>
                         <Text type="secondary" style={{ fontSize: 16 }}>
                           ไม่มีข้อมูลโปรแกรมการฝึกส่วนตัวสำหรับลูกค้าคนนี้
                         </Text>
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PersonalHome;

