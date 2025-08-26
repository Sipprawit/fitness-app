import type { UsersInterface } from "../../interface/IUser";
import type { SignInInterface } from "../../interface/SignIn";
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

export {
  SignIn,
  GetGender,
  GetUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,
};
