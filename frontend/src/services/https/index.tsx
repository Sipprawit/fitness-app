import type { UsersInterface } from "../../interface/IUser";
import type { SignInInterface } from "../../interface/SignIn";
import axios, { type AxiosRequestConfig } from "axios";
import type { NutritionData } from "../../interface/Nutrition";

const apiUrl = "http://localhost:8000";

function authConfig(): AxiosRequestConfig {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

async function SignIn(data: SignInInterface) {
  try {
    return await axios.post(`${apiUrl}/signin`, data);
  } catch (e: any) {
    return e.response;
  }
}

async function GetGender() {
  try {
    // ไม่ต้องใส่ token ตอนยังไม่ล็อกอิน
    return await axios.get(`${apiUrl}/genders`);
  } catch (e: any) {
    return e.response;
  }
}

async function GetUsers() {
  try {
    return await axios.get(`${apiUrl}/users`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetUsersById(id: string) {
  try {
    return await axios.get(`${apiUrl}/user/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function UpdateUsersById(id: string, data: UsersInterface) {
  try {
    return await axios.put(`${apiUrl}/user/${id}`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function DeleteUsersById(id: string) {
  try {
    return await axios.delete(`${apiUrl}/user/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function CreateUser(data: UsersInterface) {
  try {
    return await axios.post(`${apiUrl}/signup`, data);
  } catch (e: any) {
    return e.response;
  }
}

// Nutrition APIs
async function GetNutrition(date?: string) {
  try {
    const q = date ? `?date=${encodeURIComponent(date)}` : "";
    return await axios.get(`${apiUrl}/api/nutrition${q}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function UpsertNutrition(data: any) {
  try {
    return await axios.post(`${apiUrl}/api/nutrition`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

export { SignIn, GetGender, GetUsers, GetUsersById, UpdateUsersById, DeleteUsersById, CreateUser, GetNutrition, UpsertNutrition };

// Nutrition services
export async function getNutrition(date?: string) {
  try {
    const url = date ? `${apiUrl}/api/nutrition?date=${date}` : `${apiUrl}/api/nutrition`;
    return await axios.get(url, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

export async function upsertNutrition(payload: NutritionData) {
  try {
    return await axios.post(`${apiUrl}/api/nutrition`, payload, authConfig());
  } catch (e: any) {
    return e.response;
  }
}
