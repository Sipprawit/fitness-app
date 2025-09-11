export interface Activity {
  id?: number;          // PK
  user_id?: number;     // FK -> Users
  health_id: number;    // FK -> Health
  type?: string;        // ประเภทกิจกรรม
  distance?: number;    // ระยะทาง
  duration?: number;    // เวลา (นาที/ชั่วโมง)
  calories?: number;    // แคลอรี่ที่คำนวณแล้ว
  date: string;         // ISO string (new Date().toISOString())
}
