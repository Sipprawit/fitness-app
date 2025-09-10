import type { UsersInterface } from "../../interface/IUser";
import type { SignInInterface } from "../../interface/SignIn";
import type { TrainerInterface } from "../../interface/ITrainer";
import type { ITrainerSchedule } from "../../interface/ITrainerSchedule";
import type { TrainBookingInterface } from "../../interface/ITrainBooking";
//import dayjs from "dayjs"; // เพิ่ม import dayjs

import axios, { type AxiosRequestConfig } from "axios";

// กำหนด base URL สำหรับ API
const apiUrl = "http://localhost:8000";

// ฟังก์ชันสำหรับสร้าง config พร้อม token
function authConfig(): AxiosRequestConfig {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ ใช้ Bearer เสมอ
      "Content-Type": "application/json",
    },
  };
}

// ฟังก์ชันสำหรับ Login (ไม่ต้องการ Token)
async function SignIn(data: SignInInterface) {
  try {
    return await axios.post(`${apiUrl}/signin`, data);
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลเพศ (ต้องการ Token)
async function GetGender() {
  try {
    return await axios.get(`${apiUrl}/genders`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด (ต้องการ Token)
async function GetUsers() {
  try {
    return await axios.get(`${apiUrl}/users`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก ID (ต้องการ Token)
async function GetUsersById(id: string) {
  try {
    return await axios.get(`${apiUrl}/user/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้ (ต้องการ Token)
async function UpdateUsersById(id: string, data: UsersInterface) {
  try {
    return await axios.put(`${apiUrl}/user/${id}`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับลบข้อมูลผู้ใช้ (ต้องการ Token)
async function DeleteUsersById(id: string) {
  try {
    return await axios.delete(`${apiUrl}/user/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับสร้างผู้ใช้ใหม่ (ไม่ต้องการ Token)
async function CreateUser(data: UsersInterface) {
  try {
    return await axios.post(`${apiUrl}/signup`, data);
  } catch (e: any) {
    return e.response;
  }
}


async function CreateTrainer(data: TrainerInterface) {
  try {
    return await axios.post(`${apiUrl}/trainers`, data, authConfig()); 
  } catch (e: any) {
    return e.response;
  }
}

async function GetTrainers() {
  try {
    return await axios.get(`${apiUrl}/trainers`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function DeleteTrainerById(id: number) {
  try {
    return await axios.delete(`${apiUrl}/trainers/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function UpdateTrainerById(id: number, data: TrainerInterface) {
  try {
    return await axios.put(`${apiUrl}/trainers/${id}`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetTrainerById(id: number) {
  try {
    return await axios.get(`${apiUrl}/trainers/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับสร้างตารางเทรน (ต้องการ Token)
async function CreateTrainerSchedule(data: ITrainerSchedule) {
  try {
    return await axios.post(`${apiUrl}/trainer-schedules`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับดึงตารางเทรนทั้งหมด (ต้องการ Token)
async function GetTrainerSchedules() {
  try {
    return await axios.get(`${apiUrl}/trainer-schedules`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับดึงตารางเทรนตาม ID (ต้องการ Token)
async function GetTrainerScheduleById(id: number) {
  try {
    return await axios.get(`${apiUrl}/trainer-schedules/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับอัปเดตตารางเทรนตาม ID (ต้องการ Token)
async function UpdateTrainerScheduleById(id: number, data: ITrainerSchedule) {
  try {
    return await axios.put(`${apiUrl}/trainer-schedules/${id}`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันสำหรับลบตารางเทรนตาม ID (ต้องการ Token)
async function DeleteTrainerScheduleById(id: number) {
  try {
    return await axios.delete(`${apiUrl}/trainer-schedules/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

export async function UploadTrainerImage(id: number, file: File) {
  const formData = new FormData();
  formData.append("file", file); // ✅ เปลี่ยน key เป็น "file" ให้ตรงกับ Backend

  return await axios.post(`${apiUrl}/trainers/${id}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authConfig().headers, // ✅ Endpoint นี้ต้องการ Token
    },
  });
}

async function UploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return await axios.post(`${apiUrl}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      // ✅ ลบ authConfig().headers ออก เพื่อไม่ให้ส่ง Token ไปยัง Endpoint ที่ไม่ต้องการ0
    },
  });
}

async function GetTrainerSchedulesByDate(trainerId: number, dateStr: string) {
  try {
    return await axios.get(`${apiUrl}/trainers/schedules/${trainerId}`, {
      params: { date: dateStr },
      ...authConfig(),
    });
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันใหม่สำหรับจองตารางเวลา
async function BookTrainerSchedule(schedule_id: number, user_id: number) {
  try {
    console.log("BookTrainerSchedule payload:", { schedule_id, user_id });
    return await axios.post(
      `${apiUrl}/train-bookings`,
      {
        schedule_id: schedule_id,
        user_id: user_id,   
        booking_status: "Booked",
        booking_date: new Date().toISOString(),
      },
      authConfig()
    );
  } catch (e: any) {
    return e.response;
  }
}

// ฟังก์ชันใหม่สำหรับยกเลิกการจอง
async function CancelTrainBooking(bookingId: number) {
  try {
    return await axios.delete(`${apiUrl}/train-bookings/${bookingId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}


// ฟังก์ชันสำหรับดึงข้อมูลการจองของ User (ต้องการ Token)
async function GetBookingsByUserId(userId: number) {
  try {
    return await axios.get<TrainBookingInterface[]>(
      `${apiUrl}/train-bookings/user/${userId}`,
      authConfig()
    );
  } catch (e: any) {
    return e.response;
  }
}

async function GetTrainerSchedulesByTrainer(trainerID: number) {
  try {
    return await axios.get(`${apiUrl}/trainer-schedules/allschedules/${trainerID}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

export {
  SignIn,
  GetGender,
  GetUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,
  CreateTrainer,
  GetTrainers,
  DeleteTrainerById,
  UpdateTrainerById,
  GetTrainerById,
  CreateTrainerSchedule,
  GetTrainerSchedules,
  GetTrainerScheduleById,
  UpdateTrainerScheduleById,
  DeleteTrainerScheduleById,
  UploadImage,
  GetTrainerSchedulesByDate,
  BookTrainerSchedule,
  CancelTrainBooking,
  GetBookingsByUserId,
  GetTrainerSchedulesByTrainer,
};
